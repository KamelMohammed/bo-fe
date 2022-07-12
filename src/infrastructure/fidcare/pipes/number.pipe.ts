import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { CultureService } from '../services/culture.service';
import { Subscription } from 'rxjs';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'number' })
export class NumberPipe implements PipeTransform {
    private _subscription: Subscription = null;
    constructor(private _cultureService: CultureService, private _changeDetector: ChangeDetectorRef) { }
    transform(value: number, numOfDecimals: number = null): string {
        let digitsInfo: string = `1.${numOfDecimals ? numOfDecimals : 0}-${numOfDecimals ? numOfDecimals : 999}`;
        let ret = null;
        if (value != null) {
            ret = formatNumber(value, this._cultureService.getCurrentCulture(), digitsInfo);
        }

        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }

        this._subscription = this._cultureService.cultureChanged.subscribe(change => {
            this._changeDetector.markForCheck();
        });

        return ret;
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    }
}