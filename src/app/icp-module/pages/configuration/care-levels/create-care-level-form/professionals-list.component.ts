import { iconViewDetails } from './../../../../../../infrastructure/fidcare/utils/icons.utils';
import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { iconEdit, iconTrash } from "infrastructure/fidcare/utils/icons.utils";
import { CareLevelService } from "app/icp-module/services/api/care-level.service";
import { ProfessionalListItem } from "app/icp-module/services/model/care-level.model";
import { DataTableAction, DataTableColumn, ListTableManager } from "infrastructure/fidcare/components/data-table/types";
import { DataTableUtils } from "infrastructure/fidcare/utils/data-table.utils";
import { Observable } from "rxjs";
import { BaseListTablePage } from "../../../base-list-table.page";
import { DialogService } from "infrastructure/fidcare/services/dialog.service";
import { CreateProfessionalPage } from "../create-professional-page/create-professional.page";

@Component({
    selector: 'professionals-list',
    templateUrl: './professionals-list.page.html'
})
export class ProfessionalListComponent extends BaseListTablePage<ProfessionalListItem> {
    public tableColumns: DataTableColumn[] = [];
    public tableActions: DataTableAction[] = [];
    public filters: Filters = new Filters();
    @Input() careLevelId: string;

    constructor(
        private _careLevelService: CareLevelService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _dialogService: DialogService,
        private _profileService: ProfileService,
    ) {
        super(_activatedRoute, true);
        this._profileService.loadUserProfile().subscribe((user: Profile) => {
            if (user.isConfigurator) {
                this.createColumms();
                this.createActions();
            }
        });
    }

    private getDecoratedProfessionals = (): Observable<ProfessionalListItem[]> => {
        return this._careLevelService.listProfessionals(this.careLevelId);
    }

    protected getDataTableManager = (): ListTableManager<ProfessionalListItem> => {
        return new ListTableManager("to fix", this.getDecoratedProfessionals);
    }

    private createColumms = (): void => {
        let nameColumn = DataTableUtils.createStringColumn("professionalName", "icp.careLevel.listProfessional.professionalNameLabel", false);
        this.tableColumns.push(nameColumn);

        let dateColumn = DataTableUtils.createStringColumn("frequency", "icp.careLevel.listProfessional.frequencyLabel", false);
        this.tableColumns.push(dateColumn);

        dateColumn = DataTableUtils.createIntColumn("duration", "icp.careLevel.listProfessional.durationLabel", false);
        this.tableColumns.push(dateColumn);

        dateColumn = DataTableUtils.createIntColumn("minAccessNumber", "icp.careLevel.listProfessional.minAccessNumberLabel", false);
        this.tableColumns.push(dateColumn);

        dateColumn = DataTableUtils.createIntColumn("maxAccessNumber", "icp.careLevel.listProfessional.maxAccessNumberLabel", false);
        this.tableColumns.push(dateColumn);
    }

    private createActions = (): void => {


        let button = new DataTableAction();
		// Fix. richeisto da Toro: Nella maschera di dettaglio di un livello di cura, non deve essere presente la funzionalità "modifica" per le figure professionali.
        button.funcToInvoke = this.edit;
        button.label = "common.details";
        button.icon = iconViewDetails;
        this.tableActions.push(button);

        button = new DataTableAction();
        button.funcToInvoke = this.delete;
        button.label = "common.delete";
        button.icon = iconTrash;
        this.tableActions.push(button);
    }

    public edit = (row: ProfessionalListItem): void => {
        // const queryParams = {};
        // queryParams['returnUrl'] = this.getReturnUrl();
        // this._router.navigate(['icp/configuration/carelevels/'+this.careLevelId+'/professional/' + row.id], { queryParams: queryParams });
        this._dialogService.show(CreateProfessionalPage, {

            panelClass: 'modal-lg',
            callback: this.refreshList,
            data: {
                careLevelId: this.careLevelId,
                professionalId: row.id
            }
        });
    }

    public add = (): void => {
        // const queryParams = {};
        // queryParams['returnUrl'] = this.getReturnUrl();
        // this._router.navigate(['icp/configuration/carelevels/'+this.careLevelId+'/professional'], { queryParams: queryParams });
        this._dialogService.show(CreateProfessionalPage, {

            panelClass: 'modal-lg',
            callback: this.refreshList,
            data: {
                careLevelId: this.careLevelId
            }
        });

    }

    public delete = (row: ProfessionalListItem): void => {
        this._careLevelService.deleteProfessional(this.careLevelId, row.id).subscribe((result) => {
            this.dataTableManager.startReload();
        })
    }
    private refreshList = (data: any) => {
        this.dataTableManager.startReload();
    }
}

class Filters {
}