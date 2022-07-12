import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'infrastructure/fidcare/services/auth.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
	Department,
	DepartmentControllerService,
	SubmissionComponentDataRequest,
	SubmissionControllerService,
	SubmissionDataRequest,
	SubmissionKeyValueDataRequest,
	SubmissionResponse,
	TemplateControllerService,
} from '../../services/api/aed';
import { DisplayGrid, GridsterConfig, GridType } from '../../shared/gridster/gridster-config.interface';
import { FieldType } from '../fields/field.model';
import { FormTO } from '../models/aed.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit, AfterViewInit {
	@Input() nosologico?: string;
	@Input() templateType?: string;
	@Input() closeMRMode = false;
	@Input() readOnly = false;
	@Input() patientUuid?: string;

	options: GridsterConfig = {
		gridType: GridType.Fixed,
		maxCols: 10000,
		maxRows: 10000,
		fixedColWidth: 20,
		fixedRowHeight: 15,
		displayGrid: DisplayGrid.OnDragAndResize,
		pushItems: false,
		margin: 0,
	};
	form: FormGroup = new FormGroup({});
	formTO$ = this.getSubmissionByNosologicoAndTemplateTypeUuid$();

	constructor(
		private readonly snackBarService: SnackBarService,
		private readonly translateService: TranslateService,
		private readonly authService: AuthService,
		private readonly departmentControllerService: DepartmentControllerService,
		private readonly templateControllerService: TemplateControllerService,
		private readonly submissionControllerService: SubmissionControllerService
	) { }

	ngOnInit(): void {
	}

	ngAfterViewInit(): void {
		if (this.closeMRMode || this.readOnly) {
			this.form.valueChanges.
				subscribe(() => {
					setTimeout(() => {
						this.form.disable({ emitEvent: false });
					});
				});
		}
	}

	getSubmissionByNosologicoAndTemplateTypeUuid$(): Observable<FormTO> {
		return this.templateControllerService.getTemplateTypeUsingGET()
			.pipe(
				mergeMap(templateTypeList => {
					const type = templateTypeList.find(t => t.templateType === this.templateType);
					if (type && this.nosologico) {
						return this.submissionControllerService
							.getSubmissionByNosologicoAndTemplateTypeUuidUsingGET(this.nosologico, type.uuidTemplateType)
							.pipe(
								mergeMap((submissionResponse: SubmissionResponse) => {
									if (submissionResponse && Object.keys(submissionResponse).length) {
										return of(
											{
												id: submissionResponse.uuidTemplate,
												ward: submissionResponse.nosologico,
												type: {
													components: type.requiredComponents,
													name: type.templateType,
													uuid: type.uuidTemplateType,
												},
												defaultType: {
													components: type.requiredComponents,
													name: type.templateType,
													uuid: type.uuidTemplateType,
												},
												name: submissionResponse.name,
												fields: JSON.parse(submissionResponse.schemaData),
											}
										);
									} else {
										return this.departmentControllerService.getAllUsingGET()
											.pipe(
												mergeMap((departmentList: Department[]) => {
													const department = departmentList && departmentList[0];

													return this.templateControllerService
														.findTemplateByStructureAndTemplateTypeUsingGET(department.uuid, type.uuidTemplateType)
														.pipe(
															map(template => ({
																id: template.uuid,
																name: template.name,
																ward: template.department.uuid,
																type: template.templateType,
																defaultType: template.templateType,
																fields: JSON.parse(template.schema)
															}))
														);
												}),
											);
									}
								}),
							);
					}

					return of(undefined);
				})
			);
	}

	submit(formTO: FormTO) {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsTouched();
			this.form.controls[key].updateValueAndValidity();
		});
		this.form.updateValueAndValidity();
		if (this.form.valid && formTO) {
			formTO.fields.forEach(field => {
				const control = this.form.controls[field.id];
				const value = control && control.value;
				switch (field.type) {
					case FieldType.ACTIVESUBSTANCEALLERGIES:
						field.activesubstanceallergies.values = value !== undefined
							? Array.isArray(value)
								? value : [value]
							: [];
						break;
					case FieldType.CHECKBOX:
						field.checkbox.value = value;
						break;
					case FieldType.COMBOBOX:
						field.comboBox.values = value;
						break;
					case FieldType.COMMERCIALDRUGALLERGIES:
						field.commercialdrugallergies.values = value !== undefined
							? Array.isArray(value)
								? value : [value]
							: [];
						break;
					case FieldType.DATEPICKER:
						field.datepicker.value = value;
						break;
					case FieldType.DIAGNOSIS:
						field.diagnosis.values = value !== undefined
							? Array.isArray(value)
								? value : [value]
							: [];
						break;
					case FieldType.HEIGHT:
						field.height.value = value;
						break;
					case FieldType.NUMERIC:
						field.numeric.value = value;
						break;
					case FieldType.RADIO:
						field.radio.values = value;
						break;
					case FieldType.SELECTBOX:
						field.selectBox.values = value;
						break;
					case FieldType.SWITCHBUTTON:
						field.switchButton.value = value;
						break;
					case FieldType.TEXT:
						field.text.value = value;
						break;
					case FieldType.TEXTAREA:
						field.textarea.value = value;
						break;
					case FieldType.WEIGHT:
						field.weight.value = value;
						break;
					default:
				}
			});
			const mandatoryFieldList = this.getMandatoryFieldList(formTO);
			const submissionDataRequest: SubmissionDataRequest = {
				name: formTO.name,
				nosologico: this.nosologico,
				schemaData: JSON.stringify(formTO.fields),
				submissionComponents: formTO.fields
					.map(field => mandatoryFieldList.filter(f => f.id === field.id).map(f => f.field))
					.reduce((acc, curr) => acc.concat(curr)),
				user: this.authService.getClaims().sub,
				// user: this.authService.getSub(),
				uuidTemplate: formTO.id,
				uuidPatient: this.patientUuid
			};
			this.submissionControllerService.compileSubmissionUsingPOST(submissionDataRequest)
				.subscribe(() => {
					this.snackBarService.info(this.translateService.instant('older.FORM_CONFIGURATION.SUBMISSION_SUCCESS'));
					// .open(this.translateService.instant('older.FORM_CONFIGURATION.SUBMISSION_SUCCESS'), '', { duration: 1000 });
				});
		}
	}

	getMandatoryFieldList(formTO: FormTO) {
		const mandatoryFields: { id: string, field: SubmissionComponentDataRequest }[] = [];
		const components = formTO.defaultType.components || [];
		const componentIdList = components.map(component => component.uuid);
		formTO.fields.forEach(f => {
			const control = this.form.controls[f.id];
			const value = control && control.value;
			Object.keys(f).forEach(k => {
				if (f[k].hasOwnProperty('uuid') && componentIdList.includes(f[k].uuid)) {
					const submissionKeyValueDataRequest: SubmissionKeyValueDataRequest[] = [];
					if (value) {
						if (Array.isArray(value)) {
							value.forEach(v => {
								submissionKeyValueDataRequest.push({
									key: v.id,
									value: v.value
								});
							});
						} else if (typeof value === 'string' || typeof value === 'number') {
							submissionKeyValueDataRequest.push({
								key: null,
								value: value.toString()
							});
						} else {
							submissionKeyValueDataRequest.push({
								key: value.id,
								value: value.value
							});
						}
					}
					mandatoryFields.push({
						id: f.id,
						field: {
							uuidComponent: f[k].uuid,
							values: submissionKeyValueDataRequest
						}
					});
				}
			});
		});

		return mandatoryFields;
	}

	getErrorMessage(formTO: FormTO) {
		return Object.keys(this.form.controls)
			.filter(key => !this.form.controls[key].valid && this.form.controls[key].touched)
			.map(key => (formTO.fields.find(f => f.id === key) || { label: { label: '' } }).label.label)
			.join(', ');
	}
}
