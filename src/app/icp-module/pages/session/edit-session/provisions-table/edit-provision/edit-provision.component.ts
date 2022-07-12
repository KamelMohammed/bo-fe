import { ServiceActiviySchedulingService } from '../../../../../services/api/service-activiy-scheduling.service';
import { ProvisionState, ProvideNotProvideServiceActivityCommand, Session } from '../../../../../services/model/pai-service-activiy-scheduling.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';

@Component({
	selector: 'app-edit-provision',
	templateUrl: './edit-provision.component.html',
	styleUrls: ['./edit-provision.component.scss']
})
export class EditProvisionComponent implements OnInit {

	private provisionType: ProvisionState;
	private sessionId: string;
	private provisionId: string;
	private patientId: string;

	public provisionForm: FormGroup;
	public config: any;

	constructor(
		private _formBuilder: FormBuilder,
		private _sessionService: ServiceActiviySchedulingService,
		private _dialogRef: MatDialogRef<EditProvisionComponent>,
		private _profileService: ProfileService,
	) {

	}


	save = () => {
		if (this.provisionForm.isValid()) {
			let command: ProvideNotProvideServiceActivityCommand = this.provisionForm.getRawValue();
			if (this.provisionType ==  ProvisionState.PROVIDED) {
				this._sessionService.provide(this.sessionId,true,command).subscribe((result)=>{
					this._dialogRef.close();
				});;
			}
			else if (this.provisionType == ProvisionState.NOT_PROVIDED) {
				this._sessionService.provide(this.sessionId,false,command).subscribe((result)=>{
					this._dialogRef.close();
				});
			}
			// switch(this.provisionType){
			// 	case ProvisionState.PROVIDED:
			// 		this._sessionService.provide(this.sessionId,true,command).subscribe((result)=>{
			// 			this._dialogRef.close();
			// 		});;
			// 	case ProvisionState.NOT_PROVIDED:
			// 		this._sessionService.provide(this.sessionId,false,command).subscribe((result)=>{
			// 			this._dialogRef.close();
			// 		});
	
			// }
		
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		this.sessionId = this.config.data.sessionId;
		this.provisionId = this.config.data.provisionId;
		this.patientId = this.config.data.patientId;
		this.provisionType =this.config.data.provisionType;

	

		this._profileService.loadUserProfile().subscribe((user:Profile)=>{

			this._sessionService.details(this.sessionId).subscribe((result:Session)=>{
				let form = this._formBuilder.group({
					provisionId:[this.provisionId],
					patientId: [result.patient, Validators.required],
					date: [, Validators.required],
					notes: [null],
					duration:[null,Validators.required],
				});
				form.get("date").patchValue(new Date().toISOString());
				this.provisionForm = form;
			});
				
		});



	}

	public get formValid() {
		if (this.provisionForm) return this.provisionForm.valid;
		return false;
	}


	public get title(): string {
		let title = undefined;
		if (this.provisionType ==  ProvisionState.PROVIDED) {
			title = 'icp.sessions.provisions.providePageTitle';
		}
		else if (this.provisionType == ProvisionState.NOT_PROVIDED) {
			title = 'icp.sessions.provisions.notProvidePageTitle';
		}
		return title;
		
	}
}