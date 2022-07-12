import { iconViewDetails } from './../../../../../../infrastructure/fidcare/utils/icons.utils';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { EditNotePageComponent } from './edit-note-page/edit-note-page.component';
import { NoteType, PAINote } from './../../../../services/model/pai.model';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { Component, Input } from '@angular/core';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { Location } from '@angular/common';
import { iconEdit } from 'infrastructure/fidcare/utils/icons.utils';
import { Doctor } from 'app/icp-module/services/model/user';
import { UserService } from 'app/icp-module/services/api/user.service';
import { P } from '@angular/cdk/keycodes';

@Component({
	selector: 'app-pai-notes-page',
	templateUrl: './pai-notes-page.component.html',
	styleUrls: ['./pai-notes-page.component.css']
})
export class PaiNotesPageComponent extends BaseListTablePage<PAINote> {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	private paiId: string;
	@Input() patientId: string;
	@Input() caseManagerId: string;
	private _initialized: boolean = false;

	constructor(
		private _paiService: PAIService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService,
		private _location: Location,
		private _userService: UserService
	) {
		super(_activatedRoute, true);
	}


	protected initialize = () => {
		if (!this._initialized) {
			this._activatedRoute.params.subscribe(params => {
				this.paiId = params['id'];
				this._paiService.details(this.paiId).subscribe((pai) => {
					this.caseManagerId = pai.caseManagerId;
					this._profileService.profile$.subscribe((user) => {
						if (user.isCSanitario || user.userId == this.patientId || user.userId == this.caseManagerId) {
							if (!this._initialized) {
								this.createColumms();
								this.createActions();
								this.dataTableManager.startReload();
								this._initialized = true;
							}
						}
					});
				});
			});
		}
	}

	private getDecoratedProfessionals = (): Observable<PAINote[]> => {
		if (this.paiId) {
			return this._paiService.listPAIStateChanges(this.paiId);
		} else {
			return of([]);
		}
	}



	protected getDataTableManager = (): ListTableManager<PAINote> => {
		return new ListTableManager("to fix", this.getDecoratedProfessionals);
	}

	private createColumms = (): void => {
		let date = DataTableUtils.createDateColumn("startDate", "icp.pai.listNotes.dateLabel");
		this.tableColumns.push(date);

		let user = DataTableUtils.createStringColumn("caseManagerFullName", "icp.pai.listNotes.userLabel");
		this.tableColumns.push(user);

		let action = DataTableUtils.createStringColumn("action", "icp.pai.listNotes.actionLabel");
		this.tableColumns.push(action);
	}

	private createActions = (): void => {
		let button = new DataTableAction();
		button.funcToInvoke = this.edit;
		button.label = "common.details";
		button.icon = iconViewDetails;
		this.tableActions.push(button);
	}

	public edit = (row: PAINote): void => {

		let noteType: NoteType;
		switch (row.action) {
			case "Interruzione PAI":
				noteType = NoteType.STOP;
				break;
			case "Sospensione PAI":
				noteType = NoteType.SUSPEND;
				break;
			case "Disapprovazione PAI":
				noteType = NoteType.DISAPPROVE;
		}

		this._dialogService.show(EditNotePageComponent, {
			panelClass: 'modal-lg',
			data: {
				paiId: this.paiId,
				noteId: row.id,
				noteType: NoteType[noteType],
				readonly: true,
				caseManagerId: this.caseManagerId,
				patientId: this.patientId
			}
		});
	}


	public goBack() {
		this._location.back();
	}
}



class Filters {
}
