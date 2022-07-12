import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ServiceActiviySchedulingService } from 'app/icp-module/services/api/service-activiy-scheduling.service';
import { Session } from 'app/icp-module/services/model/pai-service-activiy-scheduling.model';
import moment from 'moment';

@Component({
    selector: 'agenda-session-preview',
    templateUrl: './agenda-session-preview.component.html'
})
export class ModalAgendaSessionPreviewComponent implements OnInit{
	scanningMode = false;	
	modalTitle = "Dettagli della sessione";
	dataValidator: (data?: any) => {} = (data?: any) => {
		return this.session && this.session.patientId == data;
	};
	readonly: boolean= true;
	public config:any;
	session: Session
	constructor(private _dialogRef: MatDialogRef<ModalAgendaSessionPreviewComponent>, private _serviceActiviySchedulingService: ServiceActiviySchedulingService, private readonly _router: Router) {
	}
	
	ngOnInit(): void {
		if (this.config && this.config.data) {
			this._serviceActiviySchedulingService.details(this.config.data.sessionId).subscribe((result) => {
				
				this.session = result;
				if (this.session)
					this.readonly = !(!this.session.entryTime && moment().isSame(moment(this.session.date), 'day'));

			})
		} 
	}
	onScanQRCodeSuccess = ($event) => {
		this._serviceActiviySchedulingService.openSession(this.session.id, {code: $event}).subscribe((result) => {
			this.showDetails();
		})
		// this.showDetails();
		
	}
	close = () => {
		this._dialogRef.close(undefined);
	}
	startQRCodeScanning = () => {
		this.modalTitle = "icp.sessions.scanCodeForStartSessionTitle";
		this.scanningMode = true;
	}

	showDetails = () => {
		this._dialogRef.close(null);
		this._router.navigate([`icp/sessions/${this.session.id}/edit`]);
	}
}
