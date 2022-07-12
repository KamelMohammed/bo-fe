import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CultureService } from '../services/culture.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'enum' })
export class EnumPipe implements PipeTransform, OnDestroy {
    private _subscription: Subscription = null;
    constructor(private _cultureService: CultureService, private _translateService: TranslateService, private _changeDetector: ChangeDetectorRef) { }
    transform(value: string, enumName: string): string {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
        this._subscription = this._cultureService.cultureChanged.subscribe(change => {
            this._changeDetector.markForCheck();
        });

        if (value != null) {
            return this._translateService.instant(`enums.${enumName}.${value}`);
        }
        return null;
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
            this._subscription = null;
        }
    }
}
