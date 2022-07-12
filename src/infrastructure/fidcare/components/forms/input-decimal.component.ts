import { Component, Optional, Host, SkipSelf, Inject, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { CultureService } from '../../services/culture.service';
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-decimal',
    templateUrl: './input-decimal.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputDecimalComponent),
        multi: true,
    }]
})

export class InputDecimalComponent extends BaseInputComponent<number> {
    private _decimalSeparator: string = ".";
    private _thousandSeparator: string = ",";
    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, private _cultureService: CultureService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
        this._cultureService.cultureChanged.subscribe(result => {
            this.setSeparators(this._cultureService.getCurrentCulture());
        });
        this.setSeparators(this._cultureService.getCurrentCulture());
    }

    private setSeparators = (culture: string): void => {
        this._decimalSeparator = getLocaleNumberSymbol(culture, NumberSymbol.Decimal);
        this._thousandSeparator = getLocaleNumberSymbol(culture, NumberSymbol.Group);
    }
    protected toInternalFormat(value: number): string {
        if (value != null) {
            if (value != 0) {
                let newValue = value.toString();
                return newValue.replaceAll(".", this._decimalSeparator);
            }
            return value.toString();
        }
    }

    protected toExternalFormat(value: string): number {
        let cleanValue = value != null && value != "" ? value.trim() : null;
        if (cleanValue != null) {
            cleanValue = cleanValue.replaceAll(this._thousandSeparator, "");
            cleanValue = cleanValue.replaceAll(this._decimalSeparator, ".");
        }
        return cleanValue != null ? parseFloat(cleanValue) : null;
    }

}
