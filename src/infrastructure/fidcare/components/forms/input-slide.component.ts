import { Component, Optional, Host, SkipSelf, Input, Inject, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-slide',
    templateUrl: './input-slide.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputSlideComponent),
        multi: true
    }]
})
export class InputSlideComponent extends BaseInputComponent<boolean, boolean> {
    @Input() public horizontal: boolean = true;
    @Input() public borders: boolean = false;
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }


    protected toInternalFormat(value: boolean): boolean {
        return value;
    }
    protected toExternalFormat(value: boolean): boolean {
        return value;
    }
}
