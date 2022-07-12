import { Directive } from '@angular/core';
import { NumberDirective } from './number.directive';
import { CultureService } from '../services/culture.service';
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';

@Directive({
    selector: '[decimal]'
})
export class DecimalDirective extends NumberDirective {
    constructor(private _cultureService: CultureService) {
        super();
    }
    protected additionalCheck(event: KeyboardEvent): boolean {
        return event.keyCode == this.getDecimalSeparatorCode();
    }

    private getDecimalSeparatorCode = (): number => {
        let separator = getLocaleNumberSymbol(this._cultureService.getCurrentCulture(), NumberSymbol.Decimal);
        if(separator == "."){
            return 190
        }
        return 188;
    }

}