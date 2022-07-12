import { Component, Inject, OnInit } from '@angular/core';
import { BaseComponent } from '../common/base.component';
import { SearchCriteria } from '../../models/common.models';
import { IDataTableManager } from '../data-table/types';
import { ActivatedRoute } from '@angular/router';
import { RouterUtils } from '../../utils/router.utils';

@Component({
    template: ''
})
export class TablePageComponent<TData, TFilter> extends BaseComponent implements OnInit {
    public dataTableManager: IDataTableManager<any> = null;
    public filters: TFilter = null;
    constructor(protected activatedRoute: ActivatedRoute, @Inject(true) protected autoSearch: boolean = true) {
        super();
    }
    ngOnInit(): void {
        this.on(this.activatedRoute.queryParams.subscribe(queryParams => {
            if (this.dataTableManager) {
                this.dataTableManager.destroy();
            }
            //Leggo i parametri di rcerca dalla return Url
            let searchCriteria = <SearchCriteria>(queryParams["searchCriteria"] ? JSON.parse(queryParams["searchCriteria"]) : null);
            this.dataTableManager = this.getDataTableManager(searchCriteria);

            //ora setto i parametri sui filtri
            if (searchCriteria) {
                for (var prop in this.filters) {
                    this.filters[prop] = (<any>searchCriteria)[prop];
                }
            }
            if (this.autoSearch) {
                this.dataTableManager.startReload();
            }
        }));
        this.initialize();
    }

    protected initialize = (): void => {

    }
    protected getDataTableManager = (searchCriteria: SearchCriteria): IDataTableManager<TData> => {
        return null;
    }

    protected getReturnUrl = (baseUrl: string = null): string => {
        return RouterUtils.createReturnUrl(baseUrl, this.dataTableManager.searchCriteria);
    }

    protected setSearchCriteria = (searchCriteria: SearchCriteria): void => {
        for (var prop in this.filters) {
            (<any>searchCriteria)[prop] = this.filters[prop];
        }
    }
}