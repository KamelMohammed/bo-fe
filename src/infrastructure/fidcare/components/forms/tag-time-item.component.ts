import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../common/base.component';
import { CommonValidators } from './validators/common.validator';
import 'infrastructure/fidcare/extensions-methods/form.extensions';

@Component({
    selector: 'tag-time-item',
    templateUrl: './tag-time-item.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagTimeItemComponent),
        multi: true,
    }]
})

export class TagTimeItemComponent extends BaseComponent implements OnInit {
    public form: FormGroup;
    constructor(private _fb: FormBuilder, public dialogRef: MatDialogRef<TagTimeItemComponent>) {
        super();
    }
    ngOnInit(): void {
        this.form = this._fb.group({
            value: [null, CommonValidators.required]
        })
    }

    public save = (): void => {
        if (this.form.isValid()) {
            this.dialogRef.close(this.form.value.value);
        }
    }

}
