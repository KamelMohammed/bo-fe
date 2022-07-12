import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { ActivityControllerService, ActivityDTO } from 'app/services/api/dia';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';

@Component({
	selector: 'app-add-diary',
	templateUrl: './add-diary.component.html'
})
export class AddDiaryComponent extends BaseComponent implements OnInit {
	public form: FormGroup;
	private profile: Profile = null;
	@Input() medicalRecord?: MedicalRecordRequest;

	constructor(private _snackBarService: SnackBarService, private _fb: FormBuilder, private readonly _profileService: ProfileService, private readonly _diaservice: ActivityControllerService, public readonly _dialog: MatDialogRef<AddDiaryComponent>, @Inject(MAT_DIALOG_DATA) public data: MedicalRecord) {
		super()
	}

	ngOnInit(): void {
		this.on(this._profileService.profile$.subscribe(result => {
			this.profile = result;
			this.createForm();
		}));
	}

	private createForm = (): void => {
		this.form = this._fb.group({
			activity: [null, CommonValidators.required],
			activityDate: [null, CommonValidators.required],
			activityInsert: [DatetimeUtils.utcNow()],
			createDate: [DatetimeUtils.utcNow()],
			createUserId: [2],
			medicalRecordUuid: [this.data.id],
			operatorName: [this.profile.firstName],
			operatorSurname: [this.profile.lastName],
			operatorUuid: [this.profile.userId],
			roleUuid: ["e4b04428-6236-11eb-ae93-0242ac130002"],
			updateDate: [DatetimeUtils.utcNow()],
			updateUserId: [2],
			userName: this.profile.email,
			userSurname: this.profile.lastName
		})
	}

	public close = (): void => {
		this._dialog.close(false);
	}

	public save = (): void => {
		if (this.form.isValid()) {
			const dataToSave = <ActivityDTO>this.form.value;

			this._diaservice.createDiaActivityUsingPOST(dataToSave).subscribe(() => {
				this._snackBarService.operationSuccesfull();
				this._dialog.close(true);
			});
		}
	}
}
