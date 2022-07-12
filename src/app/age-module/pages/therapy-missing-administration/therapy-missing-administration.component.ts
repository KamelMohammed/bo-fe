import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MissingAdministrationDialog } from 'app/age-module/models/age.model';
import { TherapySheetComponent } from 'app/md-module/pages/clinical-diary/therapies/therapy-sheet/therapy-sheet.component';
import { AdministrationService } from 'app/services/api/atm/api/administration.service';
import { MissedAdministrationRequest } from 'app/services/api/atm/model/missedAdministrationRequest';
import { UpdateAdministrationRequest } from 'app/services/api/atm/model/models';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';
import { mergeMap } from 'rxjs';


@Component({
    selector: 'therapy-missing-administration',
    templateUrl: './therapy-missing-administration.component.html',
})
export class TherapyMissingAdministrationComponent extends BaseComponent implements OnInit {
    public form: FormGroup;

    constructor(private _administrationService: AdministrationService, private _fb: FormBuilder, private _spinnerService: SpinnerService, private _dialogRef: MatDialogRef<TherapySheetComponent>, @Inject(MAT_DIALOG_DATA) private _data: MissingAdministrationDialog) {
        super();
    }

    ngOnInit(): void {
        this.form = this._fb.group({
            note: [null, CommonValidators.required]
        });
    }

    public save = (): void => {
        if (this.form.isValid()) {
            this._spinnerService.show();
            const data: MissedAdministrationRequest = {
                note: this.form.controls.note.value,
                ptComponentNoteRead: this._data.status
            };
            this._administrationService.missUsingPOST(this._data.id, data).pipe(mergeMap(result => {
                const data: UpdateAdministrationRequest = {
                    cs: [this._data.id],
                    messageTimestamp: new Date().getTime(),
                    newCsState: UpdateAdministrationRequest.NewCsStateEnum.NOTADMINISTEREDMISSED,
                    userIdentifier: this._data.patientUUID
                };
                return this._administrationService.changeCsStateUsingPUT(data);
            })).subscribe(() => {
                this._dialogRef.close(true);
            });
        }
    }

    public close = (): void => {
        this._dialogRef.close(false);
    }
}

