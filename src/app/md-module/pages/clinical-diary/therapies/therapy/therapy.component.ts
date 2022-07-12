import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EditDrugModalData, EditTherapyModalData } from "app/md-module/models/md.model";
import { MedicalRecordRequest } from "app/md-module/services/mrc";
import { PTComponentDto, TherapyDto, TherapyService } from "app/services/api/atm";
import { BaseComponent } from "infrastructure/fidcare/components/common/base.component";
import { DataTableAction, DataTableColumn, ListTableManager } from "infrastructure/fidcare/components/data-table/types";
import { MatChipItem, SelectListitem } from "infrastructure/fidcare/models/common.models";
import { DialogService } from "infrastructure/fidcare/services/dialog.service";
import { DataTableUtils } from "infrastructure/fidcare/utils/data-table.utils";
import { Observable, of } from "rxjs";
import { AddDrugComponent } from "../add-drug/add-drug.component";
import { EditTherapyHeaderComponent } from "../edit-therapy-header/edit-therapy-header.component";


@Component({
	selector: 'app-therapy',
	templateUrl: './therapy.component.html'
})
export class TherapyComponent extends BaseComponent implements OnInit {
	public canUpdate: boolean = true;
	public therapy: TherapyDto;
	private _medicalRecord?: MedicalRecordRequest;
	private _components: ComponentItem[] = [];
	public pathologies: MatChipItem<SelectListitem>[] = [];
	public tableColumns: DataTableColumn[] = [];
	public dataTableManager: ListTableManager;
	public tableActions: DataTableAction[] = [];

	constructor(private _dialogService: DialogService, private _therapyService: TherapyService, private _translateService: TranslateService) {
		super()
	}

	ngOnInit(): void {
		this._medicalRecord = history.state.data;
		this.dataTableManager = new ListTableManager("1", this.getComponents)
		this.loadData();
		this.prepareTable();
	}

	private getComponents = (): Observable<ComponentItem[]> => {
		return of(this._components);
	}

	private loadData = (): void => {
		this._therapyService.getTherapyDetails(history.state.id).subscribe(result => {
			this.therapy = result.therapyDto;
			this._components = (result.components || []).map(m => new ComponentItem(m, this._translateService));
			this.pathologies = [...this.therapy.pathologies.map(m => new MatChipItem(new SelectListitem(m.code, m.description)))];
			this.dataTableManager.startReload();
		});
	}

	private prepareTable = (): void => {
		let columns: DataTableColumn[] = [];
		columns.push(DataTableUtils.createStringColumn("drug", "common.drug", false));
		columns.push(DataTableUtils.createIntColumn("quantity", "md.quantity", false));
		columns.push(DataTableUtils.createStringColumn("administrationRoute", "md.administrationRoute", false));
		columns.push(DataTableUtils.createStringColumn("posology", "md.posology", false));
		columns.push(DataTableUtils.createStringColumn("timing", "md.timing", false));
		columns.push(DataTableUtils.createBooleanColumn("notReplaceable", "md.notReplaceable", false));
		columns.push(DataTableUtils.createStringColumn("note", "common.note", false));
		this.tableColumns.push(...columns);

		this.tableActions.push(DataTableUtils.createAction("common.edit", "edit", this.edit));
		this.tableActions.push(DataTableUtils.createAction("common.delete", "delete", this.delete));
	}

	public add = (): void => {
		this._dialogService.show(AddDrugComponent, {
			panelClass: 'modal-xl',
			data: <EditDrugModalData>{
				component: null,
				therapy: this.therapy
			},
			callback: (result) => {
				// this.dataTableManager.startReload();
				this.loadData();
			}
		})
	}

	public edit = (row: ComponentItem): void => {
		this._dialogService.show(AddDrugComponent, {
			panelClass: 'modal-xl',
			data: <EditDrugModalData>{
				component: row.component,
				therapy: this.therapy
			},
			callback: result => {
				// this.dataTableManager.startReload();
				this.loadData();
			}
		})
	}

	public delete = (): void => {

	}

	public editTherapy = (): void => {
		this._dialogService.show(EditTherapyHeaderComponent, {
			data: <EditTherapyModalData>{
				medicalRecord: history.state.data,
				id: history.state.id
			},
			panelClass: "modal-lg",
			callback: (result) => {
				this.loadData();
			}
		});
	}
}


class ComponentItem {
	public drug: string;
	public quantity: number;
	public administrationRoute: string;
	public posology: string;
	public timing: string;
	public notReplaceable: boolean;
	public note: string;
	constructor(public component: PTComponentDto, translateService: TranslateService) {
		this.drug = component.drug.name;
		this.quantity = component.quantity;
		this.administrationRoute = component.administrationRoute;
		this.posology = this.getPosology(component, translateService)
		this.timing = this.getTiming(component, translateService);
		this.notReplaceable = !component.replaceable;
		this.note = component.note;
	}

	private getPosology = (component: PTComponentDto, translateService: TranslateService): string => {
		const name = <string>(translateService.instant(`enums.Posology.${component.posology}`));
		let params = component.posologyParam.map(m => m.toString());
		switch (component.posology) {
			case "DAILY":
				break;
			case "DAYS_OF_MONTH":
				params = [params[0], params.skip(1).join(',')]
				break;
			case "DAYS_OF_WEEK":
				params = [params[0], params.skip(1).map(m => translateService.instant(`enums.Days.${m}`)).join(',')]
				break;
			case "EXACT_DAYS_OF_MONTH":
				params = [params.join(',')]
				break;
			case "EXACT_DAYS_OF_WEEK":
				params = [params.map(m => translateService.instant(`enums.Days.${m}`)).join(',')];
				break;
		}
		const ret = name.format(params);
		return ret;
	}
	private getTiming = (component: PTComponentDto, translateService: TranslateService): string => {
		const name = <string>(translateService.instant(`enums.Timing.${component.timing}`));
		const ret = name.format(component.timingParam.map(m => m.toString()));
		return ret;
	}
}
