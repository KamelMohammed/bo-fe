import { Component, Optional, Host, SkipSelf, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-int',
    templateUrl: './input-int.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputIntComponent),
        multi: true,
    }]
})

export class InputIntComponent extends BaseInputComponent<number> {
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected toInternalFormat(value: number): string {
        return value.toString();
    }

    protected toExternalFormat(value: string): number {
        return value ? parseInt(value.trim()) : null;
    }

}
