import { Component, Input, Optional, Host, SkipSelf, Inject, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-password',
    templateUrl: './input-password.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputPasswordComponent),
        multi: true,
    }]
})

export class InputPasswordComponent extends BaseInputComponent {
    @Input() rows: number = 1;
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected toInternalFormat(value: string): string {
        return value;
    }

    protected toExternalFormat(value: string): string {
        if (value == "") {
            return null;
        }
        return value;
    }

}
