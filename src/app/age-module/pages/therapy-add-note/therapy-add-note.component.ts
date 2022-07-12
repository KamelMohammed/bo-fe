import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddDrugNoteDialog, EditDrugNoteDialog } from 'app/age-module/models/age.model';
import { TherapySheetComponent } from 'app/md-module/pages/clinical-diary/therapies/therapy-sheet/therapy-sheet.component';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';


@Component({
    selector: 'therapy-add-note',
    templateUrl: './therapy-add-note.component.html',
})
export class TherapyAddNoteComponent extends BaseComponent implements OnInit {
    public form: FormGroup;
    public canSave: boolean = true;

    constructor(private _fb: FormBuilder, private _spinnerService: SpinnerService, private _dialogRef: MatDialogRef<TherapySheetComponent>, @Inject(MAT_DIALOG_DATA) private _data: AddDrugNoteDialog) {
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
            this._spinnerService.hide();
            this._dialogRef.close(true);
        }
    }

    public close = (): void => {
        this._dialogRef.close(false);
    }
}

