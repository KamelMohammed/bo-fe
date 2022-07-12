import { Component, Optional, Host, SkipSelf, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { BaseTagInputComponent } from './base-tag-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';
import { TagTimeItemComponent } from './tag-time-item.component';

@Component({
    selector: 'tag-time',
    templateUrl: './tag-time.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagTimeComponent),
        multi: true,
    }]
})

export class TagTimeComponent extends BaseTagInputComponent<string, string> {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents, private _dialogService: DialogService) {
        super(controlContainer, translateService, configuration);
    }

    protected setInternalFormat(value: string): string {
        return value;
    }

    protected setExternalFormat(value: string): string {
        return value;
    }

    public addItem(): void {
        this._dialogService.show(TagTimeItemComponent, {
            panelClass: "modal-sm",
            callback: (value: string) => {
                if (value) {
                    this.internalAddItem(value, null);
                }
            }
        })
    }
}

