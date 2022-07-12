import { PTComponentDto, TherapyDto } from 'app/services/api/atm';
import { AlertConfigDto } from 'app/services/api/measurementrule';
import { ParameterDto, ParameterResponse, SurveyResponse } from '../../services/api/cpmbase';
import { DistrictDto, DoctorDto, MedicalRecordRequest } from '../services/mrc';
import moment from "moment";
import {DiagnosiRequest, PartecipanteRequest} from "../../services/api/mtc";
import {TelevisitaResponse} from "../../services/api/mtc/model/televisitaResponse";

export enum ActionEnum {
	EDIT = 'EDIT',
	DELETE = 'DELETE'
}

export enum ActionIconEnum {
	EDIT = 'edit',
	DELETE = 'delete'
}

export class TelevisitaItem {

	public motivazione:string = "";
	public stato: TelevisitaStatus=null;
	public id: string= "";
	public partecipanti: string="" ;
	public nota:string="";
	public dataOra:string="";
	public assistito:string=null;
	public altriPartecipanti: PartecipanteRequest[]=[];
	public quesiti: DiagnosiRequest[]=[];
	public notaMedico:string=null;
	public data:string="";
	public durata:string="";
	public ora:string="";
	public motivazioneMedico:string;
	constructor(televisitaResponse: TelevisitaResponse) {
		this.motivazione= televisitaResponse.motivazione
		this.id= televisitaResponse.id
		this.nota= televisitaResponse.note
		this.stato= <TelevisitaStatus> televisitaResponse.stato
		this.partecipanti=televisitaResponse.altriPartecipanti.map(m => m.nome+" "+m.cognome).join(" - ")
		this.dataOra=""
		if(televisitaResponse.assistito)
		this.assistito = televisitaResponse.assistito.nome+" "+ televisitaResponse.assistito.cognome || ""
		for(let p of televisitaResponse.altriPartecipanti){
			let partecipante: PartecipanteRequest={
				nome: p.nome,
				id:p.id,
				email:p.email,
				cognome:p.cognome
			}
			this.altriPartecipanti.push(partecipante)
		}
		if(televisitaResponse.ora != null)
		this.dataOra = televisitaResponse.data + " " + televisitaResponse.ora
		this.notaMedico= televisitaResponse.noteMedico
		this.ora = televisitaResponse.ora
		this.data=moment(televisitaResponse.data).format("YYYY-MM-DD")
		this.motivazioneMedico = televisitaResponse.motivazioneMedico || ""
	}
}

export interface VitalParameters {
	vitalParameter: ParameterDto;
	vitalMeasurements: VitalMeasurement[];
	page: number;
	size: number;
	lastPage: boolean;
}

export interface VitalMeasurement {
	survey: SurveyResponse;
	parameter: ParameterResponse;
}

export interface MedicalRecord {
	district?: DistrictDto;
	doctor?: DoctorDto;
	operator?: DoctorDto;
	id?: string;
	nosological?: string;
	patient?: Patient;
	status?: string;
	vitalParameters?: Array<ParameterDto>;
}

export interface Patient {
	birthDate?: string;
	code?: string;
	name?: string;
	references?: Array<Contact>;
	surname?: string;
	email?: string;
	uuid?: string;
	districtId?: string;
	healthInsuranceCard?: string;
	mobile?: string;
	id?: string;
}

export interface Contact {
	emails?: Array<string>;
	mobiles?: Array<string>;
	name?: string;
	phones?: Array<string>;
	surname?: string;
	id?: string;
}


export class VitalParametersData {
	public hasMultipleValues: boolean = false;
	constructor(public parameter: ParameterResponse, public surveys: SurveyResponse[]) {
		this.surveys = [...this.surveys.sortDesc(s => s.dateTime)];
		for (let i = 0; i < this.surveys.length; i++) {
			if (this.getDefaultValue(this.surveys[i]).values.length > 1) {
				this.hasMultipleValues = true;
				break;
			}
		}
	}

	public getDefaultValue = (survey: SurveyResponse): ParameterResponse => {
		return survey.parameter.find(f => f.primaryParameter && f.uuid == this.parameter.uuid) || survey.parameter.first();
	}
}
export class VitalParametersChartData {
	constructor(public medicalRecord: MedicalRecord, public data: VitalParametersData, public survey: SurveyResponse) {

	}
}

export class AddAlertParameterData {
	constructor(public medicalRecord: MedicalRecordRequest, public vitalParameter: ParameterDto, public alertConfig?: AlertConfigDto) {

	}
}

export enum TherapyStatus {
	"ACTIVE" = "ACTIVE",
	"STARTED" = "STARTED",
	"INTERRUPTED" = "INTERRUPTED",
	"TERMINATED" = "TERMINATED",
	"ONGOING" = "ONGOING",
	"SAVED" = "SAVED"
}
export enum TelevisitaStatus {
	"REFUSED" ="RIFIUTATA",
	"PRESENTED"= "PRESENTATA",
	"CARRIED-OUT"= "EFFETUATA",
	"ACCEPTED"= "ACCETTATA",
	"EXPIRED"= "SCADUTA",
	"INTERRUPTED"= "INTERROTTA",
	"TAKING_CHARGE"= "PRESA_IN_CARICO",
	"REJECTED"= "RESPINTA",
	"IN PROGRESS"= "IN_CORSO",
	"WITHDRAWAL"= "RITIRATA"
}
export class EditTherapyModalData {
	public id: string;
	public medicalRecord: MedicalRecord
}

export class EditDrugModalData {
	public therapy: TherapyDto;
	public component: PTComponentDto;
}