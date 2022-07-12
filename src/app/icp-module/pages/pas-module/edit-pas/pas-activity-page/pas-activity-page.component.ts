import { PAIService } from 'app/icp-module/services/api/pai.service';
import { iconViewDetails } from './../../../../../../infrastructure/fidcare/utils/icons.utils';
import { PAI_PAS } from './../../../../services/api/pai-pas-common.service';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { ScheduleServiceActivityPageComponent } from './../../../pai/schedule-service-activity-page/schedule-service-activity-page.component';
import { ServiceActivityListItem } from '../../../../services/model/pai-pas-common';
import { PAIPASCommonService } from '../../../../services/api/pai-pas-common.service';
import { PASListItem } from '../../../../services/model/pas.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute } from '@angular/router';
import { map, observable, Observable, of } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconCalendar, iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { EditPasActivityComponent } from '../../edit-pas-activity/edit-pas-activity.component';

@Component({
	selector: 'app-pas-activity-page',
	templateUrl: './pas-activity-page.component.html',
	styleUrls: ['./pas-activity-page.component.scss']
})
export class PasActivityPageComponent extends BaseListTablePage<ServiceActivityListItem> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Output() pasActivitiesCounter = new EventEmitter<number>();
	@Input() readonly: boolean = false;
	@Input() itemId: string;
	@Input() pai_pas: PAI_PAS;
	@Input() history: boolean;
	@Input() reloadTable: Observable<void>;
	private _paiState: string='';
	private _initialized: boolean = false;

	constructor(
		private _serviceActivityService: PAIPASCommonService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService,
		private _paiService: PAIService
	) {
		super(_activatedRoute, true);

	}

	protected initialize = (): void => {
		this.reloadTable.subscribe(()=>{
			this.dataTableManager.startReload();
		});
		
		if (!this._initialized) {
			if (this.pai_pas == PAI_PAS.PAI) {
				this._paiService.details(this.itemId).subscribe((result) => {
					this._paiState = result.state;
					this.createColumms();
					this.createActions();
					this._initialized = true;
					this.dataTableManager.startReload();
				});
			} else {
				this.createColumms();
				this.createActions();
				this._initialized = true;
			}

		}
	}

	private getDecoratedProfessionals = (): Observable<ServiceActivityListItem[]> => {
		if (this.itemId) {
			return this._serviceActivityService.listServiceActivity(this.itemId, this.pai_pas).pipe(
				map((r) => {
					if (r) this.pasActivitiesCounter.emit(r.length);
					console.log(r);
					return r;
				})
			)
		}
	}


	protected getDataTableManager = (): ListTableManager<ServiceActivityListItem> => {
		return new ListTableManager("to fix", this.getDecoratedProfessionals);
	}

	private createColumms = (): void => {
		let professionalName = DataTableUtils.createStringColumn("professionalName", "icp.pas.listPasActivity.professionalNameLabel", false);
		this.tableColumns.push(professionalName);

		let servicesName = DataTableUtils.createArrayColumn("servicesName", "icp.pas.listPasActivity.servicesNameLabel", "", false);
		this.tableColumns.push(servicesName);

		let activitiesName = DataTableUtils.createArrayColumn("activitiesName", "icp.pas.listPasActivity.activityNameLabel", "", false);
		this.tableColumns.push(activitiesName);

		let duration = DataTableUtils.createIntColumn("duration", "icp.pas.listPasActivity.durationLabel", false);
		this.tableColumns.push(duration);

		let frequency = DataTableUtils.createStringColumn("frequency", "icp.pas.listPasActivity.frequencyLabel", false);
		this.tableColumns.push(frequency);

	}

	private createActions = (): void => {
		let button;
		if (this.readonly) {
			button = new DataTableAction();
			button.funcToInvoke = this.edit;
			button.label = "common.details";
			button.icon = iconViewDetails;
			this.tableActions.push(button);
		}
		else {
			button = new DataTableAction();
			button.funcToInvoke = this.edit;
			button.label = "common.edit";
			button.icon = iconEdit;
			this.tableActions.push(button);
		}

		button = new DataTableAction();
		button.funcToInvoke = this.delete;
		button.label = "common.delete";
		button.icon = iconTrash;
		button.enableFunc = () => { return !this.readonly && !this.history };
		this.tableActions.push(button);

		button = new DataTableAction();
		button.funcToInvoke = this.schedule;
		button.label = "calendarizza";
		button.icon = iconCalendar;
		button.enableFunc = (serviceActivity: ServiceActivityListItem) => { return this.pai_pas == PAI_PAS.PAI && !this.history && !this.readonly && !serviceActivity.alreadyScheduled && this._paiState=="ATTIVATO"};
		this.tableActions.push(button);
	}

	public schedule = (row: ServiceActivityListItem): void => {
		this._dialogService.show(ScheduleServiceActivityPageComponent, {
			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				readonly: false,
				activityId: row.id,
				itemId: this.itemId,
				maxAccess: row.maxAccessNumber,
				minAccess: row.minAccessNumber
			}
		});
	}

	public edit = (row: ServiceActivityListItem): void => {
		this._dialogService.show(EditPasActivityComponent, {

			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				readonly: this.readonly,
				itemId: this.itemId,
				activityId: row.id,
				pai_pas: this.pai_pas,
				history: this.history
			}
		});
	}

	public add = (): void => {
		this._dialogService.show(EditPasActivityComponent, {
			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				itemId: this.itemId,
				pai_pas: this.pai_pas
			}
		});
	}

	private refreshList = () => {
		this.dataTableManager.startReload();
		this.pasActivitiesCounter.emit((this.dataTableManager.getCurrentItems() || []).length);
	}

	public delete = (row: PASListItem): void => {
		let deleteCall = (res) => {
			if (res) {
				this._serviceActivityService.deleteServiceActivity(this.itemId, row.id, this.pai_pas).subscribe((result: any) => {
					this.refreshList();
				});
			}

		};

		this._dialogService.showConfirm("icp.pas.listPasActivity.deletePasActivityConfirmTitle", "icp.pas.listPasActivity.deletePasActivityConfirmDescription", { callback: deleteCall });


	}
}

class Filters {
}