import { ActivatedRoute } from '@angular/router';
import { ServiceActiviySchedulingService } from '../../../services/api/service-activiy-scheduling.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location} from '@angular/common';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ModalQRcodeScannerComponent } from 'infrastructure/fidcare/components/common/modal-qrcode-scanner.component';
import moment from 'moment';
import { Session } from 'app/icp-module/services/model/pai-service-activiy-scheduling.model';

@Component({
	selector: 'app-edit-session',
	templateUrl: './edit-session.component.html',
	styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {
	private allSessionClosed = false;
	public config: any;
	public sessionId: string;
	public sessionForm: FormGroup;
	private session: Session;
	public readonly:boolean = false;

	constructor(
		private _scheduleService: ServiceActiviySchedulingService,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _location:Location,
		private _dialogService: DialogService
	) {

	}


	back = () => {
		this._location.back();
	}


	notifySessionsStatus(allClosed: boolean) {
		this.allSessionClosed = allClosed;
	}

	ngOnInit() {
		this._activatedRoute.params.subscribe(params => {
			this.sessionId = params['id'];
			let form = this._formBuilder.group({
				id: [null],
				operator: [null, Validators.required],
				duration: [null, Validators.required],
				date: [null, Validators.required],
				exitTime: [null, Validators.required],
				entryTime: [null, Validators.required],
				patient: [null, Validators.required],
				notes: [null],
			});
	
			this._scheduleService.details(this.sessionId).subscribe((session:Session) => {
				form.patchValue(session);
				this.session = session;
				form.get("entryTime").patchValue(moment(session.entryTime).format("HH:mm"));				
				if(session.exitTime || !moment().isSame(moment(session.date), 'day')){
					this.readonly=true;
					form.get("exitTime").patchValue(moment(session.exitTime).format("HH:mm"));

				}
				this.sessionForm = form;
			});

		});

		


	}

	public get valid(): boolean {
		return this.sessionForm && this.sessionForm.valid
	}



	public get title(): string {
		if (this.sessionId) {
			return 'icp.age.sessions.editPageTitle';
		}
	}

	public get closeSessionButtonDisabled() {
		if (this.session)
			return this.readonly || this.allSessionClosed==false;
		return true;
	}

	closeSession = () => {
		let dataRead = (data) => {
			this._scheduleService.closeSession(this.sessionId,{code: data, notes: this.sessionForm.value.notes}).subscribe({
				next:(result: Session)=>{
					if(result){
						this.sessionForm.patchValue(result);
						this.sessionForm.get("entryTime").patchValue(moment(result.entryTime).format("HH:mm"));				
						this.sessionForm.get("exitTime").patchValue(moment(result.exitTime).format("HH:mm"));
						this.readonly=true;
					}
				}
			});
		}
		this._dialogService.show(ModalQRcodeScannerComponent, {
			callback: dataRead,
			data: {
				modalTitle: "icp.sessions.scanCodeForTerminateSessionTitle",
				dataValidator: (codeReaded) => {
					console.log("Personal data validatorr. controllare qui se il codice è valido...");
					//TODO Effettuare i controlli di validità del codice letto
					return true;
				}
			},
			panelClass: 'modal-md',
		})
	}

}

