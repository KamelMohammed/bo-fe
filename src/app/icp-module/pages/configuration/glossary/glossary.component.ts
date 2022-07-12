import { iconViewDetails } from './../../../../../infrastructure/fidcare/utils/icons.utils';
import { GlossaryType, GlossarySearchCriteria, DetailedGlossaryElement } from './../../../services/model/glossary-element.model';
import { Component, OnInit } from '@angular/core';
import { BaseDataTablePage } from '../../base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { Observable, of } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconEdit, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-glossary',
	templateUrl: './glossary.component.html',
	styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent extends BaseDataTablePage<DetailedGlossaryElement> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];

	public filters: Filters = new Filters();
	public filterDef: TableFilterFieldDef[] = [];


	constructor(
		_activatedRoute: ActivatedRoute,
		private _router: Router,
		private _glossaryService: GlossaryService,
		private _dialogServide: DialogService,
		private _profileService: ProfileService,
		private _translateService: TranslateService
	) {
		super(_activatedRoute, true);

		this._profileService.profile$.subscribe((user: Profile) => {
			this.createColumms();
			if (user.isConfigurator) {
				this.createActions();
			}
		})

		let types: Observable<SelectListitem[]> = of(Object.keys(GlossaryType).map(m => new SelectListitem(m, this._translateService.instant("enums.GlossaryType."+m))));

		this.filterDef = [
			{
				fieldName: "type",
				defaultValue: null,
				fieldType: 'select',
				validators: [],
				label: "icp.glossary.listGlossary.filterGlossaryTypeLabel",
				possibleDataValues: types
			}
		];
	}


	protected getDataTableManager = (searchCriteria: GlossarySearchCriteria): IDataTableManager<DetailedGlossaryElement> => {
		return new RemoteDataTableManager("da correggere", this._glossaryService.listPaginated, this.setSearchCriteria, searchCriteria)
	}

	private createColumms = (): void => {

		let nameColumn = DataTableUtils.createStringColumn("name", "icp.glossary.listGlossary.nameLabel");
		this.tableColumns.push(nameColumn);

		let typeColumn = DataTableUtils.createEnumColumn("type", "icp.glossary.listGlossary.typeLabel", "GlossaryType");
		this.tableColumns.push(typeColumn);

		let accessCostColumn = DataTableUtils.createStringColumn("description", "icp.glossary.listGlossary.descriptionLabel");
		this.tableColumns.push(accessCostColumn);

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

	public edit = (row: DetailedGlossaryElement): void => {
		const queryParams = {};
		queryParams['returnUrl'] = this.getReturnUrl();
		this._router.navigate(['icp/configuration/glossary/edit', row.id], { queryParams: queryParams });
	}

	public delete = (row: DetailedGlossaryElement): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._glossaryService.delete(row.id).subscribe({
					next: () => this.dataTableManager.startSearch(),
					error: (message: string) => { console.log(message); }
				});
			}
		}
		this._dialogServide.showConfirm("Elimina elemento di glossario", "Sei sicuro di voler eliminare l'elemento di glossario selezionato?", { callback: remove });
	}


	protected setSearchCriteria = (criteria: GlossarySearchCriteria): void => {
		criteria.type = GlossaryType[this.filters.type];
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
		this._router.navigate(['icp/configuration/glossary/edit'], { queryParams: queryParams });
	}

}

class Filters {
	public type: string;
}

