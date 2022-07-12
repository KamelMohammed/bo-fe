import { iconViewDetails } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { GlossaryService } from './../../../services/api/glossary.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseDataTablePage } from '../../base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ServiceListItem, ServiceSearchCriteria } from 'app/icp-module/services/model/service.model';
import { ServiceService } from 'app/icp-module/services/api/service.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { map, Observable } from 'rxjs';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';


@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent extends BaseDataTablePage<ServiceListItem, Filters> implements OnInit {

    public tableColumns: DataTableColumn[] = [];
    public tableActions: DataTableAction[] = [];

    public filters: Filters = new Filters();
    public filterDef: TableFilterFieldDef[] = [];


    constructor(
        private _translateService: TranslateService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _serviceService: ServiceService,
        private _glossaryService: GlossaryService,
        private _dialogServide: DialogService,
        private _profileService: ProfileService
    ) {
        super(_activatedRoute, true);
        this.createColumms();
        this.createActions();

        let types: Observable<SelectListitem[]> = this._glossaryService.list(GlossaryType.SERVICE_TYPES).pipe(
            map(result => {
                return result.map(m => new SelectListitem(m.id, m.name));
            })
        );

        this.filterDef = [
            {
                fieldName: "typeId",
                defaultValue: null,
                fieldType: 'select',
                validators: [],
                label: "icp.service.listService.filterNameLabel",
                possibleDataValues: types
            },
            {
                fieldName: "serviceName",
                defaultValue: null,
                fieldType: 'inputstring',
                validators: [],
                label: "icp.service.listService.filterByNameLabel",
            }
        ];
    }


    protected getDataTableManager = (searchCriteria: ServiceSearchCriteria): IDataTableManager<ServiceListItem> => {
        return new RemoteDataTableManager("da correggere", this._serviceService.list, this.setSearchCriteria, searchCriteria)
    }

    private createColumms = (): void => {

        let nameColumn = DataTableUtils.createStringColumn("service", "icp.service.listService.serviceLabel", true);
        this.tableColumns.push(nameColumn);

        let typeColumn = DataTableUtils.createStringColumn("typeName", "icp.service.listService.typeLabel", true, "type.name");
        this.tableColumns.push(typeColumn);

        let accessCostColumn = DataTableUtils.createStringColumn("accessCost", "icp.service.listService.accessCostLabel", true);
        this.tableColumns.push(accessCostColumn);

        let professionalsColumns = DataTableUtils.createArrayColumn("professionalsName", "icp.service.listService.professionalsLabel", "", true);
        this.tableColumns.push(professionalsColumns);
    }

    private createActions = (): void => {
        let editButton = new DataTableAction();
        editButton.funcToInvoke = this.edit;
        editButton.label = "common.details";
        editButton.icon = iconViewDetails;
        this.tableActions.push(editButton)

        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.delete;
        deleteButton.label = "elimina";
        deleteButton.icon = iconTrash;
        this.tableActions.push(deleteButton)

    }

    public edit = (row: ServiceListItem): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        this._router.navigate(['icp/configuration/services/edit', row.id], { queryParams: queryParams });
    }

    public delete = (row: ServiceListItem): void => {
        let remove = (confirm) => {
            if (confirm) {
                this._serviceService.delete(row.id).subscribe({
                    next: () => this.dataTableManager.startSearch(),
                    error: (message: string) => { console.log(message); }
                });
            }
        }
        this._dialogServide.showConfirm("Elimina prestazione", "Sei sicuro di voler eliminare la prestazione selezionata?", { callback: remove });
    }


    protected setSearchCriteria = (criteria: ServiceSearchCriteria): void => {
        criteria.type = this.filters.typeId;
        criteria.serviceName= this.filters.serviceName;
    }

    public onFiltersUpdate = (data) => {
        Object.assign(this.filters, data);
        this.dataTableManager.startSearch();
    }

    public search = (): void => {
        this.dataTableManager.startSearch();
    }

    public create = (): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        console.log(this.getReturnUrl());
        this._router.navigate(['icp/configuration/services/edit'], { queryParams: queryParams });
    }

}

class Filters {
    public typeId: string = null;
    public serviceName:string=null;
}
