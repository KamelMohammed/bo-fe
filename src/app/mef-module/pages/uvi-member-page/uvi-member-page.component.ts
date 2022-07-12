import { MedicalRecord } from '../../../md-module/models/md.model';
import { Component, Input, OnInit } from '@angular/core';
import { EventBusService } from 'infrastructure/fidcare/services/event-bus.service';
import { NotificationMessage } from 'infrastructure/fidcare/models/common.models';

@Component({
	selector: 'app-uvi-member-page',
	templateUrl: './uvi-member-page.component.html',
	styleUrls: ['./uvi-member-page.component.scss']
})
export class UviMemberPageComponent implements OnInit {

	public selectedIndex:number=0;
	@Input() medicalRecord:MedicalRecord;
	@Input() patientId:string;
	public patientFullName:string;

	constructor() { }

	ngOnInit() {
		this.patientFullName = this.medicalRecord.patient.name+" "+this.medicalRecord.patient.surname;
	}

}
