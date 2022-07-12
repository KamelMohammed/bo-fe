import { Component, Optional, Host, SkipSelf, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { BaseTagInputComponent } from './base-tag-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'tag-string',
    templateUrl: './tag-string.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagStringComponent),
        multi: true,
    }]
})

export class TagStringComponent extends BaseTagInputComponent<string, string> {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected setInternalFormat(value: string): string {
        return value;
    }

    protected setExternalFormat(value: string): string {
        if (value == "") {
            return null;
        }
        return value;
    }

    public addItem(event: MatChipInputEvent): void {
        let inputElement = event.chipInput && event.chipInput.inputElement ? event.chipInput.inputElement : null;
        this.internalAddItem(event.value, inputElement);
    }
}
