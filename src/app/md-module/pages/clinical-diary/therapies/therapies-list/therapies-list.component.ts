import { I } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditTherapyModalData, TherapyStatus } from 'app/md-module/models/md.model';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { PageTherapyDto, TherapyDto, TherapyService } from 'app/services/api/atm';
import { AlertConfigDto } from 'app/services/api/measurementrule';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { DataTableAction, DataTableColumn, ListTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { SearchCriteria, SearchResult, SelectListitem, TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { EnumUtils } from 'infrastructure/fidcare/utils/enum.utils';
import { iconReset } from 'infrastructure/fidcare/utils/icons.utils';
import { map, Observable, of } from 'rxjs';
import { EditTherapyHeaderComponent } from '../edit-therapy-header/edit-therapy-header.component';

@Component({
	selector: 'app-therapies-list',
	templateUrl: './therapies-list.component.html',
	styleUrls: ['./therapies-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TherapiesListComponent extends BaseComponent implements OnInit {

	@Input() medicalRecord?: MedicalRecordRequest;
	@Input() closeMRMode = false;
	@Input() readOnly = false;
	@Input() current = false;
	public filterDef: TableFilterFieldDef[] = [];

	public tableColumns: DataTableColumn[] = [];
	public dataTableManager: RemoteDataTableManager;
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	// public statusItems: SelectListitem[] = [];
	private _profile: Profile;

	constructor(private _profileService: ProfileService, private _router: Router, private readonly _therapyService: TherapyService, private _translateService: TranslateService, private _dialogService: DialogService) {
		super()
	}

	ngOnInit(): void {


		this.on(this._profileService.profile$.subscribe(profile => {
			this._profile = profile;

			let statusItems = EnumUtils.toSelectListitems(TherapyStatus, "TherapyStatus", this._translateService);
			statusItems = statusItems.filter(f => f.id != TherapyStatus.STARTED);
			if (this.current) {
				statusItems = statusItems.filter(f => f.id != TherapyStatus.INTERRUPTED && f.id != TherapyStatus.TERMINATED);
			}
			else {
				statusItems = statusItems.filter(f => f.id == TherapyStatus.INTERRUPTED || f.id == TherapyStatus.TERMINATED);
			}
			this.filterDef = [
				{
					fieldName: "therapy",
					label: "md.therapy",
					fieldType: 'inputstring',
					defaultValue: null,
					validators: []
				},
				{
					fieldName: "pathology",
					label: "md.pathology",
					fieldType: 'inputstring',
					defaultValue: null,
					validators: []
				},

				{
					fieldName: "status",
					defaultValue: null,
					fieldType: 'select',
					validators: [],
					label: "common.status",
					possibleDataValues: of(statusItems)
				}
			];
			this.prepareTable();
			this.search();
		}));
	}

	public onFiltersUpdate = (data) => {

		Object.assign(this.filters, data);
		this.dataTableManager.startSearch();
	}

	public clearFilters = (): void => {
		this.filters = new Filters();
		this.dataTableManager.startSearch();
	}

	private prepareTable = (): void => {
		let columns: DataTableColumn[] = [];
		columns.push(DataTableUtils.createStringColumn("therapy", "md.therapy", false));
		columns.push(DataTableUtils.createEnumColumn("status", "common.status", "TherapyStatus", false));
		columns.push(DataTableUtils.createStringColumn("pathologies", "md.pathologies", false));
		columns.push(DataTableUtils.createDateTimeColumn("lastUpdate", "md.lastUpdate", false));

		let actions: DataTableAction[] = [];
		this.tableColumns = [...columns];
		if (this.current) {
			if (!this.closeMRMode && !this.readOnly) {
				actions.push(DataTableUtils.createAction("common.detail", "heroicons_solid:annotation", this.details));
				actions.push(DataTableUtils.createAction("md.start", "heroicons_solid:play", this.start, (row: TherapyItem) => { return row.status == TherapyStatus.ACTIVE || row.status == TherapyStatus.INTERRUPTED; }, false));
				actions.push(DataTableUtils.createAction("md.terminate", "heroicons_solid:stop", this.terminate, (row: TherapyItem) => { return row.status == TherapyStatus.ACTIVE || row.status == TherapyStatus.INTERRUPTED || row.status == TherapyStatus.ONGOING; }, false));
				actions.push(DataTableUtils.createAction("md.interrupt", "heroicons_solid:pause", this.interrupt, (row: TherapyItem) => { return row.status == TherapyStatus.ONGOING; }, false));
				actions.push(DataTableUtils.createAction("md.active", "heroicons_solid:plus", this.active, (row: TherapyItem) => { return row.status == TherapyStatus.SAVED; }, false));
				actions.push(DataTableUtils.createAction("md.sut", "heroicons_solid:document-text", this.sut));
			}
		}
		else {
			actions.push(DataTableUtils.createAction("common.detail", "heroicons_solid:annotation", this.details));

			let action: DataTableAction = DataTableUtils.createAction("md.therapyRestoreActionCommand", iconReset, this.restore);
			action.enableFunc = (row: TherapyItem) => {
				return row.status == TherapyStatus.INTERRUPTED
			}
			actions.push(action);
		}
		this.tableActions = [...actions];
		this.dataTableManager = new RemoteDataTableManager("2", this.loadData, () => { }, null);
	}

	private loadData = (searchCriteria: SearchCriteria): Observable<SearchResult<TherapyItem>> => {
		let obs: Observable<PageTherapyDto>;
		console.log(this.filters.therapy)
		if (this.current) {
			obs = this._therapyService.findCurrentByFilterUsingGET(
				this.medicalRecord.id,
				this.filters.therapy || undefined,
				searchCriteria.page,
				this.filters.pathology || undefined,
				searchCriteria.size,
				<any>(this.filters.status || undefined));
		}
		else {
			obs = this._therapyService.findHistoricalByFilterUsingGET(
				this.medicalRecord.patient.id,
				this.filters.therapy || undefined,
				searchCriteria.page,
				this.filters.pathology || undefined,
				searchCriteria.size,
				<any>(this.filters.status || undefined));
		}
		return obs.pipe(map(m => {
			const ret = new SearchResult<TherapyItem>()
			ret.content = (m.content || []).map(m1 => new TherapyItem(m1));
			ret.totalElements = m.totalElements
			return ret;
		}));
	}

	private interrupt = (row: TherapyItem): void => {
		this._therapyService.interrupt(row.uuid).subscribe(() => {
			this.dataTableManager.startReload();
		})
	}

	private active = (row: TherapyItem): void => {
		this._therapyService.activate(row.uuid).subscribe(() => {
			this.dataTableManager.startReload();
		})
	}

	private start = (row: TherapyItem): void => {
		this._therapyService.start(row.uuid).subscribe(() => {
			this.dataTableManager.startReload();
		})
	}

	private terminate = (row: TherapyItem): void => {
		this._therapyService.terminate(row.uuid).subscribe(() => {
			this.dataTableManager.startReload();
		})
	}

	public search = (): void => {
		this.dataTableManager.startSearch();
	}
	public restore = (row: TherapyItem): void => {
		if (this.medicalRecord) {
			this._therapyService.restoreTherapy(this.medicalRecord.id, row.uuid).subscribe(() => {
				this.search();
			});
		}
	}



	public showDialog = (id?: string): void => {
		this._dialogService.show(EditTherapyHeaderComponent, {
			data: <EditTherapyModalData>{
				medicalRecord: this.medicalRecord,
				id: id
			},
			panelClass: "modal-lg",
			callback: (result) => {
				if (result) {
					this.dataTableManager.startReload();
					if (!id) {
						this.details(<TherapyItem>{ uuid: result });
					}
				}
			}
		});
	}

	public add = (): void => {
		this.showDialog();

	}

	public details = (item: TherapyItem): void => {
		this._router.navigate(['/md/therapy'], { state: { data: this.medicalRecord, selectedIndex: 6, id: item.uuid } });
	}

	public sut = (item: TherapyItem): void => {
		this._router.navigate(['/md/unique-therapy-sheet'], { state: { data: this.medicalRecord, selectedIndex: 6, id: item.uuid } });
	}

	public delete = (item: TherapyItem): void => {
		// this._medicalRecordAlertConfResourceService.deleteMedicalRecordAlertConfigUsingDELETE(alertConfig.id, this.medicalRecord.id)
		// 	.subscribe(() => {
		// 		this.dataTableManager.startReload();
		// 	});
	}
}

class TherapyItem {
	public status: TherapyStatus = null;
	public therapy: string = null;
	public uuid: string = null;
	public pathologies: string = null;
	public lastUpdate: string = null;
	constructor(therapyDto: TherapyDto) {
		this.status = <TherapyStatus>therapyDto.state;
		this.therapy = therapyDto.description;
		this.uuid = therapyDto.uuid;
		this.pathologies = (therapyDto.pathologies || []).map(m => m.description).join(" - ");
		this.lastUpdate = therapyDto.lastUpdate.toString();
	}
}

class Filters {
	public status?: TherapyStatus;
	public pathology?: string;
	public therapy?: string
}
