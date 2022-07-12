import { MedicalRecord } from './../../../../md-module/models/md.model';
import { iconViewDetails } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { SearchResult, SearchCriteria } from './../../../../../infrastructure/fidcare/models/common.models';
import { Profile } from './../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../infrastructure/fidcare/services/profile.service';
import { DialogService } from '../../../../../infrastructure/fidcare/services/dialog.service';
import { PAIService } from '../../../services/api/pai.service';
import { PAISearchCriteria, PAIListItem, PAI, NoteType } from '../../../services/model/pai.model';
import { Component, Input, OnInit } from '@angular/core';
import { BaseDataTablePage } from '../../base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute, Router } from '@angular/router';
import { iconActivate, iconApprove, iconDeactivate, iconDisapprove, iconEdit, iconInterrupt, iconNotes, iconSuspend, iconTerminate, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { EditNotePageComponent } from '../edit-pai-page/pai-notes-page/edit-note-page/edit-note-page.component';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { Observable, of, map, forkJoin, mergeMap, observable } from 'rxjs';
import { Doctor, Patient } from 'app/icp-module/services/model/user';
import { UserService } from 'app/icp-module/services/api/user.service';

@Component({
    selector: 'app-pai-page',
    templateUrl: './pai-page.component.html',
    styleUrls: ['./pai-page.component.scss']
})
export class CurrentPaiPageComponent extends BaseDataTablePage<PAIListItem, Filters> implements OnInit {

    public tableColumns: DataTableColumn[] = [];
    public tableActions: DataTableAction[] = [];
    public filters: Filters = new Filters();
    public filterDef: TableFilterFieldDef[] = [];
    private profile: Profile;
    public coordinatoreSanitario: boolean;
    @Input() history: boolean = false;
    @Input() current: boolean = false;
    @Input() medicalRecord: MedicalRecord;
    @Input() configuration: boolean = false;
    private _inizialited = false;
    constructor(
        _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _paiService: PAIService,
        private _dialogService: DialogService,
        private _profileService: ProfileService,
        private _userService: UserService
    ) {
        super(_activatedRoute, true);
        let states: Observable<SelectListitem[]> = of([
            "SALVATO",
            "APPROVATO",
            "ATTIVATO",
            "CALENDARIZZATO",
            "IN_CORSO",
            "SOSPESO",
            "DA_TERMINARE",
            "TERMINATO",
            "DISAPPROVATO",
            "INTERROTTO"].map(state => new SelectListitem(state, state))
        );

        this.filterDef = [
            {
                fieldName: "state",
                defaultValue: null,
                fieldType: 'select',
                validators: [],
                label: "icp.careLevel.listCareLevel.filterLevelLabel",
                possibleDataValues: states
            }
        ];

    }

    protected initialize = () => {
        if (!this._inizialited) {
            this._profileService.loadUserProfile().subscribe(result => {
                this.profile = result;
                if (this.profile.isConfigurator || this.profile.isCSanitario) {
                    this.coordinatoreSanitario = result.isCSanitario
                    this._inizialited = true;
                    this.createActions();
                }
            });
            this.createColumms();
        }
    };




    protected getDataTableManager = (searchCriteria: PAISearchCriteria): IDataTableManager<PAIListItem> => {
        if (!searchCriteria) {
            searchCriteria = new PAISearchCriteria();
            searchCriteria.patientFiscalCode = this.medicalRecord?.patient?.code;
            searchCriteria.history = this.history;
            searchCriteria.current = this.current;
        }
        return new RemoteDataTableManager("da correggere", this._paiService.list, this.setSearchCriteria, searchCriteria)
    }

    private createColumms = (): void => {

        let nameColumn = DataTableUtils.createStringColumn("name", "icp.pai.listPai.nameLabel", true);
        this.tableColumns.push(nameColumn);

        let levelColumns = DataTableUtils.createStringColumn("careLevelName", "icp.pai.listPai.careLevelLabel", true);
        this.tableColumns.push(levelColumns);


        let startDateColumn = DataTableUtils.createDateColumn("startDate", "icp.pai.listPai.startDateLabel", true);
        this.tableColumns.push(startDateColumn);

        let endDateColumn = DataTableUtils.createDateColumn("endDate", "icp.pai.listPai.endDateLabel", true);
        this.tableColumns.push(endDateColumn);


        let caseManagerColumn = DataTableUtils.createStringColumn("caseManagerFullName", "icp.pai.listPai.caseManagerLabel", true);
        this.tableColumns.push(caseManagerColumn);

        let stateColumn = DataTableUtils.createStringColumn("state", "icp.pai.listPai.stateLabel", true);
        this.tableColumns.push(stateColumn);


        let patientColumn = DataTableUtils.createStringColumn("patientFiscalCode", "icp.pai.listPai.patientIdLabel", true);
        this.tableColumns.push(patientColumn);

    }
    private createActions = (): void => {
        let editButton = new DataTableAction();
        if (this.coordinatoreSanitario && this.history==false) {
            editButton.funcToInvoke = this.edit;
            editButton.label = "modifica";
            editButton.icon = iconEdit;
        } else {
            editButton.funcToInvoke = this.edit;
            editButton.label = "dettaglio";
            editButton.icon = iconViewDetails;
        };
        this.tableActions.push(editButton)


        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.delete;
        deleteButton.label = "elimina";
        deleteButton.icon = iconTrash;
        deleteButton.enableFunc = () => this.coordinatoreSanitario && !this.history;
        this.tableActions.push(deleteButton);


        let activeButton = new DataTableAction();
        activeButton.funcToInvoke = this.active;
        activeButton.label = "attiva";
        activeButton.icon = iconActivate;
        activeButton.enableFunc = (row: PAIListItem) => (!this.history && row.state == "APPROVATO" && row.caseManagerId === this.profile.userId);
        this.tableActions.push(activeButton);

        let reactiveButton = new DataTableAction();
        reactiveButton.funcToInvoke = this.reactivate;
        reactiveButton.label = "riattiva";
        reactiveButton.icon = iconDeactivate;
        reactiveButton.enableFunc = (row: PAIListItem) => !this.history && row.state == "SOSPESO" && row.caseManagerId === this.profile.userId;
        this.tableActions.push(reactiveButton);

        let approveButton = new DataTableAction();
        approveButton.funcToInvoke = this.approve;
        approveButton.label = "approva";
        approveButton.icon = iconApprove;
        approveButton.enableFunc = (row: PAIListItem) => !this.history  && row.caseManagerId === this.profile.userId && row.canApprove;
        this.tableActions.push(approveButton);

        let deApproveButton = new DataTableAction();
        deApproveButton.funcToInvoke = this.disapprove;
        deApproveButton.label = "disapprova";
        deApproveButton.icon = iconDisapprove;
        deApproveButton.enableFunc = (row: PAIListItem) => !this.history && row.state == "SALVATO" && row.caseManagerId === this.profile.userId;
        this.tableActions.push(deApproveButton);

        let showNotesButton = new DataTableAction();
        showNotesButton.funcToInvoke = this.showNotes;
        showNotesButton.label = "visualizza note";
        showNotesButton.icon = iconNotes;
        //showNotesButton.enableFunc = () => !this.history;
        this.tableActions.push(showNotesButton);

        let interruptButton = new DataTableAction();
        interruptButton.funcToInvoke = this.interrupt;
        interruptButton.label = "interrompi";
        interruptButton.icon = iconInterrupt;
        interruptButton.enableFunc = (row: PAIListItem) => !this.history && (row.state == "SOSPESO" || row.state == "ATTIVATO" || row.state == "IN_CORSO" && row.caseManagerId === this.profile.userId);
        this.tableActions.push(interruptButton);

        let closeButton = new DataTableAction();
        closeButton.funcToInvoke = this.terminate;
        closeButton.label = "termina";
        closeButton.icon = iconTerminate;
        closeButton.enableFunc = (row: PAIListItem) => !this.history && row.state == "DA_TERMINARE" && row.caseManagerId === this.profile.userId;
        this.tableActions.push(closeButton);

        let suspendButton = new DataTableAction();
        suspendButton.funcToInvoke = this.suspend;
        suspendButton.label = "sospendi";
        suspendButton.icon = iconSuspend;
        suspendButton.enableFunc = (row: PAIListItem) => !this.history && row.state == "IN_CORSO" && row.caseManagerId === this.profile.userId;
        this.tableActions.push(suspendButton);

    }

    public active = (row: PAIListItem): void => {
        this._paiService.activatePAI(row.id).subscribe({
            next: (pai: PAI) => this.refreshList(),
        });
    }

    public approve = (row: PAIListItem): void => {
        this._paiService.approvePAI(row.id).subscribe({
            next: () => this.refreshList(),
        });
    }


    public terminate = (row: PAIListItem): void => {
        this._paiService.terminatePAI(row.id).subscribe({
            next: () => this.refreshList(),
        });
    }

    public reactivate = (row: PAIListItem): void => {
        this._paiService.reactivatePAI(row.id).subscribe({
            next: () => this.refreshList(),
        });
    }

    public disapprove = (row: PAIListItem): void => {
        this._dialogService.show(EditNotePageComponent, {
            panelClass: 'modal-lg',
            callback: this.refreshList,
            data: {
                paiId: row.id,
                noteType: NoteType.DISAPPROVE,
                readonly: false,
                caseManagerId: row.caseManagerId,
            }
        });

    }
    private refreshList = (data?: any) => {
        this.dataTableManager.startReload();
    }

    public showNotes = (row: PAIListItem): void => {
        this._router.navigate(['icp/pai/', row.id, 'notes']);
    }

    public suspend = (row: PAIListItem): void => {
        this._dialogService.show(EditNotePageComponent, {
            panelClass: 'modal-lg',
            callback: this.refreshList,
            data: {
                paiId: row.id,
                noteType: NoteType[NoteType.SUSPEND],
                readonly: false,
                caseManagerId: row.caseManagerId,
            }
        });
    }

    public interrupt = (row: PAIListItem): void => {
        this._dialogService.show(EditNotePageComponent, {
            panelClass: 'modal-lg',
            callback: this.refreshList,
            data: {
                paiId: row.id,
                noteType: NoteType[NoteType.STOP],
                readonly: false,
                caseManagerId: row.caseManagerId,
            }
        });

    }

    public edit = (row: PAIListItem): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        this._router.navigate(['icp/pai/edit', row.id], { queryParams: queryParams });
    }

    public delete = (row: PAIListItem): void => {
        let confirmCall = (result) => {
            if (result) {
                this._paiService.delete(row.id).subscribe({
                    next: () => {
                        this._dialogService.showMessage("icp.deleteOperationResult", "icp.pai.paiDeleted");
                        this.refreshList();
                    },
                    error: (message: string) => console.log(message)
                });
            }
        }



        this._dialogService.showConfirm("icp.pai.confirmDeleteTitle", "icp.pai.confirmDeleteDescription", { callback: confirmCall });

    }


    protected setSearchCriteria = (criteria: PAISearchCriteria): void => {
        criteria.history = this.history;
        criteria.current = this.current;
        criteria.state = this.filters.state;
        criteria.patientFiscalCode = this.medicalRecord?.patient?.code;
    }

    public search = (): void => {
        this.dataTableManager.startSearch();
    }


    public onFiltersUpdate = (data) => {
        Object.assign(this.filters, data);
        this.dataTableManager.startSearch();
    }

    public create = (): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        queryParams['patientId']=this.medicalRecord.patient.id;
        queryParams['patientName']=this.medicalRecord.patient.name;
        queryParams['patientSurname']=this.medicalRecord.patient.surname;
        queryParams['patientFiscalCode']=this.medicalRecord.patient.code;
        queryParams['patientEmail']=this.medicalRecord.patient.email;
        this._router.navigate(['icp/pai/edit'], {queryParams:queryParams});
    }

}

class Filters {
    state: string;
    history: boolean;
    patientFiscalCode: string;
}

