import { ListTableManager } from './../../../../../../infrastructure/fidcare/components/data-table/types';
import { SearchCriteria } from './../../../../../../infrastructure/fidcare/models/common.models';
import { map, Observable, of } from 'rxjs';
import { ActivityLogResponse } from './../../../../model/access-proposal.model';
import { BaseDataTablePage } from 'app/icp-module/pages/base-data-table.page';
import { Component, OnInit } from '@angular/core';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SearchResult } from 'infrastructure/fidcare/models/common.models';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';

@Component({
	selector: 'app-activity-log-page',
	templateUrl: './activity-log-page.component.html',
	styleUrls: ['./activity-log-page.component.scss']
})
export class ActivityLogPageComponent extends BaseListTablePage<ActivityLogResponse> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	private _user: Profile;
	private _initialized: boolean = false;
	private config: any;
	public id: string;
	public lastUpdate: string;
	public patientFullName: string;

	constructor(
		private _accessProposalService: AccessProposalService,
		private _translateService: TranslateService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _profileService: ProfileService,
		private _dialogRef: MatDialogRef<ActivityLogPageComponent>,
	) {
		super(_activatedRoute, true);
	}

	protected initialize = () => {
		this._profileService.loadUserProfile().subscribe((user) => {
			this._user = user;
			this._initialized = true;
			this.id = this.config.data.id;
			this.patientFullName = this.config.data.patientFullName;
			this.lastUpdate = this.config.data.lastUpdate;
			this.createColumms();
			this.createActions();
			this.dataTableManager.startReload();
		});
	};

	private _getLog = (): Observable<ActivityLogResponse[]> => {
		if (this.id) {
			return this._accessProposalService.register(this.id).pipe(map((result) => result.content));
		} else {
			return of([]);
		}
	}


	protected getDataTableManager = (): ListTableManager<ActivityLogResponse> => {
		return new ListTableManager("to fix", this._getLog);
	}

	private createColumms = (): void => {
		let activityDate = DataTableUtils.createDateTimeColumn("activityDate", "mef.accessProposal.log.activityDateLabel", true);
		this.tableColumns.push(activityDate);

		let user = DataTableUtils.createStringColumn("user", "mef.accessProposal.log.userLabel", true);
		this.tableColumns.push(user);


		let action = DataTableUtils.createStringColumn("action", "mef.accessProposal.log.actionLabel", true);
		this.tableColumns.push(action);


		let field = DataTableUtils.createStringColumn("field", "mef.accessProposal.log.fieldLabel", true);
		this.tableColumns.push(field);

		let newValue = DataTableUtils.createStringColumn("newValue", "mef.accessProposal.log.newValueLabel", true);
		this.tableColumns.push(newValue);

		let oldValue = DataTableUtils.createStringColumn("oldValue", "mef.accessProposal.log.oldValueLabel", true);
		this.tableColumns.push(oldValue);

	}

	private createActions = (): void => {
	}

	public back() {
		this._dialogRef.close(false);
	}

	public get title(): string {
		return "mef.accessProposal.log.title";
	}


}

class Filters {
}
