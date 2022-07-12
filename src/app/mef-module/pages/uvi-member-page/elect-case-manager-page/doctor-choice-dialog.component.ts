import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/icp-module/services/api/user.service';
import { Doctor } from 'app/icp-module/services/model/user';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';

@Component({
	selector: 'mef-doctor-choice-dialog',
	templateUrl: './doctor-choice-dialog.component.html',
	styleUrls: ['./doctor-choice-dialog.component.scss']
})
export class DoctorChoiceDialog implements OnInit {

	public userForm: FormGroup;
	public config: any;
	public doctorListItems: SelectListitem[] = [];

	constructor(
		private _formBuilder: FormBuilder,
		private _userService: UserService,
		private _dialogRef: MatDialogRef<DoctorChoiceDialog>,
	) {
	}

	save = () => {
		if (this.userForm.isValid()) {
			this._dialogRef.close(this.userForm.value);
		}
	}

	back = () => {
		this._dialogRef.close(undefined);
	}


	ngOnInit() {
		let form = this._formBuilder.group({
			doctor: [null, Validators.required],
			doctorId: [null, Validators.required],
			doctorName: [null, Validators.required],
			doctorSurname: [null, Validators.required],
			doctorEmail: [null, Validators.email]
		});

		
		this._userService.getDoctors({ ascending: true, page: 0, size: 100, keySelector: "" }).subscribe((result) => {
			this.doctorListItems = result.content.map(m => new SelectListitem(m, (m.doctorName + " " + m.doctorSurname)));

			this.userForm = form;

			this.userForm.get("doctor").valueChanges.subscribe((doctor: Doctor) => {
				if (doctor) {
					this.userForm.patchValue(doctor);
				}
				else {
					this.userForm.patchValue({
						doctorId: null,
						doctorName: null,
						doctorSurname: null,
						doctorEmail: null
					});
				}
			});
		});

	}
}
