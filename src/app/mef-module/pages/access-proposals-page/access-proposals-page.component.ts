import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { NotificationMessage } from 'infrastructure/fidcare/models/common.models';
import { EventBusService } from 'infrastructure/fidcare/services/event-bus.service';

@Component({
	selector: 'app-access-proposals-page',
	templateUrl: './access-proposals-page.component.html',
	styleUrls: ['./access-proposals-page.component.scss']
})
export class AccessProposalsPageComponent implements OnInit {


	selectedIndex = 0;

	@Input() medicalRecord: MedicalRecord;
	@Input() public canAddProposal: boolean =false;
	@Output() public proposalUpdates: EventEmitter<any> = new EventEmitter();
	constructor(private _eventBusService: EventBusService) { }


	patientId;
	ngOnInit() {
		if (this.medicalRecord && this.medicalRecord.patient) 
			this.patientId = this.medicalRecord.patient.id;
	}

	onProposalUpdates = (event: any) => {
		let message: NotificationMessage = {
			code: "clinical-diary-update"
		}
		this._eventBusService.emit(message)
	}
}
