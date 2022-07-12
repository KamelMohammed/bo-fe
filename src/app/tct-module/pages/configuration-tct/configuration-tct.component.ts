import { Configuration } from './../../../services/api/vital-measurement/configuration';
import { ConfigurationTctService } from './../../services/configuration-tct.service';
import { BaseComponent } from './../../../../infrastructure/fidcare/components/common/base.component';
import { Component, Input, OnInit } from '@angular/core';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { FormControl, FormGroup } from '@angular/forms';
import { ParametersTctService } from 'app/tct-module/services/parameters-tct.service';
import { TctParameter } from 'app/tct-module/models/alert-tct.model';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { AlertConfigDto, MedicalRecordAlertConfigResourceService } from 'app/services/api/measurementrule';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { map, Observable, of } from 'rxjs';
import { AddAlertParameterTctComponent } from '../add-alert-parameter-tct/add-alert-parameter-tct.component';
import { ConfigurationNotification } from 'app/tct-module/models/configuration-tct.model';

@Component({
	selector: 'app-configuration-tct',
	templateUrl: './configuration-tct.component.html',
	styleUrls: ['./configuration-tct.component.scss']
})
export class ConfigurationTctComponent extends BaseComponent implements OnInit {

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
		private readonly _configurationTctService: ConfigurationTctService,
		private _dialogService: DialogService) {
		super()
	}

	ngOnInit(): void {
		this._tctParameter.list().subscribe(result => {
			this._vitalParameters = result;
			this.vitalParameters = result.map(m => new SelectListitem(m.id, m.name));
		});
		this.prepareForm();
	}

	private prepareForm = (): void => {
		this.formFilter = new FormGroup({
			parameterId: new FormControl(null)
		});
		this.on(this.formFilter.controls.parameterId.valueChanges.subscribe((id: string) => {
			let parameter: TctParameter = this._vitalParameters.filter(v => v.id == id)[0];
			this.prepareTable(parameter);
		}
		));
	}

	private prepareTable = (parameter:TctParameter): void => {
		let columns: DataTableColumn[] = [];
		switch (parameter.name) {
			case "Numero Passi":
				columns.push(DataTableUtils.createStringColumn("stepCounterTimeLapsInSec", "tct.stepCounterTimeLapsInSec", false));
				break;
			case "Frequenza Cardiaca":
				columns.push(DataTableUtils.createStringColumn("heartRateTimeLapsInSec", "tct.heartRateTimeLapsInSec", false));
				break;
			case"Allenamento da casa":
				break;
			case"Cadute":
				break;
			case"Chiamate SOS":
				columns.push(DataTableUtils.createStringColumn("sosNumber", "tct.sosNumber", false));
				break;
			case"Stato batteria":
				columns.push(DataTableUtils.createStringColumn("batteryTimeLaspInSec", "tct.batteryTimeLaspInSec", false));
				break;
			case "Tempo inattività":
				break;
		}
		// columns.push(DataTableUtils.createStringColumn("batteryThreshold1InPerc", "tct.batteryThreshold1InPerc", false));
		// columns.push(DataTableUtils.createStringColumn("batteryThreshold2InPerc", "tct.batteryThreshold2InPerc", false));
		// columns.push(DataTableUtils.createStringColumn("gpsTimeLapsInSec", "tct.gpsTimeLapsInSec", false));
		// columns.push(DataTableUtils.createStringColumn("messageTimestamp", "tct.messageTimestamp", false));
		// columns.push(DataTableUtils.createStringColumn("distance", "tct.distance", false));

		this.tableActions.push(DataTableUtils.createAction("common.edit", "edit", this.edit));
		this.tableColumns.push(...columns);
		this.dataTableManager = new ListTableManager("1", this.loadData);
		this.dataTableManager.startReload();
	}



	private loadData = (): Observable<ConfigurationNotification[]> => {
		return this._configurationTctService.list(this.medicalRecord.patient.id).pipe(map((conf)=>{
			let array:ConfigurationNotification[] = [];
			array.push(conf);
			return array;
		}))
	}


	// public showDialog = (alertConfig?: AlertConfigDto): void => {
	// 	const vitalParameter = this._vitalParameters.find(f => f.id == this.formFilter.value.parameterId);
	// 	this._dialogService.show(AddAlertParameterTctComponent, {
	// 		data: {
	// 			medicalRecord: this.medicalRecord,
	// 			vitalParameter: vitalParameter,
	// 			alertConfig: alertConfig,
	// 		},
	// 		panelClass: "modal-md",
	// 		callback: (result) => {
	// 			if (result) {
	// 				this.dataTableManager.startReload();
	// 			}
	// 		}
	// 	});
	// }

	// public add = (): void => {
	// 	this.showDialog();

	// }

	public edit = (alertConfig: AlertConfigDto): void => {
		//this.showDialog(alertConfig);
	}

}

