import { Component, forwardRef, Optional, Host, SkipSelf, Inject, Input } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core';
import { SelectListitem } from '../../models/common.models';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-datetime',
    templateUrl: './input-datetime.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputDateTimeComponent),
        multi: true
    }]
})
export class InputDateTimeComponent extends BaseInputComponent<string, moment.Moment> {
    public _date: moment.Moment = null;
    public _hours: string = null;
    public _minutes: string = null;
    public hoursItems: SelectListitem[] = [];
    public minutesItems: SelectListitem[] = [];
    @Input() public checkHours: boolean = true;
	@Input() dateFilter = (d: Date | null): boolean => {return true;};
	
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
    public get date(): moment.Moment {
        return this._date;
    }

    public set date(value: moment.Moment) {
        this._date = value;
        this.setExternalValue();
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
        if (this.date == null || (this.checkHours && (this.hours == null || this.minutes == null))) {
            this.value = null;
        }
        else {
            const hours = this.hours == null ? 0 : +this.hours;
            const minutes = this.minutes == null ? 0 : +this.minutes;
            let value = moment(this.date);
            value.hour(hours);           
            value.minute(minutes);
            //FIXME questi a cosa servivano?
            // value.subtract(value.hours(), 'hours').add(hours, 'hours');;
            // value.subtract(value.minutes(), 'minutes').add(minutes, 'minutes');
            this.value = value;
        }
    };

    protected toInternalFormat(value: string): moment.Moment {
        let date = moment(value);
        this._date = date;
        this._hours = date.hours().toString().padStart(2, "00");
        this._minutes = date.minutes().toString().padStart(2, "00");;
        return date;
    }
    protected toExternalFormat(value: moment.Moment): string {
        return value.toISOString();
    }
}
