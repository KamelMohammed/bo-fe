import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ChangePassword } from 'app/models/profile.models';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { AuthService } from 'infrastructure/fidcare/services/auth.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';


@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
    public form: FormGroup = null;
    constructor(private _fb: FormBuilder, private _spinnerService: SpinnerService, private _snackBarService: SnackBarService, private _translateService: TranslateService, private _profileService: ProfileService, private _dialogRef: MatDialogRef<ChangePasswordComponent>) {
        super();
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm = (): void => {
        this.form = this._fb.group({
            oldUserPassword: [null, CommonValidators.required],
            newUserPassword: [null, CommonValidators.required],
            confirmNewUserPassword: [null, [CommonValidators.required, CommonValidators.mustMatch(() => this.form.controls.newUserPassword, this._translateService.instant('profile.cnewPassword'))]]
        });
    }
    public close() {
        this._dialogRef.close(false);
    }

    public save = (): void => {
        if (this.form.isValid()) {
            this._spinnerService.show();
            let data = <ChangePassword>this.form.getRawValue();
            this._profileService.changePassword(data).subscribe(result => {
                this._snackBarService.operationSuccesfull();
                this._dialogRef.close(true);
                this._spinnerService.hide();
            });
        }
    }
}

