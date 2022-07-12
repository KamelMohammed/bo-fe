import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { Component, Optional, Host, SkipSelf, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslateService } from '@ngx-translate/core';
import { CultureService } from '../../services/culture.service';
import { BaseTagInputComponent } from './base-tag-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'tag-decimal',
    templateUrl: './tag-decimal.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TagDecimalComponent),
        multi: true,
    }]
})

export class TagDecimalComponent extends BaseTagInputComponent<number, string> {
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

    protected setInternalFormat(value: number): string {
        if (value != null) {
            if (value != 0) {
                let newValue = value.toString();
                return newValue.replaceAll(".", this._decimalSeparator);
            }
            return value.toString();
        }
    }

    protected setExternalFormat(value: string): number {
        let cleanValue = value != null && value != "" ? value.trim() : null;
        if (cleanValue != null) {
            cleanValue = cleanValue.replaceAll(this._thousandSeparator, "");
            cleanValue = cleanValue.replaceAll(this._decimalSeparator, ".");
        }
        return cleanValue != null ? parseFloat(cleanValue) : null;
    }

    public addItem(event: MatChipInputEvent): void {
        let inputElement = event.chipInput && event.chipInput.inputElement ? event.chipInput.inputElement : null;
        this.internalAddItem(event.value, inputElement);
    }
}
