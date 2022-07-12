import { Component, Optional, Host, SkipSelf, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import moment from 'moment';
import { BaseTagInputComponent } from './base-tag-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';
import { TagDateTimeItemComponent } from './tag-datetime-item.component';

@Component({
    selector: 'tag-datetime',
    templateUrl: './tag-datetime.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagDateTimeComponent),
        multi: true,
    }]
})

export class TagDateTimeComponent extends BaseTagInputComponent<string, string> {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents, private _dialogService: DialogService) {
        super(controlContainer, translateService, configuration);
    }

    protected setInternalFormat(value: string): string {
        return value;
    }

    protected setExternalFormat(value: string): string {
        return value;
    }

    public format = (value: string): string => {
        if (value) {
            return moment(value).format('L HH:mm');
        }
        return null;
    }

    public addItem(): void {
        this._dialogService.show(TagDateTimeItemComponent, {
            panelClass: "modal-md",
            callback: (value: string) => {
                if (value) {
                    this.internalAddItem(value, null);
                }
            }
        })
    }
}

