import { iconViewDetails } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseDataTablePage } from '../../base-data-table.page';
import { CareLevelListItem, CareLevelsSearchCriteria } from 'app/icp-module/services/model/care-level.model';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { CareLevelService } from 'app/icp-module/services/api/care-level.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { map, Observable } from 'rxjs';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
@Component({
    selector: 'app-care-levels',
    templateUrl: './care-levels.component.html',
    styleUrls: ['./care-levels.component.scss']
})
export class CareLevelsComponent extends BaseDataTablePage<CareLevelListItem, Filters> implements OnInit {

    public tableColumns: DataTableColumn[] = [];
    public tableActions: DataTableAction[] = [];
    public filters: Filters = new Filters();

    public filterDef: TableFilterFieldDef[] = [];

    constructor(
        _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _careLevelService: CareLevelService,
        private _glossaryService: GlossaryService,
        private _dialogServide: DialogService,
        private _profileService: ProfileService,
    ) {
        super(_activatedRoute, true);
        this.createColumms();
        this.createActions();

        let levels: Observable<SelectListitem[]> = this._glossaryService.list(GlossaryType.CARE_LEVEL).pipe(
            map(result => {
                return result.map(m => new SelectListitem(m.id, m.name));
            })
        );

        this.filterDef = [
            {
                fieldName: "levelsId",
                defaultValue: null,
                fieldType: 'select',
                validators: [],
                label: "icp.careLevel.listCareLevel.filterLevelLabel",
                possibleDataValues: levels
            }
        ];
    }

    protected getDataTableManager = (searchCriteria: CareLevelsSearchCriteria): IDataTableManager<CareLevelListItem> => {
        return new RemoteDataTableManager("_careLevelService.list", this._careLevelService.list, this.setSearchCriteria, searchCriteria)
    }

    private createColumms = (): void => {
        let nameColumn = DataTableUtils.createStringColumn("name", "icp.careLevel.listCareLevel.nameLabel", true);
        this.tableColumns.push(nameColumn);

        let levelColumns = DataTableUtils.createStringColumn("levelName", "icp.careLevel.listCareLevel.levelLabel", true, "level.name");
        this.tableColumns.push(levelColumns);

        let careProfileColumns = DataTableUtils.createStringColumn("careProfileName", "icp.careLevel.listCareLevel.profileLabel", true, "careProfile.name");
        this.tableColumns.push(careProfileColumns);

    }

    private createActions = (): void => {
        let editButton = new DataTableAction();
        editButton.funcToInvoke = this.edit;
        editButton.label = "dettaglio";
        editButton.icon = iconViewDetails;
        this.tableActions.push(editButton)

        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.delete;
        deleteButton.label = "elimina";
        deleteButton.icon = iconTrash;
        this.tableActions.push(deleteButton)

    }

    public edit = (row: CareLevelListItem): void => {
        const queryParams = {};
        queryParams['returnUrl'] = this.getReturnUrl();
        this._router.navigate(['icp/configuration/carelevels/edit', row.id], { queryParams: queryParams });
    }

    public delete = (row: CareLevelListItem): void => {
        let remove = (confirm) => {
            if (confirm) {
                this._careLevelService.delete(row.id).subscribe({
                    next: () => this.dataTableManager.startSearch(),
                    error: (message: string) => this._dialogServide.showMessage("Errore eliminazione LIvello di cura", "Si è verificato un errore durante l'eliminazione. L'errore è: " + message)
                });
            }
        }
        this._dialogServide.showConfirm("icp.careLevel.listCareLevel.confirmDeleteCareLevelTitle", "icp.careLevel.listCareLevel.confirmDeleteCareLevelMessage", { callback: remove });
    }


    protected setSearchCriteria = (criteria: CareLevelsSearchCriteria): void => {
        criteria.level = this.filters.levelsId;
    }

    public search = (): void => {
        this.dataTableManager.startSearch();
    }
    public create = (): void => {
        this._router.navigateWithReturnUrl(['icp/configuration/carelevels/edit'], this.getReturnUrl());
    }

    public onFiltersUpdate = (data) => {
        Object.assign(this.filters, data);
        this.dataTableManager.startSearch();
    }

}

class Filters {
    public levelsId: string = null;
}
