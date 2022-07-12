import { EventEmitter } from '@angular/core';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { UnicDiaryService } from '../../../../../../icp-module/services/api/unic-diary.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableColumn, DataTableAction, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DiaryServiceActivityListItem } from '../../../../../../icp-module/services/model/patient-diary.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { of } from 'rxjs';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { EditDiaryServiceActivityComponent } from '../edit-diary-service-activity/edit-diary-service-activity.component';
import moment from 'moment';

@Component({
	selector: 'app-diary-service-activity-table',
	templateUrl: './diary-service-activity-table.component.html',
	styleUrls: ['./diary-service-activity-table.component.scss']
})
export class DiaryServiceActivityTableComponent extends BaseListTablePage<DiaryServiceActivityListItem> implements OnInit, OnChanges {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Input() activity: DiaryServiceActivityListItem[];
	@Input() patientDiaryId: string;
	@Input() date: string;
	@Output() updateData: EventEmitter<boolean> = new EventEmitter();
	private _isPatient: boolean;
	private _initialized: boolean = false;


	constructor(
		private _diaryService: UnicDiaryService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService,
	) {
		super(_activatedRoute, true);
	}

	public myDeletedRow=(row: DiaryServiceActivityListItem):boolean=>{
		return row.deleted;
	}


	protected initialize = () => {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (!this._initialized) {
				this.date = moment(this.date).toDate().toDateString();
				this.createColumms();
				this.createActions();
				this.dataTableManager.startReload();
				this._isPatient = user.isPatient;
				this._initialized = true;
			}
		});

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["activity"] && this.dataTableManager) {
			this.dataTableManager.startReload();
		}
	}


	protected getDataTableManager = (): ListTableManager<DiaryServiceActivityListItem> => {
		return new ListTableManager("to fix", () => of(this.activity));
	}

	private createColumms = (): void => {

		let professionalName = DataTableUtils.createStringColumn("professionalName", "icp.patientDiary.listDiaryActivities.professionalNameLabel", false);
		this.tableColumns.push(professionalName);

		let servicesName = DataTableUtils.createArrayColumn("servicesName", "icp.patientDiary.listDiaryActivities.servicesNameLabel", "", false);
		this.tableColumns.push(servicesName);

		let activitiesName = DataTableUtils.createArrayColumn("activitiesName", "icp.patientDiary.listDiaryActivities.activityNameLabel", "", false);
		this.tableColumns.push(activitiesName);

		let effectiveDuration = DataTableUtils.createIntColumn("effectiveDuration", "icp.patientDiary.listDiaryActivities.effectiveDurationLabel", false);
		this.tableColumns.push(effectiveDuration);

		let expectedDuration = DataTableUtils.createIntColumn("expectedDuration", "icp.patientDiary.listDiaryActivities.expectedDurationLabel", false);
		this.tableColumns.push(expectedDuration);

		let notes = DataTableUtils.createStringColumn("notes", "icp.patientDiary.listDiaryActivities.notesLabel", false);
		this.tableColumns.push(notes);

		let operator = DataTableUtils.createStringColumn("operatorFullName", "icp.patientDiary.listDiaryActivities.operator", false);
		this.tableColumns.push(operator);

	}

	private createActions = (): void => {


		let button = new DataTableAction();
		button.funcToInvoke = this.edit;
		button.label = "common.edit";
		button.icon = iconEdit;
		button.enableFunc = (row: DiaryServiceActivityListItem) => !row.deleted;

		this.tableActions.push(button);


		button = new DataTableAction();
		button.funcToInvoke = this.delete;
		button.label = "common.delete";
		button.icon = iconTrash;
		this.tableActions.push(button);
		button.enableFunc = (row: DiaryServiceActivityListItem) => !row.deleted && !this._isPatient;
	}



	public edit = (row: DiaryServiceActivityListItem): void => {
		this._dialogService.show(EditDiaryServiceActivityComponent, {
			panelClass: 'modal-lg',
			data: {
				diaryServiceActivityId: row.id,
				readonly: true,
				patientDiaryId: this.patientDiaryId,
				isPatient: this._isPatient
			},
			callback: this.refreshList,
		});
	}


	private refreshList = (data?: any) => {
		if (data) {
			this.updateData.emit(true);
			this.dataTableManager.startReload();
		}
	}

	public delete = (row: DiaryServiceActivityListItem): void => {
		let deleteCall = (res) => {
			if (res) {
				this._diaryService.deleteDiaryServiceActivity(this.patientDiaryId, row.id).subscribe((result) => {
					this.refreshList(true);
				});
			}

		};

		this._dialogService.showConfirm("icp.pas.listPasActivity.deletePasActivityConfirmTitle", "icp.pas.listPasActivity.deletePasActivityConfirmDescription", { callback: deleteCall });


	}
}

class Filters {
}