import { Injectable, EventEmitter, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment'
import { DateAdapter } from '@angular/material/core';
import { ICultureConfiguration, CULTURE_CONFIGURATION_TOKEN } from '../models/common.models';


@Injectable({
    providedIn: 'root'
})
export class CultureService {
    public cultureChanged: EventEmitter<string> = new EventEmitter<string>();
    constructor(private _translateService: TranslateService, private _adapter: DateAdapter<any>, @Inject(CULTURE_CONFIGURATION_TOKEN) private _cultureConfiguration: ICultureConfiguration) {
    }

    public initialize = () => {
        this._translateService.addLangs(this._cultureConfiguration.cultureCodes);
        this._translateService.setDefaultLang(this._cultureConfiguration.defaultCultureCode);
        this.setCurrentCulture(this._cultureConfiguration.defaultCultureCode);
    }

    public getCurrentCulture = (): string => {
        return this._translateService.currentLang;
    }

    public setCurrentCulture = (culture: string): void => {

        // Label
        this._translateService.use(culture);

        //Datepicker
        this._adapter.setLocale(culture);

        //Moment
        moment.locale(culture)
        this.cultureChanged.emit(culture);
    }
}