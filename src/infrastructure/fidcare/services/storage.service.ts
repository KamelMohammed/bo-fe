import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    private _key: string = null;
    constructor() {
        let baseElement = document.head.getElementsByTagName("base")[0];
        this._key = `${baseElement}:{0}`;
    }

    public getItem = <T>(key: string, session: boolean): T => {
        const fullKey = this.getFullKey(key);
        const value = (session ? window.sessionStorage : window.localStorage).getItem(fullKey);
        if (value != null) {
            return JSON.parse(value).data;
        }
        return null;
    }

    public setItem = <T>(key: string, value: T, session: boolean): void => {
        const fullKey = this.getFullKey(key);
        const data = {
            data: value
        };
        (session ? window.sessionStorage : window.localStorage).setItem(fullKey, JSON.stringify(data));
    }

    public deleteItem = (key: string, session: boolean): void => {
        const fullKey = this.getFullKey(key);
        (session ? window.sessionStorage : window.localStorage).removeItem(fullKey);
    }

    private getFullKey = (key: string): string => {
        if (!this._key) {
            const baseElement = document.head.getElementsByTagName("base")[0];
            this._key = `${baseElement}:{0}`;

        }
        const fullKey = this._key.format([key]);
        return fullKey;
    }
}
