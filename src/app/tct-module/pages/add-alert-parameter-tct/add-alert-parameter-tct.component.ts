import { BaseComponent } from './../../../../infrastructure/fidcare/components/common/base.component';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAlertParameterData } from 'app/md-module/models/md.model';
import { AlertConfigDto, MedicalRecordAlertConfigResourceService } from 'app/services/api/measurementrule';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-add-alert-parameter-tct',
	templateUrl: './add-alert-parameter-tct.component.html',
	styleUrls: ['./add-alert-parameter-tct.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush

})
export class AddAlertParameterTctComponent extends BaseComponent implements OnInit {

	public form: FormGroup;

	constructor(private _fb: FormBuilder, private readonly _medicalRecordAlertConfResourceService: MedicalRecordAlertConfigResourceService, public readonly dialogRef: MatDialogRef<AddAlertParameterTctComponent>, @Inject(MAT_DIALOG_DATA) public data) {
		super()
	}

	get validForm(): boolean {
		return this.form && this.form.valid;
	}
	ngOnInit(): void {
		this.createForm();
	}

	private createForm = (): void => {
		this.form = this._fb.group({
			note: [this.data.alertConfig ? this.data.alertConfig.note : null, CommonValidators.required],
			minValue: [this.data.alertConfig ? this.data.alertConfig.minValue : null],
			maxValue: [this.data.alertConfig ? this.data.alertConfig.maxValue : null]
		})
		const minMaxValueValidator = (group: FormGroup) => {
			if (group) {
				if (!group.get('minValue').value && !group.get('maxValue').value) {
					return { oneFieldMandatory: true };
				}

				if (group.get('minValue').value && group.get('maxValue').value && Number(group.get('minValue').value) > Number(group.get('maxValue').value)) {
					return { lessThenValidation: true };
				}
			}
			return null;
		};

		this.form.setValidators(minMaxValueValidator);
	}

	public close = (): void => {
		this.dialogRef.close(false);
	}

	public save = (): void => {
		if (this.form.isValid()) {
			const data = <AlertConfigDto>this.form.value;
			data.measurementDescription = this.data.vitalParameter.name;
			data.measurementCode = this.data.vitalParameter.id;
			data.medicalRecordCode = this.data.medicalRecord.id;
			data.measureUnitId = (this.data.vitalParameter.measurementUnit) ? this.data.vitalParameter.measurementUnit.id : null;
			let obs: Observable<AlertConfigDto>;
			if (this.data.alertConfig) {
				data.id = this.data.alertConfig.id;
				obs = this._medicalRecordAlertConfResourceService.updateMedicalRecordAlertConfigUsingPUT(this.data.alertConfig.id, data, this.data.medicalRecord.id);
			}
			else {
				obs = this._medicalRecordAlertConfResourceService.createMedicalRecordAlertConfigUsingPOST(data, this.data.medicalRecord.id);
			}
			obs.subscribe(() => {
				this.dialogRef.close(true);
			});


		}
	}
}
