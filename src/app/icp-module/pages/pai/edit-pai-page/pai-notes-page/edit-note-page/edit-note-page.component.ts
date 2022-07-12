import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from '../../../../../../../infrastructure/fidcare/services/profile.service';
import { SuspendPAICommand, DisapproveInterruptPAICommand } from '../../../../../services/model/pai.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { NoteType } from 'app/icp-module/services/model/pai.model';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { UserService } from 'app/icp-module/services/api/user.service';

@Component({
	selector: 'app-edit-note-page',
	templateUrl: './edit-note-page.component.html',
	styleUrls: ['./edit-note-page.component.css']
})
export class EditNotePageComponent implements OnInit {



	private noteType: NoteType;
	//flag to indentify note type
	public suspend: boolean = false;
	public stop: boolean = false;

	//field to view notes
	private paiId: string;
	private noteId: string;

	public createNoteForm: FormGroup;
	public config: any;
	public readonly: boolean = false;
	public defining: boolean = true;
	public isCSanitario: boolean;
	private _user: Profile;
	private caseManager: {
		caseManagerName?: string,
		caseManagerSurname?: string,
		caseManagerId?: string,
		caseManagerEmail?: string
		caseManagerFiscalCode?:string;
	} = new Object();

	constructor(
		private _formBuilder: FormBuilder,
		private _paiService: PAIService,
		private _dialogRef: MatDialogRef<EditNotePageComponent>,
		private _profileService: ProfileService,
		private _userService: UserService
	) {

	}

	dateGTNowFilter = (d: Date | null): boolean => {
		if (d) {
			return moment().subtract(1, 'days').isBefore(d)
		}
		return true;
	};


	save = () => {
		if (this.createNoteForm.isValid()) {
			switch (this.noteType) {
				case NoteType.SUSPEND:
					let suspendCommand: SuspendPAICommand = this.createNoteForm.getRawValue();
					Object.assign(suspendCommand, this.caseManager);
					suspendCommand.action = "Sospensione PAI";
					this._paiService.suspend(this.paiId, suspendCommand).subscribe({
						next: () => this._dialogRef.close(true),
					});
					break;

				case NoteType.DISAPPROVE:
					let disapproveCommand: DisapproveInterruptPAICommand = this.createNoteForm.getRawValue();
					Object.assign(disapproveCommand, this.caseManager);
					disapproveCommand.action = "Disapprovazione PAI";
					this._paiService.disapprove(this.paiId, disapproveCommand).subscribe({
						next: () => this._dialogRef.close(true),
					});
					break;

				case NoteType.STOP:
					let stopCommand: DisapproveInterruptPAICommand = this.createNoteForm.getRawValue();
					Object.assign(stopCommand, this.caseManager);
					stopCommand.action = "Interruzione PAI";
					this._paiService.interrup(this.paiId, stopCommand).subscribe({
						next: () => this._dialogRef.close(true),
					});
			}
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		this.paiId = this.config.data.paiId;
		this.noteType = this.config.data.noteType;
		this.noteId = this.config.data.noteId;
		this.readonly = this.config.data.readonly;
		let patientId = this.config.data.patientId;
		this.caseManager.caseManagerId = this.config.data.caseManagerId;

		this._userService.getDoctor(this.caseManager.caseManagerId).subscribe((caseManager) => {
			this.caseManager.caseManagerName = caseManager.doctorName;
			this.caseManager.caseManagerEmail = caseManager.doctorEmail;
			this.caseManager.caseManagerSurname = caseManager.doctorSurname;
			this.caseManager.caseManagerFiscalCode = caseManager.doctorCode;
			this._profileService.loadUserProfile().subscribe((user: Profile) => {
				this._user = user;
				this.isCSanitario = user.isCSanitario;
	
				if (user.isCSanitario || user.userId == this.caseManager.caseManagerId || user.userId == patientId) {
	
					let form = this._formBuilder.group({
						id: [null],
						startDate: [null, Validators.required],
						endDate: [null, Validators.required],
						motivationalNote: [null, Validators.required],
						duration: [null, [Validators.min(0), Validators.required]]
					});
	
	
	
					switch (this.noteType) {
						case NoteType.DISAPPROVE:
						case NoteType.STOP:
							this.stop = true;
							form.get("endDate").clearValidators();
							form.get("endDate").updateValueAndValidity();
							form.get("duration").clearValidators();
							form.get("duration").updateValueAndValidity();
							break;
						case NoteType.SUSPEND:
							this.suspend = true;
							break;
					}
	
					if (this.stop) {
						form.get("startDate").patchValue(new Date());
					}
	
					let servicesToInvoke: any = {};
	
					if (this.noteId) {
						servicesToInvoke.entity = this._paiService.paiStateChangeDetail(this.paiId, this.noteId);
					}
	
					forkJoin(servicesToInvoke).subscribe((result: any) => {
						if (result.entity) {
							form.patchValue(result.entity);
						}
					});
	
					form.get("duration").valueChanges.subscribe({
						next: (duration: number) => {
							let dateString = form.get("startDate").value;
							if (dateString) {
								let date: Date = new Date(dateString);
								let someDate = new Date();
								let result = someDate.setDate(date.getDate() + duration);
								form.get("endDate").patchValue(new Date(result));
							}
						}
					});
	
					this.createNoteForm = form;
				}
			});


		});
	}

	public get formValid() {
		if (this.createNoteForm) return this.createNoteForm.valid;
		return false;
	}


	public get title(): string {
		if (this.readonly) {
			return 'icp.pai.listNotes.editPageTitle';
		}
		return 'icp.pai.listNotes.createPageTitle';
	}
}