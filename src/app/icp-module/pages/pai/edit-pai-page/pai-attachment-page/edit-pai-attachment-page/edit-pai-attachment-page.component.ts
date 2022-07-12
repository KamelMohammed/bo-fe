import { Profile } from './../../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { PAIAttachmentCommand } from './../../../../../services/model/pai.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PAIService } from 'app/icp-module/services/api/pai.service';

@Component({
	selector: 'app-edit-pai-attachment-page',
	templateUrl: './edit-pai-attachment-page.component.html',
	styleUrls: ['./edit-pai-attachment-page.component.css']
})
export class EditPaiAttachmentPageComponent implements OnInit {

	private paiId: string;

	public createPaiAttachmentForm: FormGroup;
	public config: any;
	public readonly: boolean = false;
	public defining: boolean = true;
	private _user:Profile;

	constructor(
		private _formBuilder: FormBuilder,
		private _paiService: PAIService,
		private _dialogRef: MatDialogRef<EditPaiAttachmentPageComponent>,
		private _profileService: ProfileService
	) {

	}


	save = () => {
		if (this.createPaiAttachmentForm.isValid()) {
			let command: PAIAttachmentCommand = this.createPaiAttachmentForm.getRawValue();
			command.uviMemeberId=this._user.userId;
			command.uviMemberEmail=this._user.email;
			command.uviMemberName=this._user.firstName;
			command.uviMemberSurname=this._user.lastName;
			command.uviMemberFiscalCode="";
			this._paiService.savePAIAttachment(command, this.paiId).subscribe({
				next: () => this._dialogRef.close(true)
			});
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		this.paiId = this.config.data.paiId;
		let caseManagerId = this.config.data.caseManagerIdM
		let patientId = this.config.data.patientId;

		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			this._user=user;
			if (user.userId == caseManagerId || user.userId == patientId || user.isCSanitario) {
				let form = this._formBuilder.group({
					id: [null],
					userId: [user.firstName+" "+user.lastName, Validators.required],
					documentName: [null, Validators.required],
					content: ["un contenuto"]
				});

				this.createPaiAttachmentForm = form;

			}
		});



	}

	public get formValid() {
		if (this.createPaiAttachmentForm) return this.createPaiAttachmentForm.valid;
		return false;
	}


	public get title(): string {
		return 'icp.pai.listPaiAttachment.createPageTitle';
	}
}