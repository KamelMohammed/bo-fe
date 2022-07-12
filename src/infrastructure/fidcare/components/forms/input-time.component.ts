import { Component, Optional, Host, SkipSelf, Inject, Input, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { SelectListitem } from '../../models/common.models';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-time',
    templateUrl: './input-time.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputTimeComponent),
        multi: true
    }]
})
export class InputTimeComponent extends BaseInputComponent<string, string> {
    public _hours: string = null;
    public _minutes: string = null;
    public hoursItems: SelectListitem[] = [];
    public minutesItems: SelectListitem[] = [];
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
        for (let i = 0; i < 24; i++) {
            let value = i.toString().padStart(2, "0")
            this.hoursItems.push(new SelectListitem(value, value));
        }
        for (let i = 0; i < 60; i++) {
            let value = i.toString().padStart(2, "0")
            this.minutesItems.push(new SelectListitem(value, value));
        }
    }

    @Input()
    public get hours(): string {
        return this._hours;
    }

    public set hours(value: string) {
        this._hours = value;
        this.setExternalValue();
    }

    @Input()
    public get minutes(): string {
        return this._minutes;
    }

    public set minutes(value: string) {
        this._minutes = value;
        this.setExternalValue();
    }

    private setExternalValue = (): void => {
        if (this.hours == null || this.minutes == null) {
            this.value = null;
        }
        else {
            this.value = `${this.hours}:${this.minutes}`;
        }
    };

    protected toInternalFormat(value: string): string {
        this._hours = value.substr(0, 2);
        this._minutes = value.substr(3, 2);
        return value;
    }
    protected toExternalFormat(value: string): string {
        return value;
    }
}
