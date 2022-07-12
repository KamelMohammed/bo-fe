import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { NumberValidators } from 'infrastructure/fidcare/components/forms/validators/number.validator';
import { OperationMeasurementResponse, OperationService, ParameterDto, ParameterResponse, SurveyCreationRequest, SurveyService, } from '../../../../../services/api/cpmbase';

@Component({
	selector: 'app-add-vital-parameter',
	templateUrl: './add-vital-parameter.component.html'
	// ,
	//changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVitalParameterComponent extends BaseComponent implements OnInit {
	public form: FormGroup;
	public operations: OperationMeasurementResponse[] = [];
	public parameters: ParameterResponse[] = [];
	constructor(public readonly dialogRef: MatDialogRef<AddVitalParameterComponent>, @Inject(MAT_DIALOG_DATA) public data: MedicalRecord, private readonly _operationService: OperationService, private readonly _surveyService: SurveyService) {
		super()
	}

	ngOnInit(): void {
		this._operationService.list().subscribe(result => {
			this.operations = [...result.content || []];
		});

		this.form = new FormGroup({
			operationId: new FormControl(null, CommonValidators.required),
			values: new FormGroup({})
		});
		this.on(this.form.controls.operationId.valueChanges.subscribe(newValue => {
			this.onOperationSelected(newValue);
		}));
	}

	private onOperationSelected = (operationId: string): void => {
		const newFormGroup = new FormGroup({});
		const operation = this.operations.find(f => f.id == operationId);
		let parameters = [];
		if (operation) {
			for (let i = 0; i < operation.parameters.length; i++) {
				const param = operation.parameters[i];
				const validators: ValidatorFn[] = [];

				if (param.primaryParameter) {
					validators.push(CommonValidators.required);
				}

				if (param.minValue && param.minValue >= 0) {
					validators.push(NumberValidators.minimum(param.minValue));
				}

				if (param.maxValue && param.maxValue >= 0) {
					validators.push(NumberValidators.maximum(param.minValue));
				}

				newFormGroup.addControl(param.uuid, new FormControl(null, validators));
			}
			parameters = [...operation.parameters];
		}
		this.parameters = [...parameters];
		this.form.removeControl("values")
		this.form.addControl("values", newFormGroup);
	}

	public close = (): void => {
		this.dialogRef.close(false);
	}

	public save = (): void => {
		if (this.form.isValid()) {
			const req = <SurveyCreationRequest>this.form.value;
			req.dateTime = new Date(Date.now());
			req.medicalRecordId = this.data.id;
			this._surveyService.create(req).subscribe(() => {
				this.dialogRef.close(true);
			});
		}
	}
}

