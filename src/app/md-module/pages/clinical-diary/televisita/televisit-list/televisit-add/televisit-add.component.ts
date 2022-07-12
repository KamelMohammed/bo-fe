import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../../../../../infrastructure/fidcare/components/common/base.component";
import {OtherContactDTO, PatientControllerService, PatientDTO} from "../../../../../../services/api/cdr";
import {MedicalRecord, TelevisitaItem, TelevisitaStatus} from "../../../../../models/md.model";
import {
    AssistitoRequest,
    CreateRichiestaTelevisitaRequest,
    DiagnosiRequest,
    DurataControllerService,
    FindAllDurataResponse,
    MedicoRequest,
    PartecipanteRequest,
    TelevisitaControllerService,
    TelevisitaDettaglioSchedaEventoResponse, UpdateRichiestaTelevisitaRequest,
    UpdateTelevisitaRequest
} from "../../../../../../services/api/mtc";
import {
    CommonValidators
} from "../../../../../../../infrastructure/fidcare/components/forms/validators/common.validator";
import {SnackBarService} from "../../../../../../../infrastructure/fidcare/services/snackbar.service";
import {SelectListitem} from "../../../../../../../infrastructure/fidcare/models/common.models";
import moment from "moment";
import {DialogService} from "../../../../../../../infrastructure/fidcare/services/dialog.service";

class EditTelevistData {
    public isNew?: boolean;
    public patientcode?: string
    public medicalRecord?: MedicalRecord
    public televisitaItem?: TelevisitaItem
    public paziente?: PatientDTO;
    public partecipanti?: string;
    public isDocotr?: boolean;
    public isPaziente?: boolean;
    public altriPartecipanti?: PartecipanteRequest[];
    public rifiuta?:boolean;
    public evento?:boolean;
}

@Component({
  selector: 'app-televisit-add',
  templateUrl: './televisit-add.component.html',
  styleUrls: ['./televisit-add.component.scss']
})
export class TelevisitAddComponent extends BaseComponent implements OnInit {
  public isNew: boolean =null;
  public patientcode : string= "";
  public form: FormGroup = null;
  public formMedico: FormGroup = null;
  public medicoDiRiferimento : string = "";
  public assistitoForm : string = "";
  public assistito : PatientDTO;
  public otherContacts: OtherContactDTO[]=[];
  public diagnosi: DiagnosiRequest[]=[];
  public partecipantiNotNew: string="";
  public partecipantiRequest:PartecipanteRequest[]=[];
  public medico: MedicoRequest;
    public quesitiNotNew: string[]=[]
    public isDoctor:boolean;
  public isPaziente:boolean;
  public durations: FindAllDurataResponse;
  public listDurations:  SelectListitem[] = [];
  public time:string=null;
  public diagnosiRequest:DiagnosiRequest[]=[];
    public valid:boolean=true;
  public oraValid:boolean=true;
  public show:boolean=false;
  public readonlyDoctor :boolean=null;
  public prendiInCarico:boolean=false;
  public presentata:boolean=false;
  public otherContactsChanged:boolean=false;
  public prensaInCarico:boolean=false;
    public diagnosiChanged:boolean=false;
    public showButtons:boolean=true;
    public data:string;
    public editAltriP:boolean=false;
    public ritirata:boolean=false;
    public respinta:boolean=false;
    public readonlyInput = false;
    @Output() public rifiutaOutput: EventEmitter<any> = new EventEmitter();

    public televisitaDettaglioScheda: TelevisitaDettaglioSchedaEventoResponse;
    public dataTelevisitaChanged:boolean=false;
    constructor(private _fb: FormBuilder, private _translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) private _data: EditTelevistData,
              private readonly _dialog: MatDialogRef<TelevisitAddComponent>,
                private patientService: PatientControllerService,
                private televisitaSerive: TelevisitaControllerService,
                private readonly snackBarService: SnackBarService,
                private durataService: DurataControllerService,
                private _dialogServide: DialogService,

    ) {
    super()
  }

  ngOnInit(): void {

    this.isDoctor=this._data.isDocotr
    this.isPaziente=this._data.isPaziente
    this.partecipantiNotNew=this._data.partecipanti
    this.isNew= this._data.isNew
    this.patientcode=this._data.patientcode
    this.assistito=this._data.paziente
    this.assistitoForm=this.assistito.surname+" "+ this.assistito.name+ " "+ this.assistito.birthDate
    this.medicoDiRiferimento=this._data.medicalRecord.doctor.doctorSurname+" "+ this._data.medicalRecord.doctor.doctorName
      if(this._data.isDocotr && this._data.televisitaItem.stato===TelevisitaStatus.TAKING_CHARGE ){
          this.prendiInCarico=true
      }
      if( !this.isNew){
          if(  this._data.televisitaItem.stato===TelevisitaStatus.ACCEPTED || this._data.televisitaItem.stato===TelevisitaStatus.REFUSED
          || this._data.televisitaItem.stato===TelevisitaStatus.EXPIRED || this._data.televisitaItem.stato===TelevisitaStatus.REJECTED
          || this._data.televisitaItem.stato===TelevisitaStatus.WITHDRAWAL){
          this.showButtons=false;
            }
      }
      if(this._data.isPaziente && !this.isNew&& this._data.televisitaItem.stato===TelevisitaStatus.TAKING_CHARGE){
          this.prensaInCarico=true
      }
      if(!this.isNew&& this._data.televisitaItem.stato===TelevisitaStatus.REJECTED){
          this.respinta=true
      }
      if((this._data.isPaziente && this.isNew)  || (this._data.isPaziente && !this.isNew && this._data.televisitaItem.stato!==TelevisitaStatus.PRESENTED)) {
          this.readonlyDoctor=false;
      }

      if(this._data.isDocotr && (this._data.televisitaItem.stato=== TelevisitaStatus.TAKING_CHARGE ||
          this._data.televisitaItem.stato===TelevisitaStatus.ACCEPTED || this._data.televisitaItem.stato
      === TelevisitaStatus.PRESENTED)){
          this.readonlyDoctor=false;
      }
          if(!this.isNew && this._data.isPaziente && this._data.televisitaItem.stato=== TelevisitaStatus.PRESENTED ){
              this.presentata=true
          }
      if(!this.isNew && this._data.isDocotr && (this._data.televisitaItem.stato=== TelevisitaStatus.PRESENTED
      || this.prendiInCarico)){
          this.presentata=true
      }
      if(!this.isNew && !this.presentata && this._data.televisitaItem.ora!= null &&this._data.televisitaItem.ora.length>0){
          this.time=this._data.televisitaItem.ora
      }
      if(this.readonlyDoctor || this.showButtons || (this.isPaziente && !this.presentata)){
          this.editAltriP=true
      }
      if(!this.isNew && this._data.televisitaItem.stato=== TelevisitaStatus.WITHDRAWAL){
          this.ritirata = true;
      }
      if(this.isDoctor){
          this.readonlyInput =true
      }
      else if( !this.isNew &&this._data.televisitaItem.stato!== TelevisitaStatus.PRESENTED){
          this.readonlyInput=true
      }
    this.getDurations()
    this.createForm()
    this.createFormMedico()
  }
  private createForm = (televisit?: CreateRichiestaTelevisitaRequest): void => {
    televisit = televisit || <CreateRichiestaTelevisitaRequest>{};
    this.form = this._fb.group({
        medico: [televisit.medico],
        assistito: [televisit.assistito],
         motivazione: [televisit.motivazione, CommonValidators.required],
        altriPartecipanti: [televisit.altriPartecipanti],
        note: [televisit.note],
    });
        this.form.get("medico").patchValue(this.medicoDiRiferimento)
      this.form.get("assistito").patchValue(this.assistitoForm)

      if(!this._data.isNew){

        this.form.get("motivazione").patchValue(this._data.televisitaItem.motivazione);
        this.form.get("note").patchValue(this._data.televisitaItem.nota);

    }
  }
  private createFormMedico= (televisit?: UpdateTelevisitaRequest): void =>{
        televisit = televisit || <UpdateTelevisitaRequest>{};
        this.formMedico = this._fb.group({
            diagnosi: [ televisit.quesitiDiagnostici],
            data: [televisit.data, CommonValidators.required],
            durata: [televisit.idDurata, CommonValidators.required],
            ora : [televisit.data, CommonValidators.required],
            nota: [televisit.noteMedico]
        })
      if(!this.isNew && (this.prendiInCarico || (this.isPaziente && !this.presentata) || !this.showButtons)){
      this.televisitaSerive.getTelevisitaSchedaDettaglioEventoUsingGET(this._data.televisitaItem.id).subscribe(res =>{
          this.televisitaDettaglioScheda=res
          if(this._data.televisitaItem.stato != TelevisitaStatus.PRESENTED){
              this.formMedico.get("data").patchValue(res.data)
              this.formMedico.get("nota").patchValue(res.noteMedico)
              this.formMedico.get("ora").patchValue(res.ora)
              if(res.durata!=null)
              this.formMedico.get("durata").patchValue(res.durata.id)
              res.quesitiDiagnostici.map(m => this.quesitiNotNew.push(m.nome))
              this.show=true;
          }
      })
      }


  }

  close(){
      this._dialog.close(null);
  }

  save(){
        if(this.form.isValid()) {
            let data: CreateRichiestaTelevisitaRequest;
            let dataMedico: MedicoRequest = {
                codice: this._data.medicalRecord.doctor.doctorCode,
                id: this._data.medicalRecord.doctor.doctorId,
                nome: this._data.medicalRecord.doctor.doctorName,
                cognome: this._data.medicalRecord.doctor.doctorSurname,
                email: "email@email.com"
            }
            let dataAssistito: AssistitoRequest = {
                id: this.assistito.uuid,
                email: "email@email.com",
                dataNascita: this.assistito.birthDate.toString(),
                cognome: this.assistito.surname,
                nome: this.assistito.name
            }
            if (this.isNew) {

                for (let i = 0; i < this.otherContacts.length; i++) {
                    let partecipante: PartecipanteRequest = {
                        cognome: this.otherContacts[i].surname,
                        email: this.otherContacts[i].emails[0],
                        nome: this.otherContacts[i].name,
                        id: this.otherContacts[i].id
                    }
                    this.partecipantiRequest.push(partecipante)
                }
                 data = {
                    altriPartecipanti: this.partecipantiRequest,
                    medico: dataMedico,
                    idCartella: this._data.medicalRecord.id,
                    assistito: dataAssistito,
                    motivazione: this.form.value.motivazione,
                    note: this.form.value.note
                };
                this.televisitaSerive.createRichiestaTelevisitaUsingPUT(data).subscribe(result => {
                    this.snackBarService.info("Creazione avvenuto con successo.")
                    // this.snackBar.open('Creazione avvenuta con successo.', 'CHIUDI', { duration: 7000 });
                    this._dialog.close(result);
                }, () => {
                    this.snackBarService.error("Qualcosa è andato storto")
                    // this.snackBarService.open('Qualcosa è andato storto', 'CHIUDI', { duration: 000 })
                });
            }
            else {
                let altriPartecipanti: PartecipanteRequest[] = [];

                if (this.otherContactsChanged) {
                    for (let c of this.otherContacts) {
                        let partecipante: PartecipanteRequest = {
                            cognome: c.surname,
                            email: c.emails[0] || "",
                            nome: c.name,
                            id: c.id
                        }
                        altriPartecipanti.push(partecipante)
                    }
                } else {
                    this._data.televisitaItem.altriPartecipanti.map(
                        m => {
                            let p: PartecipanteRequest = {
                                nome: m.nome,
                                id: m.id,
                                email: m.email,
                                cognome: m.cognome
                            }
                            altriPartecipanti.push(p)
                        }
                    )
                }
                let data: UpdateRichiestaTelevisitaRequest= {

                     altriPartecipanti: altriPartecipanti,

                     motivazione: this.form.value.motivazione,
                     note: this.form.value.note
                };
                this.televisitaSerive.updateRichiestaTelevisitaUsingPOST(this._data.televisitaItem.id,data).subscribe(result => {
                    this.snackBarService.info("Modifiche avvenute con successo.")
                    // this.snackBar.open('Creazione avvenuta con successo.', 'CHIUDI', { duration: 7000 });
                    this._dialog.close(result);
                }, () => {
                    this.snackBarService.error("Qualcosa è andato storto")
                    // this.snackBarService.open('Qualcosa è andato storto', 'CHIUDI', { duration: 000 })
                });
            }

        }
  }
    saveModificheMedico() {
        if(this.diagnosi.length ==0 && this.diagnosiChanged) {
            this.valid = false;
        }
        else {
            this.valid=true;
        }
        if(this.time != null && this.time.length>0){
            this.oraValid=true;
        }
        else {
            this.oraValid=false;
        }
        let altriPartecipanti: PartecipanteRequest[] = [];
        let diagnosi: DiagnosiRequest[] = [];
        if(this.formMedico.isValid() && this.valid && this.oraValid) {

            if (this.otherContactsChanged) {
                for (let c of this.otherContacts) {
                    let partecipante: PartecipanteRequest = {
                        cognome: c.surname,
                        email: c.emails[0] || "",
                        nome: c.name,
                        id: c.id
                    }
                    altriPartecipanti.push(partecipante)
                }
            } else {
                if(this.televisitaDettaglioScheda.altriPartecipanti != undefined)
                this.televisitaDettaglioScheda.altriPartecipanti.map(
                    m => {
                        let p: PartecipanteRequest = {
                            nome: m.nome,
                            id: m.id,
                            email: m.email,
                            cognome: m.cognome
                        }
                        altriPartecipanti.push(p)
                    }
                )
            }
            if (this.diagnosiChanged) {
                if (this.diagnosi.length > 0) {
                    if (this.diagnosi.length > this.quesitiNotNew.length) {
                        for (let s of this.quesitiNotNew) {
                            let d1: DiagnosiRequest = {
                                nome: s,
                                id: s.split("-")[0]
                            }
                            diagnosi.push(d1)
                        }
                    }
                    for (let d of this.diagnosi) {
                        let d1: DiagnosiRequest = {
                            nome: String(d),
                            id: String(d).split("-")[0]
                        }
                        diagnosi.push(d1)
                    }

                }
            } else {
                this.televisitaDettaglioScheda.quesitiDiagnostici.map(
                    m => {
                        let p: DiagnosiRequest = {
                            nome: m.nome,
                            id: m.nome.split("-")[0],

                        }
                        diagnosi.push(p)
                    }
                )
            }
            if (this.dataTelevisitaChanged)
                this.formMedico.value.data = this.data
            let update: UpdateTelevisitaRequest = {
                data: this.formMedico.value.data,
                ora: this.formMedico.value.ora,
                altriPartecipanti: altriPartecipanti,
                quesitiDiagnostici: diagnosi,
                idDurata: this.formMedico.value.durata,
                noteMedico: this.formMedico.value.nota


            }
            this.televisitaSerive.updateTelevisitaUsingPOST(this._data.televisitaItem.id, update).subscribe(res => {
                this.snackBarService.info("Creazione avvenuto con successo.")
                this._dialog.close(res);
            }, () => {
                this.snackBarService.error("Qualcosa è andato storto")
            });

        }
    }
    changed(t:any){
        this.time=t;
        if(this.time != null && this.time.length>0){
            this.oraValid=true;
        }
    }
    addContacts(event:any[]){
            this.otherContactsChanged=true;
            this.otherContacts=event
    }
    addDiagnosi(event:any){

        this.diagnosiChanged=true
        this.diagnosi=event
        if(this.diagnosi.length>0){
            this.valid=true
        }

    }
    prendiIncarico(){

        if(this.diagnosi.length ==0) {
            this.valid = false;
        }
        else {
            this.valid=true;
        }
        if(this.time != null && this.time.length>0){
            this.oraValid=true;
        }
        else {
            this.oraValid=false;
        }
        if(this.formMedico.isValid() && this.valid && this.oraValid){
        this.formMedico.value.diagnosi = this.diagnosi
        this.formMedico.value.data = moment(this.form.value.data).format("YYYY-MM-DD")
        this.formMedico.value.ora=this.time
            let altriPartecipanti: PartecipanteRequest[] = [];

            if (this.otherContactsChanged) {
                for (let c of this.otherContacts) {
                    let partecipante: PartecipanteRequest = {
                        cognome: c.surname,
                        email: c.emails[0] || "",
                        nome: c.name,
                        id: c.id
                    }
                    altriPartecipanti.push(partecipante)
                }
            } else {
                if(this.televisitaDettaglioScheda != undefined){
                this.televisitaDettaglioScheda.altriPartecipanti.map(
                    m => {
                        let p: PartecipanteRequest = {
                            nome: m.nome,
                            id: m.id,
                            email: m.email,
                            cognome: m.cognome
                        }
                        altriPartecipanti.push(p)
                    }
                )
                }
                else {
                    this._data.televisitaItem.altriPartecipanti.map(
                        m => {
                            let p: PartecipanteRequest = {
                                nome: m.nome,
                                id: m.id,
                                email: m.email,
                                cognome: m.cognome
                            }
                            altriPartecipanti.push(p)
                        }
                    )
                }
            }

        for(let d of this.diagnosi){

            let dia: DiagnosiRequest={
                id: String (d).split("-")[0],
                nome:String (d)
            }
            this.diagnosiRequest.push(dia)
        }
        let updateRequest:UpdateTelevisitaRequest={
            data:this.data,
            noteMedico: this.formMedico.value.nota,
            idDurata: this.formMedico.value.durata,
            ora:this.formMedico.value.ora,
            quesitiDiagnostici:this.diagnosiRequest,
            altriPartecipanti:altriPartecipanti
        }
        this.televisitaSerive.updateAndPrendiInCaricoTelevisitaUsingPOST(this._data.televisitaItem.id,updateRequest).subscribe(result => {
            this.snackBarService.info("Televisita  presa in carico.")
            // this.snackBar.open('Creazione avvenuta con successo.', 'CHIUDI', { duration: 7000 });
            this._dialog.close(result);
        }, () => {
            this.snackBarService.error("Qualcosa è andato storto")
            // this.snackBarService.open('Qualcosa è andato storto', 'CHIUDI', { duration: 000 })
        });
        }

    }
    getDurations(){
        this.durataService.findAllDurateUsingGET().subscribe(res =>{
            this.durations=res
            this.listDurations= this.durations.durate.map(m => new SelectListitem(m.id,m.nome))
        })
    }
    dataChanged(event:any){
        this.data = moment(event).format("YYYY-MM-DD")
        this.dataTelevisitaChanged=true;

    }
    accetta(){
        let send = (confirm) => {
            if (confirm) {
                this.televisitaSerive.accettaTelevisitaUsingPOST(this._data.televisitaItem.id).subscribe(res => {

                    this._dialog.close()
                });
            }
        }
                this._dialogServide.showConfirm("Rifiuta richiesta televisita", "Sei sicuro di voler accettare questa televisita?", { callback: send });


    }
    rifiuta(){
        let send = (confirm) => {
            if (confirm) {
                this.televisitaSerive.rifiutaTelevisitaUsingPOST(this._data.televisitaItem.id).subscribe(res =>{
                    this._dialog.close()

                });
            }
        }
        this._dialogServide.showConfirm("Rifiuta richiesta televisita", "Sei sicuro di voler rifiutare questa televisita?", { callback: send });

    }
}
