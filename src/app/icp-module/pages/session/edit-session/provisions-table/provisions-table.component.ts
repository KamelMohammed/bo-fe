import { EditProvisionComponent } from './edit-provision/edit-provision.component';
import { EventType } from '../../../../services/model/icp-age.model';
import { ServiceActiviySchedulingService } from '../../../../services/api/service-activiy-scheduling.service';
import { Provision, ProvisionState } from '../../../../services/model/pai-service-activiy-scheduling.model';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { map, Observable } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconNotProvide, iconProvide } from 'infrastructure/fidcare/utils/icons.utils';

@Component({
	selector: 'app-provisions-table',
	templateUrl: './provisions-table.component.html',
	styleUrls: ['./provisions-table.component.scss']
})
export class ProvisionsTableComponent extends BaseListTablePage<Provision> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Input() sessionId: string;
	@Input() readonly: boolean = false;
	@Output() allSessionClosed: EventEmitter<boolean> = new EventEmitter();
	private _user: Profile;

	constructor(
		private _sessionService: ServiceActiviySchedulingService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService
	) {
		super(_activatedRoute, true);
		this.createColumms();
		this.createActions();

	}

	protected initialize = () => {
		this._profileService.profile$.subscribe((user: Profile) => {
			this._user = user;
		});
	};



	private getDecoratorProvisions = (): Observable<Provision[]> => {
		return this._sessionService.getProvisions(this.sessionId).pipe(map((result) => {
			let allProvided = true;
			result.forEach((r) => {
				allProvided = allProvided && r.state != ProvisionState.NEW;
			})
			this.allSessionClosed.emit(allProvided);
			return result;
		}))
	}


	protected getDataTableManager = (): ListTableManager<Provision> => {
		return new ListTableManager("1", this.getDecoratorProvisions);
	}

	private createColumms = (): void => {
		let name = DataTableUtils.createStringColumn("name", "icp.sessions.provisions.nameLabel", false);
		this.tableColumns.push(name);

		let date = DataTableUtils.createDateColumn("date", "icp.sessions.provisions.dateLabel", false);
		this.tableColumns.push(date);

		let duration = DataTableUtils.createNumberColumn("duration", "icp.sessions.provisions.durationLabel");
		this.tableColumns.push(duration);

		let operator = DataTableUtils.createStringColumn("operator", "icp.sessions.provisions.operatorLabel", false);
		this.tableColumns.push(operator);

		let state = DataTableUtils.createEnumColumn("state", "icp.sessions.provisions.stateLabel", "ProvisionState", false);
		this.tableColumns.push(state);
	}

	private createActions = (): void => {

		

		let button = new DataTableAction();
		button.funcToInvoke = this.provide;
		button.label = "common.provide";
		button.icon = iconProvide;
		button.enableFunc = (row:Provision)=> row.state==ProvisionState.NEW && !this.readonly;
		this.tableActions.push(button);

		button = new DataTableAction();
		button.funcToInvoke = this.notProvide;
		button.label = "common.notProvide";
		button.icon = iconNotProvide;
		button.enableFunc = (row:Provision)=> row.state==ProvisionState.NEW && !this.readonly;
		this.tableActions.push(button);
	}

	public provide = (row: Provision): void => {
		this._dialogService.show(EditProvisionComponent, {

			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				provisionId: row.id,
				sessionId: this.sessionId,
				operatorId: this._user.userId,
				provisionType: ProvisionState.PROVIDED
			}
		});
	}

	public notProvide = (row: Provision): void => {
		this._dialogService.show(EditProvisionComponent, {

			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				provisionId: row.id,
				sessionId: this.sessionId,
				operatorId: this._user.userId,
				provisionType: ProvisionState.NOT_PROVIDED
			}
		});
	}


	private refreshList = (data?: any) => {
		this.dataTableManager.startReload();
	}


}

class Filters {
}
