import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { TablePageComponent } from 'infrastructure/fidcare/components/pages/table-page.component';
import { SearchCriteria, SearchResult } from 'infrastructure/fidcare/models/common.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'test-table',
    templateUrl: './test-table.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TestTableComponent extends TablePageComponent<TableItem, Filters> {

    public tableColumns: DataTableColumn[] = [];
    public dataTableManager: RemoteDataTableManager;
    public tableActions: DataTableAction[] = [];
    constructor(private _dialogService: DialogService, activatedRoute: ActivatedRoute) {
        super(activatedRoute)
        this.filters = new Filters();
    }

    public initialize = (): void => {
        this.prepareTable();

    }

    protected getDataTableManager = (searchCriteria: SearchCriteria): IDataTableManager<TableItem> => {
        return new RemoteDataTableManager("aaaaa", this.loadData, this.setSearchCriteria, searchCriteria);
    }

    private prepareTable = (): void => {
        let columns: DataTableColumn[] = [];
        columns.push(DataTableUtils.createIntColumn("id", "Id", false));
        columns.push(DataTableUtils.createStringColumn("firstName", "Nome", false));
        columns.push(DataTableUtils.createStringColumn("lastName", "Cognome", false));
        let professionalsColumns = DataTableUtils.createArrayColumn("professionalsId", "icp.activity.listActivity.professionalsLabel", "", false);
        columns.push(professionalsColumns);
        this.tableColumns.push(...columns);
        this.tableActions.push(DataTableUtils.createAction("common.edit", "edit", this.edit));
        this.tableActions.push(DataTableUtils.createAction("common.delete", "delete", this.delete));
    }

    public add = (): void => {
        //this._router.navigate(["arcades", "arcades", "edit", row.id]);
    }

    public edit = (row: TableItem): void => {
        //this._router.navigate(["arcades", "arcades", "edit", row.id]);
    }

    public delete = (row: TableItem): void => {
        this._dialogService.showConfirm("Titolo", "Messaggio", {
            callback: (result) => {
                if (result) {

                }
            }
        }, [row.firstName]);
    }

    public clearFilters = (): void => {
        this.dataTableManager.startSearch();
    }


    public search = (): void => {
        this.dataTableManager.startSearch();
    }

    private loadData = (searchCriteria: SearchCriteria): Observable<SearchResult<TableItem>> => {
        const data: any[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({
                id: i,
                firstName: `Nome ${i}`,
                lastName: `cogome ${i}`,
                professionalsId: ['primo', 'secondo', 'terzo']
            });
        }

        const ret = new SearchResult<TableItem>();
        ret.totalElements = 1000;
        ret.content = [...data.slice(searchCriteria.page * searchCriteria.size, (searchCriteria.page + 1) * searchCriteria.size)];
        return of(ret);
    }
}

class Filters {
}

class TableItem {
    public id: number;
    public firstName: string;
    public lastName: string;
}