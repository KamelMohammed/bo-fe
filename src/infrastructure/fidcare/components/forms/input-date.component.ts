import { Component, Optional, Host, SkipSelf, Inject, Input, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-date',
    templateUrl: './input-date.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputDateComponent),
        multi: true
    }]
})
export class InputDateComponent extends BaseInputComponent<string, moment.Moment> {
    @Input() public utc: boolean = true;
	@Input() dateFilter = (d: Date | null): boolean => {return true;};
	
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }


    protected toInternalFormat(value: string): moment.Moment {
        let date = moment(this.utc ? value : value.substr(0, 10));
        return date;
    }
    protected toExternalFormat(value: moment.Moment): string {
        return this.utc ? value.toISOString() : value.format("YYYY-MM-DD");
    }
}
