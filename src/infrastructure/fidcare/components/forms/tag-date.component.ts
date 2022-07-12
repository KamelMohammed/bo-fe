import { Component, Optional, Host, SkipSelf, Input, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BaseTagInputComponent } from './base-tag-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'tag-date',
    templateUrl: './tag-date.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagDateComponent),
        multi: true,
    }]
})

export class TagDateComponent extends BaseTagInputComponent<string, moment.Moment> {
    @Input() public utc: boolean = true;
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected internalAddItem(value: any, input: HTMLInputElement): void {
        if (value) {
            let stringValue = this.utc ? value.toISOString() : value.format("YYYY-MM-DD")
            let stringValues = this.value.map(m => this.utc ? m.toISOString() : m.format("YYYY-MM-DD"))
            if (stringValues.indexOf(stringValue) < 0) {
                this.value = ([...this.value, value]);
            }
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    protected setInternalFormat(value: string): moment.Moment {
        let date = moment(this.utc ? value : value.substr(0, 10));
        return date;
    }

    protected setExternalFormat(value: moment.Moment): string {
        return this.utc ? value.toISOString() : value.format("YYYY-MM-DD");
    }

    public format = (value: moment.Moment): string => {
        return value.format('L');

    }

    public addItem(event: MatDatepickerInputEvent<moment.Moment>): void {
        this.internalAddItem(event.value, <HTMLInputElement>event.targetElement);
    }
}
