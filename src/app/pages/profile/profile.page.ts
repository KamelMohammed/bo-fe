import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { AuthService } from 'infrastructure/fidcare/services/auth.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordComponent } from './change-password.component';
import { EditProfileComponent } from './edit-profile.component';



@Component({
    selector: 'profile-page',
    templateUrl: './profile.page.html'
})

export class ProfilePage extends BaseComponent implements OnInit {
    constructor(public profileService: ProfileService, private _dialogService: DialogService) {
        super();

    }
    ngOnInit(): void {
    }

    public edit = (): void => {
        this._dialogService.show(EditProfileComponent, {
            panelClass: 'modal-sm'
        });
    }

    public changePassword = (): void => {
        this._dialogService.show(ChangePasswordComponent, {
            panelClass: 'modal-sm'
        });
    }
}
