import { EventEmitter, Output } from '@angular/core';
import { SearchResult } from './../../../../../infrastructure/fidcare/models/common.models';
import { ActivityLogPageComponent } from './activity-log-page/activity-log-page.component';
import { Profile, Roles } from './../../../../../infrastructure/fidcare/models/profile.models';
import { iconTrash, iconViewDetails, iconActivate, iconApprove } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { AccessProposalService } from './../../../services/access-proposal.service';
import { AccessProposalMinResponse, AccessProposalSearchCriteria, AccessProposalStatus } from './../../../model/access-proposal.model';
import { BaseDataTablePage } from 'app/icp-module/pages/base-data-table.page';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { map, Observable, of } from 'rxjs';
import { EditAccessProposalPageComponent } from 'app/mef-module/pages/access-proposals-page/access-proposal-details/edit-access-proposal-page.component';

@Component({
	selector: 'app-list-access-proposals-page',
	templateUrl: './list-access-proposals-page.component.html',
	styleUrls: ['./list-access-proposals-page.component.scss']
})
export class ListAccessProposalsPageComponent extends BaseDataTablePage<AccessProposalMinResponse, Filters> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	@Input() public history: boolean=undefined;
	@Input() public patientId:string;
	//if i can add a new access proposal -> false is is history or i am in readonly mode
	@Input() public canAddProposal: boolean =false;
	@Output() public addProposal : EventEmitter<boolean>= new EventEmitter();
	@Output() public proposalUpdates: EventEmitter<any> = new EventEmitter();

	private _user: Profile;
	private _initialized: boolean = false;
	public filters: Filters = new Filters();
    public filterDef: TableFilterFieldDef[] = [];

	states: Observable<SelectListitem[]> = of([]);

	get showAddButton() {
		return !this.history && this.canAddProposal && this._profileService.isInRole(Roles.DOCTOR) && this.dataTableManager && this.patientId && (<RemoteDataTableManager>this.dataTableManager).totalCount==0;
	}

	constructor(
		private _accessProposalService: AccessProposalService,
		private _translateService: TranslateService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _profileService: ProfileService,
		private _dialogServide: DialogService
	) {
		super(_activatedRoute, true);
		
	}

	protected initialize = () => {
		if(!this._initialized){
			if(this.history){
				this.states = of([
					"REFUSED", "REJECTED", "CLOSE"].map(state => new SelectListitem(state, this._translateService.instant("mef.accessProposal.statesEnum."+state)))
				);
			}
			else{
				this.states = of([
					"SAVED", "TO_SEND", "TO_EVALUATE", "REJECTED", "ACCEPTED_COMPLEX_NEED", "ACCEPTED_SIMPLE_NEED"].map(state => new SelectListitem(state, "mef.accessProposal.statesEnum."+state))
				);
			}
			
			this.filterDef = [
				{
					fieldName: "state",
					defaultValue: null,
					fieldType: 'select',
					validators: [],
					label: "mef.accessProposal.listAccessProposals.filterStateLabel",
					possibleDataValues: this.states
				}
			];
			this.createColumms();
			this.createActions();
			this._initialized = true;
		}
		this._profileService.loadUserProfile().subscribe((user) => {
			this._user = user;
					
		});
	};

	private _getCurrentAccessProposalByPatientId=(searchCriteria: AccessProposalSearchCriteria): Observable<SearchResult<AccessProposalMinResponse>>=>{
		return this._accessProposalService.detailsCurrentAccessProposalByPatient(this.patientId).pipe(map((result)=>{
			let proposal: AccessProposalMinResponse = new AccessProposalMinResponse();
			let response:SearchResult<AccessProposalMinResponse> = new SearchResult();
			let content :AccessProposalMinResponse[] =[];
			if (result) {
				Object.assign(proposal,result);
				content.push(proposal);
				response.content=content;
				response.totalElements=1;
			}
			
			return response;
		}));
	}

	private _getHistoryAccessProposalByPatientId=(searchCriteria: AccessProposalSearchCriteria): Observable<SearchResult<AccessProposalMinResponse>>=>{
		return this._accessProposalService.detailsHistoryAccessProposalByPatient(this.patientId).pipe(map((result)=>{
			let proposal: AccessProposalMinResponse = new AccessProposalMinResponse();
			let response:SearchResult<AccessProposalMinResponse> = new SearchResult();
			let content :AccessProposalMinResponse[] =[];
			if (result) {
				Object.assign(proposal,result);
				content.push(proposal);
				response.content=content;
				response.totalElements=1;
			}
			return response;
		}));
	}


	protected getDataTableManager = (searchCriteria: AccessProposalSearchCriteria): IDataTableManager<AccessProposalMinResponse> => {
		switch(this.history){
			case true:
				if(this.patientId!=undefined){
					return new RemoteDataTableManager("1", this._getHistoryAccessProposalByPatientId, this.setSearchCriteria, searchCriteria)
				}else{
					return new RemoteDataTableManager("2", this._accessProposalService.listHistory, this.setSearchCriteria, searchCriteria)
				}
				break;
			case undefined:
			case false:
				if(this.patientId!=undefined){
					return new RemoteDataTableManager("3", this._getCurrentAccessProposalByPatientId, this.setSearchCriteria, searchCriteria)
				}else{
					return new RemoteDataTableManager("4", this._accessProposalService.listCurrent, this.setSearchCriteria, searchCriteria)
				}
			break;
		}
	}

	private createColumms = (): void => {
		let protocolNumber = DataTableUtils.createStringColumn("protocolNumber", "mef.accessProposal.listAccessProposals.protocolNumberLabel", true);
		this.tableColumns.push(protocolNumber);

		let lastUpdate = DataTableUtils.createDateColumn("lastUpdate", "mef.accessProposal.listAccessProposals.lastUpdateLabel", true);
		this.tableColumns.push(lastUpdate);

		let name = DataTableUtils.createStringColumn("patientName", "mef.accessProposal.listAccessProposals.patientNameLabel", true);
		this.tableColumns.push(name);

		let surname = DataTableUtils.createStringColumn("patientSurname", "mef.accessProposal.listAccessProposals.patientSurnameLabel", true);
		this.tableColumns.push(surname);

		let state = DataTableUtils.createEnumColumn("enumStatus", "mef.accessProposal.listAccessProposals.stateLabel", "AccessProposalStatus", true);
		this.tableColumns.push(state);

	}

	private createActions = (): void => {
		let details = new DataTableAction();
		details.funcToInvoke = this.details;
		details.label = "mef.accessProposal.listAccessProposals.detailsActionLabel";
		details.icon = iconViewDetails;
		this.tableActions.push(details);

		if (!this.history) {
			let enabledDelete = (accessProposal: AccessProposalMinResponse)=> {
				return this._profileService.isInRole(Roles.DOCTOR) && (accessProposal.enumStatus == AccessProposalStatus.SAVED || accessProposal.enumStatus == AccessProposalStatus.TO_SEND || accessProposal.enumStatus == AccessProposalStatus.REJECTED);
				// return this._user && accessProposal.patientId==this._user.userId
			};
	
			let deleteButton = new DataTableAction();
			deleteButton.funcToInvoke = this.delete;
			deleteButton.label = "common.delete";
			deleteButton.icon = iconTrash;
			//TODO andrebbe abilitato solo se sono l'utente che lha caricata ma non c'è questo id
			deleteButton.enableFunc = enabledDelete;
			this.tableActions.push(deleteButton);
	
			let enableSend = (accessProposal: AccessProposalMinResponse)=> {
				return accessProposal.enumStatus == AccessProposalStatus.TO_SEND && this._profileService.isInRole(Roles.DOCTOR);
			};
			let sendButton = new DataTableAction();
			sendButton.funcToInvoke = this.sendAccessProposal;
			sendButton.label = "mef.accessProposal.listAccessProposals.sendActionLabel";
			sendButton.icon = iconApprove;
			sendButton.enableFunc = enableSend;
			this.tableActions.push(sendButton)
	
	
			let register = new DataTableAction();
			register.funcToInvoke = this.register;
			register.label = 'mef.accessProposal.log.title';
			register.icon = iconActivate;
			this.tableActions.push(register)
		}
		

	}

	public sendAccessProposal = (row: AccessProposalMinResponse): void => {
		let send = (confirm) => {
			if (confirm) {
				this._accessProposalService.send({accessProposalId: row.id}).subscribe({
					next: () => {
						this.dataTableManager.startSearch();
						this.proposalUpdates.emit(row);
					},
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogServide.showConfirm("Invia la proposta di accesso", "Sei sicuro di voler inviare la proposta di accesso selezionata?", { callback: send });
	}

	public delete = (row: AccessProposalMinResponse): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._accessProposalService.delete(row.id).subscribe({
					next: () => {
						this.dataTableManager.startSearch();
						this.proposalUpdates.emit(row);
					},
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogServide.showConfirm("Elimina proposta di accesso", "Sei sicuro di voler eliminare la proposta di accesso selezionata?", { callback: remove });
	}

	public details = (row: AccessProposalMinResponse): void => {
		console.log(row.id)
		this._dialogServide.show(EditAccessProposalPageComponent, {
			data:{
				isNew: false,
				patientId: this.patientId,
				id:row.id,
				readonly: this.history,
				history: this.history			
			},
			panelClass: 'modal-lg',
			callback: this._refreshList,
		});
	}

	public register = (row: AccessProposalMinResponse): void => {
		this._dialogServide.show(ActivityLogPageComponent, {
			data:{
				id:row.id,
				patientFullName: row.patientName +" "+ row.patientSurname,
				lastUpdate:row.lastUpdate
			},
			panelClass: 'modal-lg',
			callback: this._refreshList,
		});
	}

	private _refreshList = (): void => {
		this.dataTableManager.startReload();
		this.proposalUpdates.emit(true);
	}

	protected setSearchCriteria = (criteria: AccessProposalSearchCriteria): void => {
        criteria.state = this.filters.state;
    }

    public search = (): void => {
        this.dataTableManager.startSearch();
    }

	public create= ():void=>{
		this._dialogServide.show(EditAccessProposalPageComponent, {
			data:{
				isNew: true,
				patientId: this.patientId,
				readonly: this.history
			},
			panelClass: 'modal-xl',
			callback: this._refreshList,
		});
	} 


    public onFiltersUpdate = (data) => {
        Object.assign(this.filters, data);
        this.dataTableManager.startSearch();
    }

}

class Filters {
	public state: string;
}
