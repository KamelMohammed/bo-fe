import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseDataTablePage} from "../../../../../icp-module/pages/base-data-table.page";
import {
  DataTableAction,
  DataTableColumn,
  DataTableColumnAlignment,
  RemoteDataTableManager
} from "../../../../../../infrastructure/fidcare/components/data-table/types";
import {
  AccessProposalMinResponse,
  AccessProposalSearchCriteria,
  AccessProposalStatus
} from "../../../../../mef-module/model/access-proposal.model";
import {MedicalRecord, Patient, TelevisitaItem, TelevisitaStatus} from "../../../../models/md.model";
import {
  SearchCriteria,
  SearchResult,
  SelectListitem,
  TableFilterFieldDef
} from "../../../../../../infrastructure/fidcare/models/common.models";
import {map, Observable, of} from 'rxjs';
import {Profile, Roles} from 'infrastructure/fidcare/models/profile.models';
import {AccessProposalService} from 'app/mef-module/services/access-proposal.service';
import {DialogService} from "../../../../../../infrastructure/fidcare/services/dialog.service";
import {ProfileService} from 'infrastructure/fidcare/services/profile.service';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import {DataTableUtils} from "../../../../../../infrastructure/fidcare/utils/data-table.utils";
import {
  iconActivate,
  iconApprove,
  iconTrash,
  iconViewDetails
} from "../../../../../../infrastructure/fidcare/utils/icons.utils";
import {EditAccessProposalPageComponent} from "../../../../../mef-module/pages/access-proposals-page/access-proposal-details/edit-access-proposal-page.component";
import {ActivityLogPageComponent} from "../../../../../mef-module/pages/access-proposals-page/list-access-proposals-page/activity-log-page/activity-log-page.component";
import {
  PartecipanteRequest,
  TelevisitaControllerService,
  TelevisitaListaRichiesteAssistitoResponse, TelevisitaListaRichiesteMedicoResponse, TelevisitaResponse,

} from "../../../../../services/api/mtc";
import {SnackBarService} from "../../../../../../infrastructure/fidcare/services/snackbar.service";
import {catchError} from "rxjs/operators";
import {PatientControllerService, PatientDTO} from "../../../../../services/api/cdr";
import {TelevisitAddComponent} from "./televisit-add/televisit-add.component";
import {RespingiTelevisitaComponent} from "./respingi-televisita/respingi-televisita.component";

class EditTelevistData {
  public isNew?: boolean;
  public patientcode?: string
  public medicalRecord?: MedicalRecord
  public nota?: string;
  public paziente?: PatientDTO;
  public partecipanti?: string;
  public isDocotr?: boolean;
  public isPaziente?:boolean;
  public altriPartecipanti: PartecipanteRequest[];
  public rifiuta?:boolean;
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

class Filters {
  public state: string;
  public nome?: string;
  public cognome?:string;
}
@Component({
  selector: 'app-televisit-list',
  templateUrl: './televisit-list.component.html',
  styleUrls: ['./televisit-list.component.scss']
})
export class TelevisitListComponent extends BaseDataTablePage<TelevisitaItem, Filters> implements OnInit {
  public tableColumns: DataTableColumn[] = [];
  public tableActions: DataTableAction[] = [];
  private _initialized: boolean = false;
  @Input() public history: boolean=undefined;
  @Input() public code : string="";
  @Input() medicalRecord: MedicalRecord;
  response: TelevisitaListaRichiesteAssistitoResponse= null;
  states: Observable<SelectListitem[]> = of([]);
  public filterDef: TableFilterFieldDef[] = [];
  private _user: Profile;
  @Input() public patientId:string;
  @Input() public canAddProposal: boolean =false;
  @Output() public addProposal : EventEmitter<boolean>= new EventEmitter();
  @Output() public proposalUpdates: EventEmitter<any> = new EventEmitter();

  public filters: Filters = new Filters();
  public canAdd: boolean = true;
  public televisite : TelevisitaResponse[]=[];
  public assistito : PatientDTO;
  public isDoctor: boolean=false;
  public altriPartecipanti:PartecipanteRequest[]=[];

      get isPatient() {
    return this._profileService.isInRole(Roles.PATIENT) ;
  }
  get canUploadNewRichiesta() {
    return	!this.canAdd
  }
  constructor(
      private _accessProposalService: AccessProposalService,
      private _translateService: TranslateService,
      private _activatedRoute: ActivatedRoute,
      private _router: Router,
      private _profileService: ProfileService,
      private _dialogServide: DialogService,
      private televisitaService: TelevisitaControllerService,
      private snackBarService: SnackBarService,
      private patientService: PatientControllerService

  ) {
    super(_activatedRoute, true);
  }


  ngOnInit(): void {

  if(!this._profileService.isInRole(Roles.PATIENT) && this._profileService.isInRole(Roles.DOCTOR) ){
    this.isDoctor=true;
  }
  if(this.isDoctor){

  }

    this.patientService.getPatientByUniqueCodeUsingGET(this.medicalRecord.patient.code).pipe(
        catchError((err) => {
          console.log(err);
          return of([]);
        })
    ).subscribe((res:PatientDTO) => {
      this.assistito=res;
    })
    this.initialize()
    this.addRichiesta()
  }
  protected initialize = () => {

    if(!this._initialized){
        this.states = of([
          "REFUSED",
          "PRESENTED",
          "CARRIED-OUT",
          "ACCEPTED",
          "EXPIRED",
          "INTERRUPTED",
          "TAKING CHARGE",
          "REJECTED",
          "IN PROGRESS",
          "WITHDRAWAL"].map(state => new SelectListitem(state, "mef.TelevisitastatesEnum."+state))
        );

      this.filterDef = [
        {
          fieldName: "state",
          defaultValue: null,
          fieldType: 'select',
          validators: [],
          label: "md.state",
          possibleDataValues: this.states
        }
      ];

  this.createColumms();
      this.createActions();
      this.dataTableManager = new RemoteDataTableManager("2", this.loadData, () => { }, null);
      this.dataTableManager.startSearch();

      this._initialized = true;
    }
    this._profileService.loadUserProfile().subscribe((user) => {
      this._user = user;
    });
  };

  private createColumms = (): void => {
    if(this.isDoctor){

    let dataOraTelevisita = DataTableUtils.createStringColumn("dataOra", "Data e ora", true);
    this.tableColumns.push(dataOraTelevisita);
      let assistitoTelevisita = DataTableUtils.createStringColumn("assistito", "Assistito", true);
      this.tableColumns.push(assistitoTelevisita);
    }

    let motivationaTelevisita = DataTableUtils.createStringColumn("motivazione", "Motivazione", true);
    this.tableColumns.push(motivationaTelevisita);

    if(this.isPatient){
    let partecipantiTelevisita = DataTableUtils.createStringColumn("partecipanti", "Partecipanti", true);
    this.tableColumns.push(partecipantiTelevisita);
    }

    let state = DataTableUtils.createStringColumn("stato", "Stato",  true);
    this.tableColumns.push(state);
    for(let d of this.tableColumns){
      d.alignment=DataTableColumnAlignment.CENTER
    }
  }
  private createActions = (): void => {
    let details = new DataTableAction();
    details.funcToInvoke = this.details;
    details.label = "mef.accessProposal.listAccessProposals.detailsActionLabel";
    details.icon = iconViewDetails;
    this.tableActions.push(details);

    if (!this.history) {
      let enabledDelete = (accessProposal: TelevisitaItem)=> {
        // @ts-ignore
        return accessProposal.stato == this._translateService.instant("mef.TelevisitastatesEnum.PRESENTED") &&
            this._profileService.isInRole(Roles.PATIENT)
      };
      let enabledRifiuta = (accessProposal: TelevisitaItem)=> {
        // @ts-ignore
        return accessProposal.stato == this._translateService.instant("mef.TelevisitastatesEnum.PRESENTED") &&
            this._profileService.isInRole(Roles.DOCTOR)
      };
      if(this.isPatient){
      let deleteButton = new DataTableAction();
      deleteButton.funcToInvoke = this.ritira;
      deleteButton.label = "mef.accessProposal.listAccessProposals.withdrawTelevisit";
      deleteButton.icon = iconTrash;
      deleteButton.enableFunc = enabledDelete;
      this.tableActions.push(deleteButton);
      }
      else {
        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.respingi;
        deleteButton.label = "mef.accessProposal.listAccessProposals.Reject";
        deleteButton.icon = iconTrash;
        deleteButton.enableFunc = enabledRifiuta;
        this.tableActions.push(deleteButton);
      }
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
  public ritira = (row: TelevisitaItem): void => {
    let remove = (confirm) => {
      if (confirm) {
        this.televisitaService.ritiraTelevisitaUsingPOST(row.id).subscribe({
          next: () => {
            this.dataTableManager.startSearch();
            this.proposalUpdates.emit(row);
          },
          error: (message: string) => { console.log(message) }
        });
      }
    }
    this._dialogServide.showConfirm("Ritira richiesta televsita", "Sei sicuro di voler ritirare la richiesta selezionata?", { callback: remove });
  }
  public respingi = (row: TelevisitaItem): void => {
    this._dialogServide.show(RespingiTelevisitaComponent, {
      data:{
        id:row.id
      },
      panelClass: 'modal-lg',
      callback: this._refreshList,
    });
  }
  public details = (row: TelevisitaItem): void => {
    this._dialogServide.show(TelevisitAddComponent, {
      data:<EditTelevistData>{
        televisitaItem: row,
        isNew: false,
        patientcode:this.code,
        medicalRecord: this.medicalRecord,
        paziente: this.assistito,
        partecipanti: row.partecipanti,
        isDocotr:this.isDoctor,
        isPaziente:this.isPatient,
        altriPartecipanti:row.altriPartecipanti,
        rifiuta:false
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



  public search = (): void => {
    this.dataTableManager.startSearch();
  }

  public create= ():void=>{

    this._dialogServide.show(TelevisitAddComponent, {
      data:<EditTelevistData>{
        isNew:true,
        patientcode:this.medicalRecord.patient.code,
        medicalRecord: this.medicalRecord,
        paziente: this.assistito,
        isDocotr: this.isDoctor,
        isPaziente: this.isPatient
      },
      panelClass: 'modal-xl',
      callback: this._refreshList,
    });
  }


  public onFiltersUpdate = (data) => {

    Object.assign(this.filters, data);
    this.dataTableManager.startSearch();
  }
  private loadData = (searchCriteria: SearchCriteria): Observable<SearchResult<ItemTelevisita>> =>{
    this.canAdd=true
    this.televisite=[]
    if(this.isPatient){
    let obs: Observable<TelevisitaListaRichiesteAssistitoResponse>;
    obs= this.televisitaService.findAllTelevisiteByAssistitoUsingGET(this.medicalRecord.patient.id,this.medicalRecord.id);
    if (this.filters.state){

      return obs.pipe(map(m => {
        const ret = new SearchResult<TelevisitaItem>()
        for (let t of m.televisite){
          if(t.stato == this._translateService.instant("mef.TelevisitastatesEnum."+this.filters.state)){
            this.televisite.push(t)
          }
        }
        if(this.televisite.length == 0){
          m.televisite=[]
        }
        else
        m.televisite=this.televisite
        ret.content = (m.televisite || []).map(m1 => new TelevisitaItem(m1));
        ret.totalElements = m.televisite.length
        return ret;
      }));
   }
   else {
    return obs.pipe(map(m => {
      this.response=m;
      for (let r of this.response.televisite){
        if(r.stato == TelevisitaResponse.StatoEnum.PRESENTATA){
          this.canAdd=false;
          this.addRichiesta()
        }
      }

      const ret = new SearchResult<TelevisitaItem>()
      ret.content = (m.televisite || []).map(m1 => new TelevisitaItem(m1));
      ret.totalElements = m.televisite.length
      return ret;
    }));
   }
    }
    else if( this.isDoctor ){
      console.log(this.filters.state)
      let obs: Observable<TelevisitaListaRichiesteMedicoResponse>;
      obs= this.televisitaService.findAllTelevisiteByMedicoUsingGET(this.medicalRecord.doctor.doctorId);
      if(this.filters.state){
        return obs.pipe(map ( m => {

          const ret = new SearchResult<TelevisitaItem>()
          // for (let t of m.televisite){
          //   if( this.filters.nome != null && this.filters.cognome == null && t.assistito.nome.toUpperCase().includes(this.filters.nome.toUpperCase())){
          //     this.televisite.push(t)
          //   }
          //   else if(this.filters.nome == null && this.filters.cognome != null && t.assistito.cognome.toUpperCase().includes(this.filters.cognome.toUpperCase())){
          //     this.televisite.push(t)
          //   }
          //   else if (this.filters.nome != null && this.filters.cognome != null && t.assistito.cognome.toUpperCase().includes(this.filters.cognome.toUpperCase())
          //   &&  t.assistito.nome.toUpperCase().includes(this.filters.nome.toUpperCase())  ){
          //     this.televisite.push(t)
          //   }
          // }
          for (let t of m.televisite){
            if(t.stato == this._translateService.instant("mef.TelevisitastatesEnum."+this.filters.state)){
              this.televisite.push(t)
            }
          }
          if(this.televisite.length == 0){
            m.televisite=[]
          }
          else
            m.televisite=this.televisite

          ret.content = (m.televisite || []).map(m1 => new TelevisitaItem(m1));
          ret.totalElements = m.televisite.length
          return ret;
        }));
      }
      else {
      return obs.pipe(map ( m => {

        const ret = new SearchResult<TelevisitaItem>()
        ret.content = (m.televisite || []).map(m1 => new TelevisitaItem(m1));
        ret.totalElements = m.televisite.length
          return ret;
      }));
      }
    }

  }
   addRichiesta(){
  return !this.canAdd
  }
}


interface ItemTelevisita {
   stato: string ;
   motivazione: string ;
   dataOra: string;
   assistito: string;
}