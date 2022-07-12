import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddAlertParameterData } from 'app/md-module/models/md.model';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { ParameterDto, VitalParametersService } from 'app/services/api/cpmbase';
import { AlertConfigDto, MedicalRecordAlertConfigResourceService } from 'app/services/api/measurementrule';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { Observable, of } from 'rxjs';
import { AddAlertParameterComponent } from '../add-alert-parameter/add-alert-parameter.component';

@Component({
	selector: 'app-alert-parameters',
	templateUrl: './alert-parameters.component.html',
	styleUrls: ['./alert-parameters.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertParametersComponent extends BaseComponent implements OnInit {

	@Input() medicalRecord?: MedicalRecordRequest;
	@Input() closeMRMode = false;
	@Input() readOnly = false;

	public tableColumns: DataTableColumn[] = [];
	public dataTableManager: ListTableManager;
	public tableActions: DataTableAction[] = [];
	public formFilter: FormGroup;

	public vitalParameters: ParameterDto[] = [];
	public loading = false;

	constructor(private readonly _vitalParametersService: VitalParametersService, private readonly _medicalRecordAlertConfResourceService: MedicalRecordAlertConfigResourceService, private _dialogService: DialogService) {
		super()
	}

	ngOnInit(): void {
		this._vitalParametersService.findAll().subscribe(result => {
			this.vitalParameters = result.content || [];
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
			return this._medicalRecordAlertConfResourceService
				.getMedicalRecordAlertConfigsUsingGET(this.formFilter.controls.parameterId.value, this.medicalRecord.id);
		}
		else {
			return of([]);
		}
	}


	public showDialog = (alertConfig?: AlertConfigDto): void => {
		const vitalParameter = this.vitalParameters.find(f => f.uuid == this.formFilter.value.parameterId);
		this._dialogService.show(AddAlertParameterComponent, {
			data: <AddAlertParameterData>{
				medicalRecord: this.medicalRecord,
				vitalParameter: vitalParameter,
				alertConfig: alertConfig
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
