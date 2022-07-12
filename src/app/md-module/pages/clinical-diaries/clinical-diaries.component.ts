import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordRequest, MedicalRecordService, PageMedicalRecordRequest } from '../../services/mrc';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { TablePageComponent } from 'infrastructure/fidcare/components/pages/table-page.component';
import { SearchCriteria, SearchResult, SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { map, Observable, of } from 'rxjs';
import { MedicalRecordStatus } from '../clinical-diary/patient/patient.component';
import { TranslateService } from '@ngx-translate/core';
import { iconCircleCheck, iconFolder } from 'infrastructure/fidcare/utils/icons.utils';

@Component({
	selector: 'clinical-diaries',
	templateUrl: './clinical-diaries.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ClinicalDiariesComponent extends TablePageComponent<MedicalRecordRequest, Filters> {
    public filterDef: TableFilterFieldDef[] = [];
	public tableColumns: DataTableColumn[] = [];
	public dataTableManager: RemoteDataTableManager;
	public tableActions: DataTableAction[] = [];
	private _profile: Profile;
	constructor(private _profileService: ProfileService, private _dialogService: DialogService, activatedRoute: ActivatedRoute, private _medicalRecordService: MedicalRecordService, private _router: Router, private _translateService: TranslateService) {
		super(activatedRoute, false)
		this.filters = new Filters();
	}
	public onFiltersUpdate = (data) => {
        Object.assign(this.filters, data);
        this.dataTableManager.startSearch();
    }
	public initialize = (): void => {
		this.prepareTable();
		this.on(this._profileService.profile$.subscribe(result => {
			this._profile = result;
			this.dataTableManager.startSearch();
		}));

		let status: Observable<SelectListitem[]> = of([
			{id: MedicalRecordStatus.APERTA, label: this._translateService.instant("enums.MedicalRecordStatus.APERTA")},
			{id: MedicalRecordStatus.CHIUSA, label: this._translateService.instant("enums.MedicalRecordStatus.CHIUSA")}
		]);
		this.filterDef = [
			{
				fieldName: "nome",
				label: "Nome",
				fieldType: 'inputstring',
				defaultValue: null,
				validators: []
			},
			{
				fieldName: "cognome",
				label: "Cognome",
				fieldType: 'inputstring',
				defaultValue: null,
				validators: []
			},
			{
				fieldName: "nosologico",
				label: "Nosologico",
				fieldType: 'inputstring',
				defaultValue: null,
				validators: []
			}
			,
			{
				fieldName: "stato",
				defaultValue: null,
				fieldType: 'select',
				validators: [],
				label: "Stato",
				possibleDataValues: status
			}
		];
	}

	protected getDataTableManager = (searchCriteria: FilterSearchCriteria): IDataTableManager<MedicalRecordRequest> => {
		return new RemoteDataTableManager("1", this.loadData, this.setSearchCriteria, searchCriteria);
	}

	private prepareTable = (): void => {
		let columns: DataTableColumn[] = [];
		columns.push(DataTableUtils.createStringColumn("patient.name", "common.firstName", false));
		columns.push(DataTableUtils.createStringColumn("patient.surname", "common.lastName", false));
		columns.push(DataTableUtils.createStringColumn("nosological", "common.nosological", false));
		columns.push(DataTableUtils.createDateColumn("patient.birthDate", "common.birthDate", false));
		columns.push(DataTableUtils.createStringColumn("patient.code", "common.code", false));
		columns.push(DataTableUtils.createStringColumn("status", "common.status", false));
		this.tableColumns.push(...columns);

		let editButton = new DataTableAction();
        editButton.funcToInvoke = this.navigateTo;
        editButton.label = "common.edit";
        editButton.icon = iconFolder;
        this.tableActions.push(editButton);

        let deleteButton = new DataTableAction();
        deleteButton.funcToInvoke = this.navigateTo;
        deleteButton.label = "common.delete";
        deleteButton.icon = iconCircleCheck;
        this.tableActions.push(deleteButton);
	}

	public add = (): void => {
		this._router.navigate(["/", "md", "clinical-diary"]);
	}

	public navigateTo = (medicalRecord: MedicalRecordRequest, closeMode = false): void => {
		let closeMRMode = this._profile.isPatient || (medicalRecord.status || "").toUpperCase() === 'CHIUSA';
		if (closeMode) closeMRMode = true;
		this._router.navigate(["/", "md", "clinical-diary"], { state: { data: medicalRecord, closeMRMode: closeMRMode } });
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
		this.filters = new Filters();
		this.dataTableManager.startSearch();
	}


	public search = (): void => {
		this.dataTableManager.startSearch();
	}

	private loadData = (searchCriteria: FilterSearchCriteria): Observable<SearchResult<MedicalRecordRequest>> => {
		const page = searchCriteria.page;
		let obs: Observable<PageMedicalRecordRequest>;
		obs = this._medicalRecordService.listMrc(undefined, undefined, searchCriteria.nosologico, page, searchCriteria.nome, searchCriteria.cognome, searchCriteria.size, undefined, searchCriteria.stato);
		/* if (!searchCriteria.nome && !searchCriteria.cognome && !searchCriteria.nosologico && !searchCriteria.stato) {
			if (this._profile.isSuperUsca) {
				obs = this._medicalRecordService.list(page, searchCriteria.size);
			} else if (this._profile.isUsca) {
				obs = this._medicalRecordService.list5(page, searchCriteria.size);
			} else if (this._profile.isDoctor) {
				obs = this._medicalRecordService.list4(page, searchCriteria.size);
			} else if (this._profile.isPatient) {
				obs = this._medicalRecordService.list6(page, searchCriteria.size);
			}
		}
		else {
			if (this._profile.isOperator) {
				obs = this._medicalRecordService.list7(undefined, undefined, searchCriteria.nosologico, page, searchCriteria.nome, searchCriteria.cognome, searchCriteria.size, undefined, searchCriteria.stato);
			} else if (this._profile.isUsca) {
				obs = this._medicalRecordService.list8(undefined, undefined, searchCriteria.nosologico, page, searchCriteria.nome, searchCriteria.cognome, searchCriteria.size, undefined, searchCriteria.stato);
			} else if (this._profile.isDoctor) {
				obs = this._medicalRecordService.list3(undefined, undefined, searchCriteria.nosologico, page, searchCriteria.nome, searchCriteria.cognome, searchCriteria.size, undefined, searchCriteria.stato);
			}
		} */
		if (!obs) {
			return of(new SearchResult<MedicalRecordRequest>());
		}
		return obs.pipe(map(m => {
			const ret = new SearchResult<MedicalRecordRequest>();
			ret.content = m.content;
			ret.totalElements = m.totalElements;
			return ret;
		}))
	}
}

class FilterSearchCriteria extends SearchCriteria {
	public nome: string;
	public cognome: string;
	public stato: string;
	public nosologico: string;
}

class Filters {
	public nome: string = null;
	public cognome: string = null;
	public stato: string = null;
	public nosologico: string = null;
}

class TableItem {
	public id: number;
	public firstName: string;
	public lastName: string;
}