import { MemberStatus, UviMembers } from 'app/mef-module/model/uvi.model';
import { ProfileService } from '../../../../../infrastructure/fidcare/services/profile.service';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { Member } from '../../../model/uvi.model';
import { AccessProposalService } from '../../../services/access-proposal.service';
import { AccessProposalMinResponse } from '../../../model/access-proposal.model';
import { Observable, forkJoin, of } from 'rxjs';
import { UviService } from '../../../services/uvi.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { DoctorChoiceDialog } from '../elect-case-manager-page/doctor-choice-dialog.component';
import { Roles } from 'infrastructure/fidcare/models/profile.models';

@Component({
	selector: 'app-uvi-group-tab',
	templateUrl: './uvi-group-tab.component.html',
	styleUrls: ['./uvi-group-tab.component.scss']
})
export class UviGroupTabComponent extends BaseListTablePage<Member> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	@Input() public medicalRecord: MedicalRecord;
	private _accessProposal: AccessProposalMinResponse;
	private _uviMembers: UviMembers;
	private _members: Member[];
	// public canAddUviMember: boolean = false;
	private _enableAddForCSanitario = false;
	public get canAddUviMember() : boolean {
		if (this._accessProposal) {
			return this._enableAddForCSanitario && !this._accessProposal.svamaDPresence;
		}
		return false;
	}


	constructor(
		_activatedRoute: ActivatedRoute,
		private _uviService: UviService,
		private _dialogService: DialogService,
		private _accessProposalService: AccessProposalService,
		private _profileService: ProfileService
	) {
		super(_activatedRoute, true);
	}

	protected initialize = () => {
		let servicesToInvoke = {
			accessProposal: this._accessProposalService.detailsCurrentAccessProposalByPatient(this.medicalRecord.patient.id),
			user: this._profileService.loadUserProfile()
		}

		forkJoin(servicesToInvoke).subscribe((result) => {
			this._accessProposal = result.accessProposal;
			if (this._accessProposal) {
				this._uviService.getUviMembers(this._accessProposal.id).subscribe((result) => {
					this._uviMembers = result;
					this._members = result.members;
					this._enableAddForCSanitario = this._profileService.isInRole(Roles.CSANITARIO);
					this.createColumms();
					this.createActions();
					this.dataTableManager.startReload();
				});
			} else {
				this._members=[];
				this.createColumms();
				this.createActions();
				this.dataTableManager.startReload();
			}
		});


	}

	private _getMembers = (): Observable<Member[]> => {
		return of(this._members);
	}

	protected getDataTableManager = (): ListTableManager<Member> => {
		return new ListTableManager("FormsPageComponent", this._getMembers)
	}

	private createColumms = (): void => {
		let name = DataTableUtils.createStringColumn("name", "mef.houseAssistance.uviTab.nameLabel", true);
		this.tableColumns.push(name);

		let surname = DataTableUtils.createStringColumn("surname", "mef.houseAssistance.uviTab.surnameLabel", true);
		this.tableColumns.push(surname);

		let role = DataTableUtils.createEnumColumn("role", "mef.houseAssistance.uviTab.roleLabel", "MemberRole", true);
		this.tableColumns.push(role);

		let state = DataTableUtils.createEnumColumn("state", "mef.houseAssistance.uviTab.stateLabel", "MemberStatus", true);
		this.tableColumns.push(state);
	}

	private createActions = (): void => {

		let deleteButton = new DataTableAction();
		deleteButton.funcToInvoke = this.delete;
		deleteButton.label = "elimina";
		deleteButton.icon = iconTrash;
		deleteButton.enableFunc = (member: Member) => {
			return this.canAddUviMember && (member.state == MemberStatus.REFUSING || member.state == MemberStatus.CONFIRMANT);
		}
		this.tableActions.push(deleteButton);


		// let acceptButton = new DataTableAction();
		// acceptButton.funcToInvoke = this.acceptConvocation;
		// acceptButton.label = "Accetta convocazione";
		// acceptButton.icon = iconApprove;
		// acceptButton.enableFunc = (member: Member) => {
		// 	return this._accessProposal && !this._accessProposal.svamaDPresence && (member.state != MemberStatus.CONFIRMED && member.state != MemberStatus.REFUSING);
		// }
		// this.tableActions.push(acceptButton);

	}


	public delete = (row: Member): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._uviService.removeUviMember(this._accessProposal.id, row.id).subscribe({
					next: () => {
						this._refreshList()
					},
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogService.showConfirm("Elimina Membro UVI", "Sei sicuro di voler eliminare il membro UVI selezionato?", { callback: remove });
	}

	// public acceptConvocation = (row: Member): void => {
	// 	this._uviService.acceptConvocation(this._accessProposal.id,row.id).subscribe((result) => {
	// 		this._refreshList();
	// 	})
	// }


	private _refreshList = (): void => {
		this._uviService.getUviMembers(this._accessProposal.id).subscribe((result) => {
			this._uviMembers = result;
			this._members = result.members;
			this.dataTableManager.startReload();
		})
	}

	addNewDoctor = (): void => {
		let addDoctorCallBack =  (doctor: any) => {
			this._uviService.addUviMember(this._accessProposal.id,doctor.doctorId).subscribe((result) => {
				this._refreshList();
			})
		}

		this._dialogService.show(DoctorChoiceDialog, {
            panelClass: "modal-sm",
            callback: addDoctorCallBack
        })
	}
}

