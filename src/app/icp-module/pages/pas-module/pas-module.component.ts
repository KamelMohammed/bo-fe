import { Profile } from './../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../infrastructure/fidcare/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { BaseDataTablePage } from '../base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute, Router } from '@angular/router';
import { PASService } from 'app/icp-module/services/api/pas.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconActivate, iconDeactivate, iconDuplicate, iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { PASListItem, PASSearchCriteria } from 'app/icp-module/services/model/pas.model';

@Component({
    selector: 'app-pas-module',
    templateUrl: './pas-module.component.html',
    styleUrls: ['./pas-module.component.scss']
})
export class PasModuleComponent extends BaseDataTablePage<PASListItem, Filters> implements OnInit {

    public tableColumns: DataTableColumn[] = [];
    public tableActions: DataTableAction[] = [];
    public isCSanitario: boolean = false;
    public filters: Filters = new Filters();
    constructor(
        _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _pasService: PASService,
        private _dialogServide: DialogService,
        private _profileService: ProfileService
    ) {
        super(_activatedRoute, true);
        this._profileService.loadUserProfile().subscribe((user: Profile) => {
            this.isCSanitario = user.isCSanitario;
            if (this.isCSanitario) {
                this.createColumms();
                this.createActions();
            }

        });
    }

    protected getDataTableManager = (searchCriteria: PASSearchCriteria): IDataTableManager<PASListItem> => {
        return new RemoteDataTableManager("da correggere", this._pasService.list, this.setSearchCriteria, searchCriteria)
    }

    private createColumms = (): void => {

        let nameColumn = DataTableUtils.createStringColumn("name", "icp.pas.listPas.nameLabel", true);
        this.tableColumns.push(nameColumn);

        let levelColumns = DataTableUtils.createStringColumn("careLevelName", "icp.pas.listPas.careLevelLabel", true);
        this.tableColumns.push(levelColumns);

        let pathologiesColumn = DataTableUtils.createStringColumn("pathologiesName", "icp.pas.listPas.pathologiesLabel", true);
        this.tableColumns.push(pathologiesColumn);

        let activeColumn = DataTableUtils.createBooleanColumn("active", "icp.pas.listPas.activeLabel", true);
        this.tableColumns.push(activeColumn);

    }

    private createActions = (): void => {
        let editButton = new DataTableAction();
        editButton.funcToInvoke = this.edit;
        editButton.label = "modifica";
        editButton.icon = iconEdit;
        this.tableActions.push(editButton)

        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.delete;
        deleteButton.label = "elimina";
        deleteButton.icon = iconTrash;
        this.tableActions.push(deleteButton)

        let cloneButton = new DataTableAction();
        cloneButton.funcToInvoke = this.clone;
        cloneButton.label = "duplica";
        cloneButton.icon = iconDuplicate;
        this.tableActions.push(cloneButton);

        let activeButton = new DataTableAction();
        activeButton.funcToInvoke = this.active;
        activeButton.label = "attiva";
        activeButton.icon = iconActivate;
        activeButton.enableFunc = (row: PASListItem) => (!row.active && row.servicesActivityNumber != 0);
        this.tableActions.push(activeButton);

        let deactiveButton = new DataTableAction();
        deactiveButton.funcToInvoke = this.deactive;
        deactiveButton.label = "disattiva";
        deactiveButton.icon = iconDeactivate;
        deactiveButton.enableFunc = (row: PASListItem) => { return row.active; }

        this.tableActions.push(deactiveButton);

    }

    public clone = (row: PASListItem): void => {
        this._pasService.duplicate(row.id).subscribe({
            next: () => this.dataTableManager.startSearch()
        });
    }

    public active = (row: PASListItem): void => {
        this._pasService.updateState(row.id, true).subscribe({
            next: () => this.dataTableManager.startSearch()
        });
    }

    public deactive = (row: PASListItem): void => {
        this._pasService.updateState(row.id, false).subscribe({
            next: () => this.dataTableManager.startSearch()
        });
    }

    public edit = (row: PASListItem): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        this._router.navigate(['icp/pas/edit', row.id], { queryParams: queryParams });
    }

    public delete = (row: PASListItem): void => {
        let remove = (confirm) => {
            if (confirm) {
                this._pasService.delete(row.id).subscribe({
                    next: () => this.dataTableManager.startSearch(),
                    error: (message: string) => { console.log(message); }
                });
            }
        }
        this._dialogServide.showConfirm("Elimina PAS", "Sei sicuro di voler eliminare il PAS selezionato", { callback: remove });
    }


    protected setSearchCriteria = (criteria: PASSearchCriteria): void => {
        // criteria.level = this.filters.level;
    }

    public search = (): void => {
        this.dataTableManager.startSearch();
    }
    public create = (): void => {
        this._router.navigateWithReturnUrl(['icp/pas/edit'], this.getReturnUrl());
    }

    public patologies(item) {
        if (item && item.pathologiesName) return item.pathologiesName.join(", ");
    }
}

class Filters {
}

