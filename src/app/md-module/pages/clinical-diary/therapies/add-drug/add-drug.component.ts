import { I } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditDrugModalData } from 'app/md-module/models/md.model';
import { DrugRequest, PTComponentDto, TherapyService } from 'app/services/api/atm';
import { ComponentDto } from 'app/services/api/atm/model/componentDto';
import { DrugDto, DrugsService } from 'app/services/api/ddr';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';
import { EnumUtils } from 'infrastructure/fidcare/utils/enum.utils';
import { debounceTime, forkJoin, map, mergeMap, Observable, of } from 'rxjs';


@Component({
	selector: 'app-add-drug',
	templateUrl: './add-drug.component.html',
	styleUrls: ['./add-drug.component.scss']
})
export class AddDrugComponent extends BaseComponent implements OnInit {
	public isNew: boolean = false;
	public initialItem: SelectListitem[] = [];
	public step: number = 0;
	public form: FormGroup;
	public selectedDrug: DrugDto = null;
	public posologyItems: SelectListitem[] = [];
	public posologyWeekDaysItems: SelectListitem[] = [];
	public posologyMonthDaysItems: SelectListitem[] = [];
	public timingItems: SelectListitem[] = [];
	public timingHoursItems: SelectListitem[] = [];
	public commercials: DrugDto[];
	public abstracts: DrugDto[];
	public commercial: any;
	public abstract: any;
	constructor(private readonly _therapyService: TherapyService, private readonly _dialogService: DialogService, private _translateService: TranslateService, private _snackBarService: SnackBarService, private _fb: FormBuilder, private readonly _profileService: ProfileService, private readonly _drugsService: DrugsService, public readonly _dialog: MatDialogRef<AddDrugComponent>, @Inject(MAT_DIALOG_DATA) public data: EditDrugModalData) {
		super()
	}

	ngOnInit(): void {
		this.posologyItems = EnumUtils.toSelectListitems(PTComponentDto.PosologyEnum, "PosologyItems", this._translateService)
		this.posologyMonthDaysItems = [].range(1, 31).map(m => new SelectListitem(m, m.toString()))
		this.posologyWeekDaysItems = DatetimeUtils.dayNamesSelectListitems(this._translateService);
		this.timingItems = EnumUtils.toSelectListitems(PTComponentDto.TimingEnum, "TimingItems", this._translateService)
		this.timingHoursItems = [].range(0, 23).map(m => new SelectListitem(m, m.toString()))

		if (this.data.component != null) {
			this.step = 1;
			forkJoin([this._drugsService.list2(this.data.component.drug.name), this._drugsService.list3(this.data.component.drug.name)]).subscribe(results => {
				results[0].push(...results[1]);
				this.selectedDrug = results[0].first();
				this.createForm();
			})
		}
		else {
			this.isNew = true;
			this.createForm();
		}
	}

	private createForm = (): void => {
		const data = this.data.component || <PTComponentDto>{};
		this.form = this._fb.group({
			drugCode: [data.drug ? data.drug.code : null, CommonValidators.required],
			reason: [{ value: data.reason, disabled: true }, CommonValidators.required],
			administrationRoute: [data.administrationRoute, CommonValidators.required],
			note: [data.note],
			notReplaceable: [!!data.replaceable],
			posology: [data.posology, CommonValidators.required],
			posologyTimes: [this.getPosologyTimes(data)],
			posologyWeekday: [this.getPosologyDays(data, true), CommonValidators.required],
			posologyMonthDay: [this.getPosologyDays(data, false), CommonValidators.required],
			posologyWeekdays: [this.getPosologyDays(data, true), CommonValidators.required],
			posologyMonthDays: [this.getPosologyDays(data, false), CommonValidators.required],
			quantity: [data.quantity, CommonValidators.required],
			timing: [data.timing, CommonValidators.required],
			timingTimes: [this.getTimingTimes(data), CommonValidators.required],
			timingHour: [this.getTimingHours(data), CommonValidators.required],
			timingHours: [this.getTimingHours(data), CommonValidators.required],
		});
		if (this.isNew) {
			this.on(this.form.controls.drugCode.valueChanges.subscribe(newValue => {
				this.drugChanged();
			}))
		}

		this.on(this.form.controls.posology.valueChanges.subscribe((newValue: PTComponentDto.PosologyEnum) => {
			this.onPosologyChanged(newValue);
		}));
		this.onPosologyChanged(this.form.controls.posology.value);

		this.on(this.form.controls.timing.valueChanges.subscribe((newValue: PTComponentDto.TimingEnum) => {
			this.onTimingChanged(newValue);
		}));
		this.onTimingChanged(this.form.controls.timing.value);
	}

	private drugChanged = (): void => {

		if (this.selectedDrug) {
			const abstractDrug = this.abstracts.find(f => f.code == this.selectedDrug.code)
			if (abstractDrug) {
				this.form.controls.reason.disable();
				this.form.controls.reason.setValue(null);
			}
			else {
				this.form.controls.reason.enable();
			}
			this.form.controls.reason.updateValueAndValidity();
		}
	}

	private onPosologyChanged = (value: PTComponentDto.PosologyEnum): void => {
		let disableTimes: boolean = false;
		this.form.controls.posologyWeekday.disable();
		this.form.controls.posologyMonthDay.disable();
		this.form.controls.posologyWeekdays.disable();
		this.form.controls.posologyMonthDays.disable();
		switch (value) {
			case 'DAILY':
				disableTimes = true;
				break;
			case 'DAYS_OF_MONTH':
				this.form.controls.posologyMonthDay.enable();
				break;
			case 'DAYS_OF_WEEK':
				this.form.controls.posologyWeekday.enable();
				break;
			case 'EXACT_DAYS_OF_MONTH':
				this.form.controls.posologyMonthDays.enable();
				disableTimes = true;
				break;
			case 'EXACT_DAYS_OF_WEEK':
				this.form.controls.posologyWeekdays.enable();
				disableTimes = true;
				break;
			default:
				break;

		}
		if (disableTimes) {
			this.form.controls.posologyTimes.disable();
			this.form.controls.posologyTimes.setValue(null
			);
		}
		else {
			this.form.controls.posologyTimes.enable();
		}
		if (this.form.controls.posologyWeekday.disabled) {
			this.form.controls.posologyWeekday.setValue(null);
		}
		if (this.form.controls.posologyMonthDay.disabled) {
			this.form.controls.posologyMonthDay.setValue(null);
		}
		if (this.form.controls.posologyWeekdays.disabled) {
			this.form.controls.posologyWeekdays.setValue([]);
		}
		if (this.form.controls.posologyMonthDays.disabled) {
			this.form.controls.posologyMonthDays.setValue([]);
		}
	}



	private onTimingChanged = (value: PTComponentDto.TimingEnum): void => {
		if (value == 'SPECIFIC_HOUR') {
			this.form.controls.timingTimes.disable();
			this.form.controls.timingTimes.setValue(null);
			this.form.controls.timingHour.disable();
			this.form.controls.timingHour.setValue(null);
			this.form.controls.timingHours.enable();
		}
		else {
			this.form.controls.timingTimes.enable();
			this.form.controls.timingHour.enable();
			this.form.controls.timingHours.disable();
			this.form.controls.timingHours.setValue([]);
		}
	}

	private getTimingTimes = (component: PTComponentDto): number => {
		switch (component.timing) {
			case 'EVERY_HOURS':
				return component.timingParam.first();
			default:
				return null;
		}
	}

	private getTimingHours = (component: PTComponentDto): any => {
		switch (component.timing) {
			case 'EVERY_HOURS':
				return component.timingParam.length > 1 ? component.timingParam.skip(1).first() : null;
			case 'SPECIFIC_HOUR':
				return component.timingParam || [];
			default:
				return [];

		}
	}

	private getPosologyTimes = (component: PTComponentDto): number => {
		switch (component.posology) {
			case 'DAYS_OF_MONTH':
			case 'DAYS_OF_WEEK':
				return component.posologyParam[0];
			default:
				return null;

		}
	}

	private getPosologyDays = (component: PTComponentDto, weekdays: boolean): any => {
		switch (component.posology) {
			case 'DAYS_OF_MONTH':
				return weekdays ? null : component.posologyParam.skip(1).first();
			case 'DAYS_OF_WEEK':
				return weekdays ? component.posologyParam.skip(1).first() : null;
			case 'EXACT_DAYS_OF_MONTH':
				return weekdays ? [] : [...component.posologyParam];
			case 'EXACT_DAYS_OF_WEEK':
				return weekdays ? [...component.posologyParam] : [];
			default:
				return null;

		}
	}

	public loadAbstracts = (value: string): void => {
		this.commercials = [];
		this.abstracts = [];
		this.form.controls.drugCode.setValue(null);
		this.selectedDrug = null;
		if ((value || "").length >= 3) {
			of([]).pipe(
				debounceTime(300),
				mergeMap(() => this._drugsService.list2(value))
			).subscribe(result => {
				this.abstracts = [...result.sortAsc(s => s.description)];
			})
		}
	}
	public loadCommercials = (value: string): void => {
		this.abstract = null;
		this.commercials = [];
		this.abstracts = [];
		this.form.controls.drugCode.setValue(null);
		this.selectedDrug = null;
		if ((value || "").length >= 3) {
			of([]).pipe(
				debounceTime(300),
				mergeMap(() => this._drugsService.list3(value))
			).subscribe(result => {
				this.commercials = [...result.sortAsc(s => s.description)];
			})
		}
	}

	public onSelectedDrug = (drug: DrugDto, abstract: boolean): void => {
		let obs: Observable<DrugDto[]> = null;
		if (abstract) {
			obs = this._drugsService.list4(drug.code);
		}
		else {
			obs = this._drugsService.list1(drug.code);
		}
		obs.subscribe(result => {
			if (abstract) {
				this.commercials = [...result.sortAsc(s => s.description)];
			}
			else {
				this.abstracts = [...result.sortAsc(s => s.description)];
			}
			this.selectedDrug = drug;
			this.form.controls.drugCode.setValue(drug.code);
		});
	}

	public close = (): void => {
		this._dialog.close(false);
	}

	public next = (): void => {
		if (this.form.controls.drugCode.valid && (this.form.controls.reason.disabled || this.form.controls.reason.valid)) {
			this.step++;
			//this.selectedDrug = this.availableDrugs.find(f => f.id == this.form.controls.drugCode.value).drug;
		}
	}

	public save = (): void => {
		if (this.form.isValid()) {
			const data = <DrugRequest>{};
			const formValue = this.form.getRawValue();
			data.administrationRoute = formValue.administrationRoute;
			data.constrainCommercial = false;
			data.drug = {
				code: this.selectedDrug.code,
				name: this.selectedDrug.description
			};
			data.note = formValue.note;
			data.replaceable = !formValue.notReplaceable;
			data.quantity = formValue.quantity;
			data.posology = formValue.posology;
			data.posologyParam = [];
			switch (data.posology) {
				case 'DAILY':
					break;
				case 'DAYS_OF_MONTH':
					data.posologyParam = [formValue.posologyTimes];
					data.posologyParam = [formValue.posologyMonthDay];
					break;
				case 'DAYS_OF_WEEK':
					data.posologyParam = [formValue.posologyTimes];
					data.posologyParam = [formValue.posologyWeekday];
					break;
				case 'EXACT_DAYS_OF_MONTH':
					data.posologyParam = [...formValue.posologyMonthDays];
					break;
				case 'EXACT_DAYS_OF_WEEK':
					data.posologyParam = [...formValue.posologyWeekdays];
					break;
			}
			data.timing = formValue.timing;
			data.timingParam = [];
			if (formValue.timingTimes) {
				data.timingParam = [formValue.timingTimes];
			}
			if (formValue.timing == PTComponentDto.TimingEnum.EVERYHOURS) {
				data.timingParam.push(formValue.timingHour);
			}
			else {
				data.timingParam.push(...formValue.timingHours);
			}
			data.reason = formValue.reason;
			data.forceAllergiesComponent = true
			this._therapyService.addComponent(data, this.data.therapy.uuid).subscribe({
				complete: () => {
					this._dialog.close(true);
				},
				error: (data) => {

					if (data.error.code === 'AllergyPrincipleActiveException' || data.error.code === 'AllergyCommercialDrugException') {
						this.showAllergyRequest(data);
					}
				}
			});
		}
	}

	private showAllergyRequest = (drugRequest: DrugRequest): void => {
		this._dialogService.showConfirm("md.allergyTitle", "md.allergyMessage", {
			callback: (result) => {
				if (result) {
					drugRequest.forceAllergiesComponent = result;
					this._therapyService.addComponent(drugRequest, this.data.therapy.uuid).subscribe({
						complete: () => {
							this._dialog.close(true);
						}
					});
				}
			}
		})
	}
}

class DrugItem extends SelectListitem {
	constructor(public drug: DrugDto, public abstract: boolean) {
		super(drug.code, `${drug.description}`)
	}
}
