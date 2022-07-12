import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { ParametersTctService } from './../../services/parameters-tct.service';
import { BaseComponent } from './../../../../infrastructure/fidcare/components/common/base.component';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { FormControl, FormGroup } from '@angular/forms';
import { ParameterDto } from 'app/services/api/cpmbase';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { Observable, of } from 'rxjs';
import { AlertConfigDto, MedicalRecordAlertConfigResourceService } from 'app/services/api/measurementrule';
import { AddAlertParameterData } from 'app/md-module/models/md.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { AddAlertParameterTctComponent } from '../add-alert-parameter-tct/add-alert-parameter-tct.component';
import { TctParameter } from 'app/tct-module/models/alert-tct.model';
import { C } from '@angular/cdk/keycodes';

@Component({
	selector: 'app-alert-parameters-tct',
	templateUrl: './alert-parameters-tct.component.html',
	styleUrls: ['./alert-parameters-tct.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush

})
export class AlertParametersTctComponent extends BaseComponent implements OnInit {

	@Input() medicalRecord?: MedicalRecordRequest;
	@Input() closeMRMode = false;
	@Input() readOnly = false;

	public tableColumns: DataTableColumn[] = [];
	public dataTableManager: ListTableManager;
	public tableActions: DataTableAction[] = [];
	public formFilter: FormGroup;

	public _vitalParameters: TctParameter[] = [];
	public vitalParameters: SelectListitem[] = [];
	public loading = false;

	constructor(
		private readonly _tctParameter: ParametersTctService,
		private readonly _medicalRecordAlertConfResourceService: MedicalRecordAlertConfigResourceService,
		private _dialogService: DialogService) {
		super()
	}

	ngOnInit(): void {
		this._tctParameter.list().subscribe(result => {
			this._vitalParameters = result;
			this.vitalParameters = result.map(m => new SelectListitem(m.id, m.name));
		});
		this.prepareForm();
		this.prepareTable();
	}

	private prepareForm = (): void => {
		this.formFilter = new FormGroup({
			parameterId: new FormControl(null)
		});
		this.on(this.formFilter.controls.parameterId.valueChanges.subscribe(() =>
			this.dataTableManager.startReload()
		));
	}

	private prepareTable = (): void => {
		let columns: DataTableColumn[] = [];
		columns.push(DataTableUtils.createStringColumn("note", "md.alertName", false));
		columns.push(DataTableUtils.createStringColumn("minValue", "md.minValue", false));
		columns.push(DataTableUtils.createStringColumn("maxValue", "md.maxValue", false));
		this.tableColumns.push(...columns);
		if (!this.closeMRMode && !this.readOnly) {
			this.tableActions.push(DataTableUtils.createAction("common.edit", "edit", this.edit));
			this.tableActions.push(DataTableUtils.createAction("common.delete", "delete", this.delete));
		}
		this.dataTableManager = new ListTableManager("1", this.loadData);
	}

	private loadData = (): Observable<AlertConfigDto[]> => {
		if (this.formFilter.controls.parameterId.value) {
			return this._tctParameter.getAlertsByActivity(this.formFilter.controls.parameterId.value, this.medicalRecord.id);
		}
		else {
			return of([]);
		}
	}


	public showDialog = (alertConfig?: AlertConfigDto): void => {
		const vitalParameter = this._vitalParameters.find(f => f.id == this.formFilter.value.parameterId);
		this._dialogService.show(AddAlertParameterTctComponent, {
			data: {
				medicalRecord: this.medicalRecord,
				vitalParameter: vitalParameter,
				alertConfig: alertConfig,
			},
			panelClass: "modal-md",
			callback: (result) => {
				if (result) {
					this.dataTableManager.startReload();
				}
			}
		});
	}

	public add = (): void => {
		this.showDialog();

	}

	public edit = (alertConfig: AlertConfigDto): void => {
		this.showDialog(alertConfig);
	}

	public delete = (alertConfig: AlertConfigDto): void => {
		this._medicalRecordAlertConfResourceService.deleteMedicalRecordAlertConfigUsingDELETE(alertConfig.id, this.medicalRecord.id)
			.subscribe(() => {
				this.dataTableManager.startReload();
			});
	}

}
