import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { all } from 'deepmerge';
import { TranslateLoader } from '@ngx-translate/core';
import { ICultureConfiguration } from '../models/common.models';
@Injectable()
export class InMemoryTranslateHttpLoader extends TranslateLoader {
    private _data: TranslationResult[] = [];




    constructor(private _httpClient: HttpClient, private _cultureConfiguration: ICultureConfiguration) {
        super();
    }


    public initialize = (): Observable<TranslationResult[]> => {
        let httpCalls: Observable<any>[] = []
        for (let i = 0; i < this._cultureConfiguration.resourcePaths.length; i++) {
            for (let x = 0; x < this._cultureConfiguration.cultureCodes.length; x++) {
                let url = this._cultureConfiguration.resourcePaths[i].replace("{code}", this._cultureConfiguration.cultureCodes[x]);
                httpCalls.push(this._httpClient.get(url).pipe(map(result =>
                    new TranslationResult(this._cultureConfiguration.cultureCodes[x], result)
                )));
            }
        }
        return forkJoin(httpCalls).pipe(tap((results: TranslationResult[]) => {
            this._data = results.groupBy(g => g.cultureCode).map(m => {
                let mergedItems = all(m.items.map(m => m.data));
                return new TranslationResult(m.key, mergedItems);
            })
        }));
    }

    public getTranslation(lang: string): Observable<any> {
        let ret = this._data.find(f => f.cultureCode == lang).data
        return of(ret);
    }
}

export class TranslationResult {
    constructor(public cultureCode: string, public data: any) { }
}