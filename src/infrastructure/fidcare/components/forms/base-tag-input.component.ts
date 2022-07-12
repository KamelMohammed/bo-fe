import { Component, Optional, Host, SkipSelf, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseInputComponent } from './base-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    template: ''
})

export class BaseTagInputComponent<T = string, C = string> extends BaseInputComponent<T[], C[]> {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }
    protected toInternalFormat(value: T[]): C[] {
        return (value || []).map(m => this.setInternalFormat(m));
    }

    protected toExternalFormat(value: C[]): T[] {
        return (value || []).map(m => this.setExternalFormat(m));
    }

    protected setInternalFormat(value: T): C {
        return null;
    }

    protected setExternalFormat(value: C): T {
        return null;
    }

    protected internalAddItem(value: any, input: HTMLInputElement): void {
        let valueToInsert = (value || '').trim();
        if (valueToInsert) {
            if (this.value.indexOf(valueToInsert) < 0) {
                this.value = ([...this.value, value.trim()]);
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
    public removeItem(index: number): void {
        this.value.splice(index, 1);
        this.value = [...this.value];
    }

}
