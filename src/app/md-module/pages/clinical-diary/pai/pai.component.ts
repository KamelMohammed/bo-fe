import { PatientControllerService } from './../../../../services/api/cdr/api/patientController.service';
import { Profile } from './../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Component, Input, OnInit } from '@angular/core';
import { MedicalRecordRequest } from 'app/md-module/services/mrc/model/medicalRecordRequest';

@Component({
	selector: 'app-pai',
	templateUrl: './pai.component.html',
	styleUrls: ['./pai.component.scss']
})
export class PaiComponent implements OnInit {


	public patientId:string;
	@Input() medicalRecord: MedicalRecordRequest;
	public patientFiscalCode:string;


	constructor(private _profileService: ProfileService, private patientControllerService: PatientControllerService) {
	}

	ngOnInit() {
		this.patientId=this.medicalRecord.patient.id;
		this.patientFiscalCode=this.medicalRecord.patient.code;
	}

}


