import { iconDownload } from 'infrastructure/fidcare/utils/icons.utils';
import { SessionAttachment } from './../../../../services/model/pai-service-activiy-scheduling.model';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { Component, Input, OnInit } from '@angular/core';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ServiceActiviySchedulingService } from 'app/icp-module/services/api/service-activiy-scheduling.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Observable } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';

@Component({
	selector: 'app-session-attachments-table',
	templateUrl: './session-attachments-table.component.html',
	styleUrls: ['./session-attachments-table.component.scss']
})
export class SessionAttachmentsTableComponent extends BaseListTablePage<SessionAttachment> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Input() sessionId: string;
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



	private getDecoratorProvisions = (): Observable<SessionAttachment[]> => {
		return this._sessionService.listAttachments(this.sessionId);
	}


	protected getDataTableManager = (): ListTableManager<SessionAttachment> => {
		return new ListTableManager("to fix", this.getDecoratorProvisions);
	}

	private createColumms = (): void => {
		let name = DataTableUtils.createStringColumn("documentName", "icp.sessions.provisions.nameLabel", false);
		this.tableColumns.push(name);

	}

	private createActions = (): void => {

		let button = new DataTableAction();
		button.funcToInvoke = this.download;
		button.label = "common.download";
		button.icon = iconDownload;
		this.tableActions.push(button);

	}

	public download = (row: SessionAttachment): void => {
		
	}



	private refreshList = (data?: any) => {
		this.dataTableManager.startReload();
	}


}

class Filters {
}
