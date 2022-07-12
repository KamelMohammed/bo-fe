import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';


@Component({
    selector: 'edit-profile',
    templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent extends BaseComponent implements OnInit {
    public form: FormGroup = null;
    constructor(private _fb: FormBuilder, private _spinnerService: SpinnerService, private _snackBarService: SnackBarService, private _profileService: ProfileService, private _dialogRef: MatDialogRef<EditProfileComponent>) {
        super();
    }

    ngOnInit(): void {
        this._spinnerService.show();
        this._profileService.loadUserProfile().subscribe(result => {
            this.createForm(result);
            this._spinnerService.hide();
        });
    }

    private createForm = (profile: Profile): void => {
        this.form = this._fb.group({
            firstName: [profile.firstName, CommonValidators.required],
            lastName: [profile.lastName, CommonValidators.required],
            email: [profile.email, [CommonValidators.required]]
        });
    }
    public close() {
        this._dialogRef.close(false);
    }

    public save = (): void => {
        if (this.form.isValid()) {
            this._spinnerService.show();
            let data = <Profile>this.form.getRawValue();
            this._profileService.saveProfile(data).subscribe(result => {
                this._snackBarService.operationSuccesfull();
                this._dialogRef.close(true);
                this._spinnerService.hide();
            });
        }
    }
}

