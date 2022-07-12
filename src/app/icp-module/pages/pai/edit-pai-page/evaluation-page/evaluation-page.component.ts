import { Doctor } from './../../../../services/model/user';
import { PAI } from './../../../../services/model/pai.model';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Evaluation, EvaluationType } from 'app/icp-module/services/model/pai.model';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { mergeMap, Observable, map, forkJoin } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { EditEvaluationPageComponent } from './edit-evaluation-page/edit-evaluation-page.component';
import { UserService } from 'app/icp-module/services/api/user.service';
import moment from 'moment';

@Component({
	selector: 'app-evaluation-page',
	templateUrl: './evaluation-page.component.html',
	styleUrls: ['./evaluation-page.component.css']
})
export class EvaluationPageComponent extends BaseListTablePage<Evaluation> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Input() paiId: string;
	@Input() evaluationType: EvaluationType;
	//@Input() patientiId: string;
	@Input() caseManagerId: string;
	@Input() history: boolean;
	public isCSanitario: boolean;
	public currentPAI: PAI;
	private _user: Profile;
	@Input() reloadTable: Observable<void>;
	private _initialized: boolean = false;

	constructor(
		private _paiService: PAIService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService,
		private _userService: UserService,
	) {
		super(_activatedRoute, true);
	}


	protected initialize = () => {
		this.reloadTable.subscribe(() => {
			this.dataTableManager.startReload();
		});
		this._profileService.profile$.subscribe((user: Profile) => {
			this.isCSanitario = user.isCSanitario;
			this._user = user;
			//TODO controllare che sia del gruppo uvi o case manager
			this._paiService.details(this.paiId).subscribe((result) => {
				this.currentPAI = result;
				if (!this._initialized) {
					this.createColumms();
					this.createActions();
					this._initialized = true;
					this.dataTableManager.startReload();
				}
			});

		});
	};




	private getDecoratedProfessionals = (): Observable<Evaluation[]> => {
		return this._paiService.listEvaluation(this.paiId, this.evaluationType);
	}


	protected getDataTableManager = (): ListTableManager<Evaluation> => {
		return new ListTableManager("to fix", this.getDecoratedProfessionals);
	}

	private createColumms = (): void => {
		let professionalName = DataTableUtils.createStringColumn("uviMemberFullName", "icp.pai.listEvaluation.uviMemberIdLabel", false);
		this.tableColumns.push(professionalName);

		let servicesName = DataTableUtils.createDateColumn("date", "icp.pai.listEvaluation.dateLabel", false);
		this.tableColumns.push(servicesName);
	}

	private createActions = (): void => {


		let button = new DataTableAction();
		button.funcToInvoke = this.edit;
		button.label = "common.edit";
		button.icon = iconEdit;
		button.enableFunc = (evaluation: Evaluation) => {
			if (this.evaluationType == EvaluationType.finalevaluation) {
				return moment(this.currentPAI.endDate).isSame(moment()) && evaluation.uviMemberId == this._user.userId;
			} else {
				return moment(evaluation.date).isSame(moment()) && evaluation.uviMemberId == this._user.userId;
			}
		};
		this.tableActions.push(button);

		button = new DataTableAction();
		button.funcToInvoke = this.delete;
		button.label = "common.delete";
		button.icon = iconTrash;
		button.enableFunc = () => this.isCSanitario;
		this.tableActions.push(button);
	}

	public edit = (row: Evaluation): void => {
		this._dialogService.show(EditEvaluationPageComponent, {

			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				paiId: this.paiId,
				evaluationId: row.id,
				evaluationType: this.evaluationType, //EvaluationType[this.evaluationType],
				caseMangerId: this.caseManagerId,
				//patientId: this.patientiId,
				history: this.history
			}
		});
	}

	public add = (): void => {
		this._dialogService.show(EditEvaluationPageComponent, {
			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				paiId: this.paiId,
				evaluationType: this.evaluationType, //EvaluationType[this.evaluationType],
				history: this.history
			}
		});
	}

	private refreshList = (data?: any) => {
		this.dataTableManager.startReload();
	}

	public delete = (row: Evaluation): void => {
		let deleteCall = (res) => {
			if (res) {
				this._paiService.deleteEvaluation(this.paiId, row.id, this.evaluationType /*EvaluationType[this.evaluationType]*/).subscribe((result) => {
					this.refreshList()
				})
			}

		};
		this._dialogService.showConfirm("icp.pas.listPasActivity.deletePasActivityConfirmTitle", "icp.pas.listPasActivity.deletePasActivityConfirmDescription", { callback: deleteCall });

	}
}

class Filters {
}
