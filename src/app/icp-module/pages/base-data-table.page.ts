import { IDataTableManager } from './../../../infrastructure/fidcare/components/data-table/types';
import { BaseComponent } from './../../../infrastructure/fidcare/components/common/base.component';
import { Component, Inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchCriteria } from 'infrastructure/fidcare/models/common.models';

@Component({
    template: '',
    providers: [

    ]
})

export abstract class BaseDataTablePage<TData, TFilter = any> extends BaseComponent implements OnInit {
    public dataTableManager: IDataTableManager<any> = null;
    public filters: TFilter = null;
    constructor(protected activatedRoute: ActivatedRoute, @Inject(true) protected autoSearch: boolean) {
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
            if (searchCriteria && this.filters) {
                for (var prop in this.filters) {
                    this.filters[prop] = (<any>searchCriteria)[prop];
                }
            }
            if (this.autoSearch) {
                this.dataTableManager.startReload();
            }
        }));
        console.log(this.filters)
        this.initialize();
    }

	public get numberOfAvailableItems(): number {
		if (this.dataTableManager) return this.dataTableManager.numberOfAvailableItems();
        return 0;
	}

    protected initialize = (): void => {

    }
    protected getDataTableManager = (searchCriteria: SearchCriteria): IDataTableManager<TData> => {
        return null;
    }

    protected getReturnUrl = (baseUrl: string = null): string => {
        let ret = baseUrl || window.location.pathname;
		console.log(window.location);
		
        // let ret = baseUrl || window.location.pathname;
		console.log("getReturnUrl 1 '" + window.location.pathname + "'");
		
		let baseElement = document.head.getElementsByTagName("base")[0];
		if (baseElement && baseElement.href)
		{
			console.log(baseElement);
			console.log(baseElement.getAttribute("href"));
			
			ret = "/" + ret.substring(baseElement.getAttribute("href").length);
		}
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("searchCriteria");
        urlParams.append("searchCriteria", JSON.stringify(this.dataTableManager.searchCriteria));
		console.log("getReturnUrl 2 '" + ret + "'");
		
        return ret + '?' + urlParams.toString();
    }

    protected setSearchCriteria = (searchCriteria: SearchCriteria): void => {
        if (this.filters) {
            for (var prop in this.filters) {
                (<any>searchCriteria)[prop] = this.filters[prop];
            }
        }
    }
}