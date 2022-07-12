import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { forkJoin } from 'rxjs';
import { SelectListitem } from './../../../../../../infrastructure/fidcare/models/common.models';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { ElectCaseManagerCommand } from 'app/icp-module/services/model/pai.model';
import { UserService } from 'app/icp-module/services/api/user.service';
import { Doctor } from 'app/icp-module/services/model/user';

@Component({
	selector: 'app-elect-case-manager-page',
	templateUrl: './elect-case-manager-page.component.html',
	styleUrls: ['./elect-case-manager-page.component.scss']
})
export class ElectCaseManagerPageComponent implements OnInit {


	public createCaseManagerForm: FormGroup;
	private paiId;
	public config: any;
	public doctorListItems: SelectListitem[] = [];

	constructor(
		private _paiService: PAIService,
		private _formBuilder: FormBuilder,
		private _userService: UserService,
		private _dialogRef: MatDialogRef<ElectCaseManagerPageComponent>,
		private _profileService: ProfileService
	) {
	}

	save = () => {
		if (this.createCaseManagerForm.isValid()) {
			let command: ElectCaseManagerCommand = this.createCaseManagerForm.getRawValue();
			let name = this.createCaseManagerForm.get("doctorName").value;
			let surname = this.createCaseManagerForm.get("doctorSurname").value;
			let id = this.createCaseManagerForm.get("doctor").value;
			let caseManagerName = name+" "+surname;
			this._paiService.saveCaseManager(command, this.paiId).subscribe({
				next: () => this._dialogRef.close({name:caseManagerName,id:id}),
			});
		}
	}

	back = () => {
		this._dialogRef.close(undefined);
	}


	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			let isCsanitario = user.isCSanitario;

			let form = this._formBuilder.group({
				doctor: [null, Validators.required],
				doctorId: [null, Validators.required],
				doctorName: [null, Validators.required],
				doctorSurname: [null, Validators.required],
				doctorEmail: [null, Validators.email],
				doctorCode:[null]
			});

			let serviceToInvoke = {
				doctors: this._userService.getDoctors({ ascending: true, page: 0, size: 10, keySelector: "" }),
			};

			forkJoin(serviceToInvoke).subscribe((result) => {
				this.doctorListItems = result.doctors.content.map(m => new SelectListitem(m, (m.doctorName + " " + m.doctorSurname)));

				this.paiId = this.config.data.paiId;
				if (this.config.data.caseManagerId) {
					let doctoToSearch = {
						doctor: this._userService.getDoctor(this.config.data.caseManagerId),
					};

					forkJoin(doctoToSearch).subscribe((result) => {
						let doctor = result.doctor;
						form.patchValue(doctor);
					});
				}

				this.createCaseManagerForm = form;

				this.createCaseManagerForm.get("doctor").valueChanges.subscribe((doctor: Doctor) => {
					this.createCaseManagerForm.patchValue(doctor);
				});
			});

		});



	}

	public get title(): string {
		return 'icp.pai.electCaseManager.pageTitle';
	}
}
