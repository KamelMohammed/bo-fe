import { Type } from '@angular/core';
import { SearchCriteria, SearchResult, SortCriteria } from '../../models/common.models';
import { BehaviorSubject, isObservable, Observable, of } from 'rxjs';
import { DataTableCellTemplateComponent } from './data-table-cell-template.component';
import { mergeMap } from 'rxjs/operators';

export class DataTableColumn {
    public name: string;
    public label?: string;
    public sortable: boolean = true;
	public sortableFieldId?: string
    public alignment: DataTableColumnAlignment = DataTableColumnAlignment.LEFT;
    public template?: Type<DataTableCellTemplateComponent>;
    public metadata: any = {};
}


export enum DataTableColumnAlignment {
    LEFT = "text-left",
    CENTER = "text-center",
    RIGHT = "text-right"
}


export class DataTableAction {
    public funcToInvoke: (row: any) => void = (row) => { };
    public label: string;
    public icon: string;
    public alwaysVisible: boolean = true;
    public enableFunc: (row: any) => boolean = (row) => true;
}

export interface ITableManager<T> {
    data: BehaviorSubject<ListData<T>>;
}

export interface IDataTableManager<T> extends ITableManager<T> {
    canChangeSize: boolean
    searchCriteria: SearchCriteria;
    searchCallback: (pageIndex: number, pageSize: number, reloading: boolean, sortField?: string, sortAsc?: boolean) => void;
    gridCode: string;
    startSearch: () => void;
    startReload: () => void;
    destroy: () => void;
    updateCurrentItems: (items: T[]) => void;
    getCurrentItems: () => T[];
	numberOfAvailableItems: () => number;
}


export interface ILocalDataTableManager {
    restartSearch: () => void
}

export class RemoteDataTableManager<TData = any, TSearchCriteria extends SearchCriteria = SearchCriteria> implements IDataTableManager<TData> {
    public data = new BehaviorSubject<ListData<TData>>(new ListData<TData>([], 0, 0));
    public searchCriteria: TSearchCriteria;
    public canChangeSize: boolean = true;
	public totalCount: number = 0;

    constructor(public gridCode: string = null, private _searchFunc: (searchCriteria: SearchCriteria, reloading: boolean) => Observable<SearchResult<TData>>, private setSearchCriteriaFunc: (searchCriteria: SearchCriteria) => void = (searchCriteria: SearchCriteria) => { }, initialSearchCriteria: TSearchCriteria = null) {
        this.searchCriteria = initialSearchCriteria || <TSearchCriteria>(new SearchCriteria());
    }
    public searchCallback = (pageIndex: number, pageSize: number, reloading: boolean, sortField?: string, sortAsc?: boolean): void => {
        this.searchCriteria = <TSearchCriteria>new SearchCriteria();
        this.searchCriteria.page = pageIndex;
        this.searchCriteria.size = pageSize;
        this.searchCriteria.keySelector = sortField;
        this.searchCriteria.ascending = sortAsc || false;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this.search(this.searchCriteria, reloading);
    }
	public numberOfAvailableItems = (): number => {
        return this.totalCount;
	}
    public startSearch = (): void => {
        this.searchCriteria.page = 0;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this.search(this.searchCriteria, false);
    }
    public startReload = (): void => {
        this.search(this.searchCriteria, false);
    }

    private search = (searchCriteria: TSearchCriteria, reloading: boolean): void => {
        this._searchFunc(searchCriteria, reloading).subscribe(result => {
			this.totalCount = result.totalElements;
            let data = new ListData(result.content, result.totalElements, searchCriteria.page);
            this.data.next(data);
        });
    }

    public updateCurrentItems = (data: TData[]): void => {
        let clonedData = <ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)));
        clonedData.data = data;
        this.data.next(clonedData);
    }

    public getCurrentItems = (): TData[] => {
        return (<ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)))).data;
    }


    public destroy = (): void => {
        this.data.complete();
    }

}

export class LocalDataTableManager<TData = any, TSearchCriteria extends SearchCriteria = SearchCriteria> implements IDataTableManager<TData>, ILocalDataTableManager {
    public searchCriteria: SearchCriteria;
    private _items: TData[] = null;
    public data = new BehaviorSubject<ListData<TData>>(new ListData<TData>([], 0, 0));
    public canChangeSize: boolean = true;

    constructor(public gridCode: string = null, private _loadFunc: () => Observable<TData[]>, private setSearchCriteriaFunc: (searchCriteria: SearchCriteria) => void = (searchCriteria: SearchCriteria) => { }, private filterFunc: (data: TData[], searchCriteria: SearchCriteria) => TData[] | Observable<TData[]> = (items: TData[]) => of(items), initialSearchCriteria: TSearchCriteria = null) {
        this.searchCriteria = initialSearchCriteria || <TSearchCriteria>(new SearchCriteria());
    }

    public searchCallback = (pageIndex: number, pageSize: number, reloading: boolean, sortField?: string, sortAsc?: boolean): void => {
        this.searchCriteria = new SearchCriteria();
        this.searchCriteria.page = pageIndex;
        this.searchCriteria.size = pageSize;
        this.searchCriteria.keySelector = sortField;
        this.searchCriteria.ascending = sortAsc || false;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this.search(this.searchCriteria, this.filterFunc);
    }
	public numberOfAvailableItems = (): number => {
		if (this._items) return this._items.length;
		return 0;
	}
    public restartSearch = (): void => {
        this._items = null;
        this.startSearch();
    }

    public startSearch = (): void => {
        this.searchCriteria.page = 0;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this.search(this.searchCriteria, this.filterFunc);
    }
    public startReload = (): void => {
        this.search(this.searchCriteria, this.filterFunc);
    }

    private search = (searchCriteria: SearchCriteria, filterFunc?: (data: TData[], searchCriteria: SearchCriteria) => TData[] | Observable<TData[]>): void => {
        let obs = this._items == null ? this._loadFunc() : of(this._items);
        obs.pipe(mergeMap(results => {
            this._items = [...results];
            if (filterFunc) {
                let result = filterFunc(this._items, searchCriteria);
                if (isObservable(result)) {
                    return result;
                }
                return of(result);
            }
            else {
                return of(this._items);
            }
        })).subscribe((result: TData[]) => {
            let items = [];
            let startIndex = searchCriteria.page * searchCriteria.size;
            let endIndex = startIndex + searchCriteria.size;
            if (endIndex > result.length) {
                endIndex = result.length - 1;
            }
            if (startIndex < result.length && endIndex >= startIndex) {
                items = [...result];
                if (searchCriteria.keySelector) {
                    if (searchCriteria.ascending) {
                        items = items.sortAsc(f => f[searchCriteria.keySelector]);
                    }
                    else {
                        items = items.sortDesc(f => f[searchCriteria.keySelector]);
                    }
                }
                items = items.slice(startIndex, endIndex + 1);
            }
            let listData = new ListData(items, result.length, this.searchCriteria.page);
            this.data.next(listData);
        });
    }

    public updateCurrentItems = (data: TData[]): void => {
        let clonedData = <ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)));
        clonedData.data = data;
        this.data.next(clonedData);
    }

    public getCurrentItems = (): TData[] => {
        return (<ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)))).data;
    }


    public destroy = (): void => {
        this.data.complete();
    }
}


export class ListTableManager<TData = any> implements ITableManager<TData>{
    public sortCriteria: SortCriteria = new SortCriteria();
    private _reload: boolean = true;
    public data = new BehaviorSubject<ListData<TData>>(new ListData<TData>([], 0, 0));
    constructor(public gridCode: string = null, private _searchFunc: () => Observable<TData[]>) {
    }

    public search = (sortCriteria: SortCriteria): void => {
        let obs: Observable<TData[]>;
        if (this._reload) {
            obs = this._searchFunc();
        }
        else {
            obs = of(this.data.value.data);
        }
        obs.subscribe((result: TData[]) => {
            this._reload = false;
            let items: TData[] = [...result];
            if (sortCriteria.keySelector) {
                if (sortCriteria.ascending) {
                    items = items.sortAsc(f => f[sortCriteria.keySelector]);
                }
                else {
                    items = items.sortDesc(f => f[sortCriteria.keySelector]);
                }
            }
            let ret = new ListData(items, items.length, 1);
            this.data.next(ret);
        });
    }


    public updateCurrentItems = (data: TData[]): void => {
        let clonedData = <ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)));
        clonedData.data = data;
        this.data.next(clonedData);
    }

    public getCurrentItems = (): TData[] => {
        return (<ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)))).data;
    }


    public startSearch = (): void => {
        this.search(this.sortCriteria);
    }

    public startReload = (): void => {
        this._reload = true;
        this.search(this.sortCriteria);
    }
}



export class TokenDataTableManager<TData = any, TSearchCriteria extends SearchCriteria = SearchCriteria> implements IDataTableManager<TData> {
    public data = new BehaviorSubject<ListData<TData>>(new ListData<TData>([], 0, 0));
    public searchCriteria: TSearchCriteria;
    public canChangeSize: boolean = false;
    private _tokenData: TokenData[] = [new TokenData(null, 0)];

    constructor(public gridCode: string = null, private _searchFunc: (searchCriteria: SearchCriteria, reloading: boolean) => Observable<SearchResult<TData>>, private setSearchCriteriaFunc: (searchCriteria: SearchCriteria) => void = (searchCriteria: SearchCriteria) => { }, initialSearchCriteria: TSearchCriteria = null) {
        this.searchCriteria = initialSearchCriteria || <TSearchCriteria>(new SearchCriteria());
        this.searchCriteria.page = 0;
    }
    public searchCallback = (pageIndex: number, pageSize: number, reloading: boolean, sortField?: string, sortAsc?: boolean): void => {
        if (this.searchCriteria.ascending != sortAsc || this.searchCriteria.keySelector != sortField || this.searchCriteria.size != pageSize || pageIndex == 1) {
            this._tokenData = [new TokenData(null, 0)];
        }
        this.searchCriteria = <TSearchCriteria>new SearchCriteria();
        this.searchCriteria.page = pageIndex;
        this.searchCriteria.size = pageSize;
        this.searchCriteria.keySelector = sortField;
        this.searchCriteria.ascending = sortAsc || false;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this.search(this.searchCriteria, reloading);
    }
	public numberOfAvailableItems = (): number => {
		if (this._tokenData) return this._tokenData.length;
		return 0;
	}
    public startSearch = (): void => {
        this.searchCriteria.page = 1;
        this.setSearchCriteriaFunc(this.searchCriteria);
        this._tokenData = [new TokenData(null, 0)];
        this.search(this.searchCriteria, false);
    }
    public startReload = (): void => {
        this.search(this.searchCriteria, false);
    }

    private search = (searchCriteria: TSearchCriteria, reloading: boolean): void => {
        (<TokenSearchCriteria><unknown>searchCriteria).continuationToken = this._tokenData[searchCriteria.page].token;
        this._searchFunc(searchCriteria, reloading).subscribe(result => {
            const continuationToken: string = result["continuationToken"];
            let data = new ListData(result.content, continuationToken != null ? (searchCriteria.size * searchCriteria.page): 0, searchCriteria.page);
            this.data.next(data);
            if (this._tokenData.length > searchCriteria.page) {
                this._tokenData[searchCriteria.page].token = continuationToken;
            }
            else {
                this._tokenData.push(new TokenData(continuationToken, searchCriteria.page));
            }
        });
    }

    public updateCurrentItems = (data: TData[]): void => {
        let clonedData = <ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)));
        clonedData.data = data;
        this.data.next(clonedData);
    }

    public getCurrentItems = (): TData[] => {
        return (<ListData<TData>>(JSON.parse(JSON.stringify(this.data.value)))).data;
    }


    public destroy = (): void => {
        this.data.complete();
    }

}


class TokenData {
    constructor(public token: string = null, public pageIndex: number) {

    }

}

class TokenSearchCriteria extends SearchCriteria {
    public continuationToken: string = null;
}


export class ListData<T> {
    constructor(public data: T[], public totalCount: number, public pageIndex: number) {

    }
}
