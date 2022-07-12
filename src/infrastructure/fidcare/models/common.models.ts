import { InjectionToken } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';


export class SelectListitem {
    constructor(public id: any, public label: string) {
    }
}

export class SearchResult<T>{
    public content: T[] = [];
    public totalElements: number = 0;
}

export class TokenSearchResult<T>{
    public items: T[] = [];
    public continuationToken: string = null;
}


export interface ICultureConfiguration {
    cultureCodes: string[];
    resourcePaths: string[];
    defaultCultureCode: string;
}

export class SortCriteria {
    public ascending: boolean = true;
    public keySelector: string = null;
}
export class SearchCriteria extends SortCriteria {
    public size: number = 10;
    public page: number = 0;
}

export const CULTURE_CONFIGURATION_TOKEN = new InjectionToken<ICultureConfiguration>('ICultureConfiguration');

export class DialogOptions<T> extends MatDialogConfig<any>{
    public localize?: boolean;
    public messageParams?: string[]
    public callback?: (data: T) => void;
}

export class MatChipItem<T = any> {
    constructor(public data: T, public color: string = "", public cssClass: string = "") {
    }
}

export class KeyValue {
    constructor(public value: any, public label: string) {
    }
}

export class TableFilterFieldDef {
    fieldName: string;
    label: string;
    validators: Validators[];
    defaultValue: any;
    fieldType: "inputstring" | "select" | "multipleselect" = "inputstring";
    possibleDataValues?: Observable<SelectListitem[]>;
    hidden?: boolean = true;
}


export class NotificationMessage {
    public code: string = null;
}