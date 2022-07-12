import { Component, Optional, Host, SkipSelf, Inject, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-error',
    templateUrl: './input-error.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputErrorComponent),
        multi: true,
    }]
})

export class InputErrorComponent extends BaseInputComponent {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected toInternalFormat(value: any): any {
        return value;
    }

    protected toExternalFormat(value: any): any {
        return value;
    }

}
