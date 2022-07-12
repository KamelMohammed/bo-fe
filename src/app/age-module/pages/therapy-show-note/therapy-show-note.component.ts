import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDrugNoteDialog } from 'app/age-module/models/age.model';
import { TherapySheetComponent } from 'app/md-module/pages/clinical-diary/therapies/therapy-sheet/therapy-sheet.component';
import { AdministrationService } from 'app/services/api/atm/api/administration.service';
import { AdministrationNoteRequest } from 'app/services/api/atm/model/administrationNoteRequest';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';


@Component({
    selector: 'therapy-show-note',
    templateUrl: './therapy-show-note.component.html',
})
export class TherapyShowNoteComponent extends BaseComponent implements OnInit {
    public form: FormGroup;
    public canSave: boolean = true;

    constructor(private _administrationService: AdministrationService, private _fb: FormBuilder, private _spinnerService: SpinnerService, private _dialogRef: MatDialogRef<TherapySheetComponent>, @Inject(MAT_DIALOG_DATA) private _data: EditDrugNoteDialog) {
        super();
    }

    ngOnInit(): void {
        this.canSave = (this._data.administrationNote || "").length == 0;
        this.form = this._fb.group({
            drugNote: [this._data.drugNote, CommonValidators.required],
            administrationNote: [this._data.administrationNote],
            alreadyRead: [this._data.alreadyRead]
        });
    }

    public save = (): void => {
        if (this.form.isValid()) {
            this._spinnerService.show();
            const data: AdministrationNoteRequest = {
                administrationId: this._data.id,
                note: this.form.value.administrationNote,
                ptComponentNoteToRead: this.form.value.alreadyRead ? AdministrationNoteRequest.PtComponentNoteToReadEnum.TOREAD : AdministrationNoteRequest.PtComponentNoteToReadEnum.READ
            };
            this._administrationService.updateNotesAndReadUsingPOST(data).subscribe(() => {
                this._dialogRef.close(true);
            });
        }
    }

    public close = (): void => {
        this._dialogRef.close(false);
    }
}

