import { Component, Input, Optional, Host, SkipSelf, Inject, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: "input-string",
    templateUrl: "./input-string.component.html",
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputStringComponent),
        multi: true,
    }]
})

export class InputStringComponent extends BaseInputComponent {
    @Output() onKeyUp: EventEmitter<string> = new EventEmitter<string>();
    @Input() rows: number = 1;
    @Input() maxLength: number = Number.MAX_SAFE_INTEGER;
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
    public keyUp(event: any) { // without type info
        this.onKeyUp.emit(event.target.value);
    }

}
