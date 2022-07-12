import { BaseComponent } from './../../../infrastructure/fidcare/components/common/base.component';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
@Component({
    template: ''
})
export abstract class BaseListTablePage<TData> extends BaseComponent implements OnInit {
    public dataTableManager: ListTableManager<TData> = null;
    constructor(protected activatedRoute: ActivatedRoute, @Inject(true) protected autoSearch: boolean = true) {
        super();
    }
    ngOnInit(): void {
        this.on(this.activatedRoute.queryParams.subscribe(queryParams => {
            //Leggo i parametri di ricerca dalla return Url
            this.dataTableManager = this.getDataTableManager();

            if (this.autoSearch) {
                this.dataTableManager.startReload();
            }
        }));
        this.initialize();
    }

    protected initialize = (): void => {

    }
    protected getDataTableManager = (): ListTableManager<TData> => {
        return null;
    }

    protected getReturnUrl = (baseUrl: string = null): string => {
        let ret = baseUrl || window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        return ret + '?' + urlParams.toString();
    }
}