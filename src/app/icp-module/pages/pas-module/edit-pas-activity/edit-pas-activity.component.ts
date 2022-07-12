import { ServiceListItem } from 'app/icp-module/services/model/service.model';
import { DialogService } from './../../../../../infrastructure/fidcare/services/dialog.service';
import { ServiceActivityListItem } from './../../../services/model/pai-pas-common';
import { PAI_PAS } from './../../../services/api/pai-pas-common.service';
import { Profile } from './../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../infrastructure/fidcare/services/profile.service';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { SaveServiceActivityCommand } from '../../../services/model/pai-pas-common';
import { PAIPASCommonService } from '../../../services/api/pai-pas-common.service';
import { ActivityListItem } from '../../../services/model/activity.model';
import { Professional, ProfessionalListItem } from './../../../services/model/care-level.model';
import { CareLevelService } from './../../../services/api/care-level.service';
import { ActivityService } from './../../../services/api/activity.service';
import { ServiceService } from './../../../services/api/service.service';
import { PAS } from '../../../services/model/pas.model';
import { PASService } from '../../../services/api/pas.service';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { NumberValidators } from 'infrastructure/fidcare/components/forms/validators/number.validator';
import { firstValueFrom, forkJoin, map, Observable, of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { PAI } from 'app/icp-module/services/model/pai.model';

@Component({
	selector: 'app-edit-pas-activity',
	templateUrl: './edit-pas-activity.component.html',
	styleUrls: ['./edit-pas-activity.component.scss'],
})
export class EditPasActivityComponent implements OnInit {

	public professionalItems: SelectListitem[] = [];
	public frequencyItems = ["Giornaliera", "Settimanale", "Mensile"].map(m => new SelectListitem(m, m));
	public _activityItems: SelectListitem[] = [];
	public _serviceItems: SelectListitem[] = [];
	private _professionals: ProfessionalListItem[] = [];
	private _activities: ActivityListItem[] = [];
	private _services: ServiceListItem[] = [];
	private _currentItem: PAI | PAS;


	private pai_pas: PAI_PAS;
	private activityId: string;
	private itemId: string;

	public createPasActivityForm: FormGroup;
	private maxDuration;

	public config: any;
	public readonly: boolean = false;
	public history: boolean;
	private _servicesActivities: ServiceActivityListItem[];
	private _currentProfessional: Professional;
	public professionalSelected: boolean = false;

	constructor(
		private _professionalsService: CareLevelService,
		private _formBuilder: FormBuilder,
		private _pasService: PASService,
		private _paiService: PAIService,
		private _PAS_PAI_CommonService: PAIPASCommonService,
		private _serviceService: ServiceService,
		private _activyService: ActivityService,
		private _dialogRef: MatDialogRef<EditPasActivityComponent>,
		private _profileService: ProfileService,
		private _dialogService: DialogService
	) {
		this.initForm();

	}

	maxAccessGTMinAccess = (): ValidatorFn => {
		return (control: AbstractControl) => {
			if (control.value != null && control.value < this.createPasActivityForm.value.minAccessNumber) {
				return {
					"icp.pas.validation.maxGtMin": [control.value]
				}
			}
			return null;
		};
	}

	maxDurationValidation = (): ValidatorFn => {
		return (control: AbstractControl) => {
			if (this.maxDuration > 0 && control.value != null && control.value > this.maxDuration) {
				return {
					"icp.pas.validation.maxDuration": [this.maxDuration]
				}
			}
			return null;
		};
	}
	activityOrServiceValidation = (): ValidatorFn => {
		return (control: AbstractControl) => {
			if (this.createPasActivityForm) {
				if (
					this.createPasActivityForm.value.activitiesId.length == 0 && this.createPasActivityForm.value.servicesId.length == 0
				)
					return {
						"icp.pas.validation.activityOrServiceSelected": []
					}
			}
			return null;
		};
	}

	maxAccessNumberValidation = () => {
		return (control: AbstractControl) => {
			if (this.createPasActivityForm && this._currentItem && this._currentProfessional && this._servicesActivities) {
				let accesses = this._servicesActivities.map((serviceActivity: ServiceActivityListItem) => serviceActivity.maxAccessNumber);
				let professionalMaxAccess = this._currentProfessional.maxAccessNumber;
				let sum = 0;
				accesses.forEach((access: number) => sum += access);
				if ((sum + control.value) > professionalMaxAccess) {
					return { "icp.pai_pas.validation.maxAccess": [control.value] };
				} else {
					return null;
				}
			}
		};
	}


	private initForm = () => {
		this.createPasActivityForm = this._formBuilder.group({
			id: [null],
			professionalId: [null, Validators.required],
			frequency: [null, Validators.required],
			minAccessNumber: [null, [Validators.required, NumberValidators.minimum(1)]],
			maxAccessNumber: [null, [Validators.required, NumberValidators.minimum(1), this.maxAccessGTMinAccess(), this.maxAccessNumberValidation()]],
			duration: [null, [Validators.required, NumberValidators.exclusiveMinimum(0), this.maxDurationValidation()]],
			therapy: [null],
			activitiesId: [[]],
			servicesId: [[]],
		});
		this.createPasActivityForm.get("minAccessNumber").valueChanges.subscribe(
			(success) => {
				this.createPasActivityForm.updateValueAndValidity();
				this.createPasActivityForm.get("maxAccessNumber").patchValue(this.createPasActivityForm.get("maxAccessNumber").value)
			}
		);
		this.createPasActivityForm.get("professionalId").valueChanges.subscribe({
			next: (id: string) => {
				let professional: ProfessionalListItem = this._professionals.filter((professional: ProfessionalListItem) => { return professional.id == id })[0];
				if (professional) {
					this.createPasActivityForm.get("frequency").setValue(professional.frequency);
					this.maxDuration = professional.duration;
					this._professionalsService.professionalDetails(this._currentItem.careLevelId, this.createPasActivityForm.value.professionalId, true).subscribe((result) => {
						this._currentProfessional = result;
						this._activityItems = this._activities.filter((activity: ActivityListItem) => activity.professionalsId.indexOf(result.professionalId) != -1).map((m) => new SelectListitem(m.id, m.activity));
						this._serviceItems = this._services.filter((service: ServiceListItem) => service.professionalsId.indexOf(result.professionalId) != -1).map((m) => new SelectListitem(m.id, m.service));

					});
					this.professionalSelected = true;
				} else {
					this.professionalSelected = false;
				}



			}
		});


		this.createPasActivityForm.get("activitiesId").valueChanges.subscribe({
			next: (id: string) => {
				this.calculateDuration();
			}
		});
		this.createPasActivityForm.get("servicesId").valueChanges.subscribe({
			next: (id: string) => {
				this.calculateDuration();
			}
		});




	}

	public get formValid() {
		return this.createPasActivityForm && this.createPasActivityForm.valid && (
			this.createPasActivityForm.value.activitiesId.length > 0 || this.createPasActivityForm.value.servicesId.length > 0
		)
	}



	save = () => {
		if (this.createPasActivityForm.isValid()) {
			if (this.activityId) {
				let command: SaveServiceActivityCommand = this.createPasActivityForm.getRawValue();
				this._PAS_PAI_CommonService.saveServiceActivity(command, this.itemId, this.pai_pas, this.activityId).subscribe({
					next: () => {
						this._dialogService.showMessage("icp.updateOperationResult", "icp.pai_pas.activityUpdated");
						this._dialogRef.close(true);
					}
				});
			} else {
				let command: SaveServiceActivityCommand = this.createPasActivityForm.getRawValue();
				this._PAS_PAI_CommonService.saveServiceActivity(command, this.itemId, this.pai_pas).subscribe({
					next: () => {
						this._dialogService.showMessage("icp.saveOperationResult", "icp.pai_pas.activitySaved");
						this._dialogRef.close(true);
					}
				});
			}
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isCSanitario) {
				this.itemId = this.config.data.itemId;
				this.activityId = this.config.data.activityId;
				this.pai_pas = this.config.data.pai_pas;
				this.readonly = this.config.data.readonly;
				this.history = this.config.data.history;



				let servicesToInvoke;
				switch (this.pai_pas) {
					case PAI_PAS.PAI:
						servicesToInvoke = {
							collectionLabel: this._paiService.details(this.itemId),
							servicesLabels: this._serviceService.listGlobal(),
							activityLabels: this._activyService.listGlobal(),
							servicesActivitiesLabels: this._PAS_PAI_CommonService.listServiceActivity(this.itemId, this.pai_pas)

						};
						break;
					case PAI_PAS.PAS:
						servicesToInvoke = {
							collectionLabel: this._pasService.details(this.itemId),
							servicesLabels: this._serviceService.listGlobal(),
							activityLabels: this._activyService.listGlobal(),
							servicesActivitiesLabels: this._PAS_PAI_CommonService.listServiceActivity(this.itemId, this.pai_pas)

						};
						break;
				}



				if (this.activityId != undefined && this.activityId != null) {
					servicesToInvoke.entity = this._PAS_PAI_CommonService.serviceActivityDetails(this.itemId, this.activityId, this.pai_pas);
				}

				forkJoin(servicesToInvoke).subscribe((result: any) => {
					this._currentItem = result.collectionLabel;
					this._serviceItems = result.servicesLabels.map(m => new SelectListitem(m.id, m.service));
					this._activityItems = result.activityLabels.map(m => new SelectListitem(m.id, m.activity));
					this._activities = result.activityLabels;
					this._services = result.servicesLabels;
					this._servicesActivities = result.servicesActivitiesLabels;


					let servicesToInvoke: any = {
						careLevelProfessionalsLabel: this._professionalsService.listProfessionals(this._currentItem.careLevelId, true),
					};


					forkJoin(servicesToInvoke).subscribe((result2: any) => {
						this.professionalItems = result2.careLevelProfessionalsLabel.map(m => new SelectListitem(m.id, m.professionalName));
						this._professionals = result2.careLevelProfessionalsLabel;
						if (result.entity) {
							this.createPasActivityForm.patchValue(result.entity);
						}
					});
				})
			}
		});
	}

	durationReadOnly = false;
	private calculateDuration = () => {
		if (!this.activityId) {
			let duration =0;
			let pasActivitiesExting: boolean = this.createPasActivityForm.get("activitiesId").value && this.createPasActivityForm.get("activitiesId").value.length > 0;

			(this.createPasActivityForm.get("activitiesId").value || []).forEach(element => {
				let index = this._activities.findIndex((a) => { return a.id == element });
				if (index >= 0) {
					if (this._activities[index].duration > 0){
						duration += this._activities[index].duration;
						console.log("attivita aggiunta. ",duration);
					}
				}
			});


			(this.createPasActivityForm.get("servicesId").value || []).forEach(element => {
				let index = this._services.findIndex((a) => { return a.id == element });
				if (index >= 0) {
					if (this._professionals[index].duration > 0){
						duration += this._professionals[index].duration;
						console.log("services aggiunto ",duration);
					}
				}
			});

			if (pasActivitiesExting) {
				this.durationReadOnly = true;

			}
			else {
				this.durationReadOnly = false;

				if (duration <= 0) {
					duration = this.maxDuration;
				}

			}


			this.createPasActivityForm.get("duration").patchValue(duration);
			this.createPasActivityForm.get("duration").markAsTouched();
		}


	}
	public get title(): string {
		if (this.readonly) {
			return 'icp.pas.listPasActivity.modalViewPasActivityTitle';

		}
		if (this.config) {
			if (this.config.data && this.config.data.pasActivityId) return 'icp.pas.listPasActivity.modalEditPasActivityTitle'
			return 'icp.pas.listPasActivity.modalCreatePasActivityTitle';
		}
		return "";
	}


}