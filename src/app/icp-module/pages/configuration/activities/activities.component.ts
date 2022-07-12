import { iconViewDetails } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { GlossaryService } from './../../../services/api/glossary.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseDataTablePage } from '../../base-data-table.page';
import { ActivityListItem, ActivitySearchCriteria } from 'app/icp-module/services/model/activity.model';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivityService } from 'app/icp-module/services/api/activity.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { map, Observable } from 'rxjs';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
@Component({
	selector: 'app-activities',
	templateUrl: './activities.component.html',
	styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends BaseDataTablePage<ActivityListItem, Filters> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];

	public filters: Filters = new Filters();
	public filterDef: TableFilterFieldDef[] = [];

	constructor(
		private _glossaryService: GlossaryService,
		private _translateService: TranslateService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _activityService: ActivityService,
		private _profileService: ProfileService,
		private _dialogServide: DialogService
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
				label: "icp.activity.listActivity.filterNameLabel",
				possibleDataValues: types
			},
			{
				fieldName: "activityName",
				defaultValue: null,
				fieldType: 'inputstring',
				validators: [],
				label: "icp.activity.listActivity.filterByNameLabel",
			}
		];

	}


	protected getDataTableManager = (searchCriteria: ActivitySearchCriteria): IDataTableManager<ActivityListItem> => {
		return new RemoteDataTableManager("to fix", this._activityService.list, this.setSearchCriteria, searchCriteria)
	}

	private createColumms = (): void => {
		let nameColumn = DataTableUtils.createStringColumn("activity", "icp.activity.listActivity.activityLabel", true);
		this.tableColumns.push(nameColumn);

		let careProfileColumns = DataTableUtils.createStringColumn("typeName", "icp.activity.listActivity.typeLabel", true);
		this.tableColumns.push(careProfileColumns);

		let levelColumns = DataTableUtils.createStringColumn("accessCost", "icp.activity.listActivity.accessCostLabel", true);
		this.tableColumns.push(levelColumns);

		let durationColumns = DataTableUtils.createStringColumn("duration", "icp.activity.listActivity.durationLabel", true);
		this.tableColumns.push(durationColumns);

		let professionalsColumns = DataTableUtils.createArrayColumn("professionalsName", "icp.activity.listActivity.professionalsLabel", "", true);
		this.tableColumns.push(professionalsColumns);
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

	public edit = (row: ActivityListItem): void => {
		const queryParams = {};
		queryParams['returnUrl'] = this.getReturnUrl();
		this._router.navigate(['icp/configuration/activities/edit', row.id], { queryParams: queryParams });
	}

	public delete = (row: ActivityListItem): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._activityService.delete(row.id).subscribe({
					next: () => this.dataTableManager.startSearch(),
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogServide.showConfirm("Elimina prestazione", "Sei sicuro di voler eliminare l'attività selezionata?", { callback: remove });
	}


	protected setSearchCriteria = (criteria: ActivitySearchCriteria): void => {
		criteria.type = this.filters.typeId;
		criteria.activityName=this.filters.activityName;
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
		// console.log(this.getReturnUrl());
		this._router.navigate(['icp/configuration/activities/edit'], { queryParams: queryParams });
	}

}

class Filters {
	public typeId: string = null;
	public activityName:string = null;
}
