import { EventEmitter } from '@angular/core';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from '../../../../../../../infrastructure/fidcare/services/profile.service';
import { ActivityListItem } from 'app/icp-module/services/model/activity.model';
import { ServiceListItem } from 'app/icp-module/services/model/service.model';
import { ProfessionalListItem } from '../../../../../../icp-module/services/model/care-level.model';
import { CareLevelListItem } from 'app/icp-module/services/model/care-level.model';
import { CareLevelService } from 'app/icp-module/services/api/care-level.service';
import { ServiceService } from 'app/icp-module/services/api/service.service';
import { ActivityService } from 'app/icp-module/services/api/activity.service';
import { SelectListitem } from '../../../../../../../infrastructure/fidcare/models/common.models';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UnicDiaryService } from '../../../../../../icp-module/services/api/unic-diary.service';
import { DiaryServiceActivity, SaveDiaryServiceActivityCommand } from '../../../../../../icp-module/services/model/patient-diary.model';
import { Component, Input, OnInit, enableProdMode } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, map, Observable } from 'rxjs';

@Component({
	selector: 'app-edit-diary-service-activity',
	templateUrl: './edit-diary-service-activity.component.html',
	styleUrls: ['./edit-diary-service-activity.component.scss']
})
export class EditDiaryServiceActivityComponent implements OnInit {

	public config: any;
	private _operatorId: string;
	private _patientDiaryId: string;
	private _diaryServiceActivityId: string;
	private maxDuration :number;



	public activity: DiaryServiceActivity;
	public diaryServiceActivityForm: FormGroup;
	public readonly: boolean = false;

	public professionalsItems: SelectListitem[] = [];
	public activitiesItems: SelectListitem[] = [];
	public servicesItems: SelectListitem[] = [];
	public operatorsIdItems: SelectListitem[] = [];
	private _operator:Profile;

	private _services: ServiceListItem[] = [];
	private _activities: ActivityListItem[] = [];
	private _professionals: ProfessionalListItem[] = [];
	public isPatient:boolean;
	public canChooseServiceActivity:boolean =false;

	constructor(
		private _unicDiaryService: UnicDiaryService,
		private _dialogRef: MatDialogRef<EditDiaryServiceActivityComponent>,
		private _activityService: ActivityService,
		private _serviceService: ServiceService,
		private _careLevelService: CareLevelService,
		private _formBuilder: FormBuilder,
		private _profileService: ProfileService
	) {

	}


	back = () => {
		this._dialogRef.close(false);
	}

	save() {
		let command = new SaveDiaryServiceActivityCommand();
		Object.assign(command, this.diaryServiceActivityForm.value);
		command.operatorName=this._operator.firstName;
		command.operatorSurname=this._operator.lastName;
		command.operatorEmail= this._operator.email;
		command.operatorFiscalCode= "";
		this._unicDiaryService.addDiaryServiceActivity(this._patientDiaryId, command).subscribe(() => {
			this._dialogRef.close(true);
		});
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




	ngOnInit() {
		this._diaryServiceActivityId = this.config.data.diaryServiceActivityId;
		this._patientDiaryId = this.config.data.patientDiaryId;
		this._operatorId = this.config.data.operatorId;
		this.readonly = this.config.data.readonly;
		this.isPatient = this.config.data.isPatient;

		let form = this._formBuilder.group({
			id: [null],
			servicesId: [null],
			activitiesId: [null],
			professionalId: [null, Validators.required],
			operatorId: [null, Validators.required],
			expectedDuration: [null, [Validators.required, this.maxDurationValidation()]],
			effectiveDuration: [null, Validators.required],
			date: [null, Validators.required],
			notes: [null],
		});

		let servicesToInvoke: any = {
			activities: this._activityService.listGlobal(),
			services: this._serviceService.listGlobal(),
			careLevels: this._careLevelService.listGlobal(),
			operator: this._profileService.loadUserProfile(),
		};

		if (this._diaryServiceActivityId && this._diaryServiceActivityId != undefined) {
			servicesToInvoke.entity = this._unicDiaryService.getDiaryServiceActivity(this._patientDiaryId, this._diaryServiceActivityId);
		}

		forkJoin(servicesToInvoke).subscribe((result: any) => {
			this.activitiesItems = result.activities.map((m) => new SelectListitem(m.id, m.activity));
			this.servicesItems = result.services.map((m) => new SelectListitem(m.id, m.service));
			this._services = result.services;
			this._activities = result.activities;
			let carelevels: CareLevelListItem[] = result.careLevels;
			this._operator = result.operator;

			let observablesRequest: Observable<ProfessionalListItem[]>[] = [];
			carelevels.forEach((careLevel) =>
				observablesRequest.push(this._careLevelService.listProfessionals(careLevel.id, true))
			);

			forkJoin(observablesRequest).subscribe((professionals) => {
				for (let i = 0; i < carelevels.length; i++) {
					for (let j = 0; j < professionals[i].length; j++) {
						let buffer: ProfessionalListItem[] = professionals[i];
						for (let k = 0; k < buffer.length; k++) {
							this.professionalsItems.push(new SelectListitem(buffer[k].id, buffer[k].professionalName));
							this._professionals.push(buffer[k]);
						}
					}
				}

				this.operatorsIdItems.push(new SelectListitem(this._operator.userId, this._operator.firstName + " " + this._operator.lastName));
				form.get("operatorId").patchValue(this._operator.userId);

				form.get("professionalId").valueChanges.subscribe({
					next: (professionalId: string) => {
						if (professionalId) {
							let professionalName = this.professionalsItems
								.filter((item: SelectListitem) => item.id == professionalId)[0].label;
							this.servicesItems = this._services
								.filter((service: ServiceListItem) => service.professionalsName.contains(professionalName))
								.map((service) => new SelectListitem(service.id, service.service));
							this.activitiesItems = this._activities
								.filter((activity: ActivityListItem) => activity.professionalsName.contains(professionalName))
								.map((activity) => new SelectListitem(activity.id, activity.activity));
								this.canChooseServiceActivity=true;
							this.maxDuration=this._professionals.filter(p=>p.id==professionalId)[0].duration;
						} else {
							this.servicesItems = this._services.map((service) => new SelectListitem(service.id, service.service));
							this.activitiesItems = this._activities.map((activity) => new SelectListitem(activity.id, activity.activity));
							this.canChooseServiceActivity=false;
						}

					}
				});


				if (result.entity) {
					form.patchValue(result.entity);
				}


				this.diaryServiceActivityForm = form;

				this.diaryServiceActivityForm.get("professionalId").valueChanges.subscribe({
					next: (id: string) => {
						let professional: ProfessionalListItem = this._professionals.filter((professional: ProfessionalListItem) => { return professional.id == id })[0];
						if (professional) {
							this.maxDuration = professional.duration;
						}
					}
				});


				this.diaryServiceActivityForm.get("activitiesId").valueChanges.subscribe({
					next: (id: string) => {
						this.calculateDuration();
					}
				});
				this.diaryServiceActivityForm.get("servicesId").valueChanges.subscribe({
					next: (id: string) => {
						this.calculateDuration();
					}
				});

			});

		});
	}

	public get valid(): boolean {
		if (this.diaryServiceActivityForm && this.diaryServiceActivityForm.valid) {
			if (this.diaryServiceActivityForm.get("activitiesId").value || this.diaryServiceActivityForm.get("servicesId").value) {
				return true;
			}
		}
		return false;
	}



	public get title(): string {
		if (!this._diaryServiceActivityId) {
			return 'icp.unicDiary.diaryServiceActivity.createPageTitle';

		} else {

			return 'icp.unicDiary.diaryServiceActivity.editPageTitle';
		}

	}


	durationReadOnly = false;
	private calculateDuration = () => {
		let duration = 0;
		let activitiesExisting: boolean = this.diaryServiceActivityForm.get("activitiesId").value && this.diaryServiceActivityForm.get("activitiesId").value.length > 0;

		(this.diaryServiceActivityForm.get("activitiesId").value || []).forEach(element => {
			let index = this._activities.findIndex((a) => { return a.id == element });
			if (index >= 0) {
				if (this._activities[index].duration > 0)
					duration += this._activities[index].duration;
			}
		});

		(this.diaryServiceActivityForm.get("servicesId").value || []).forEach(element => {
			let index = this._professionals.findIndex((a) => { return a.id == element });
			if (index >= 0) {
				if (this._professionals[index].duration > 0)
					duration += this._professionals[index].duration;
			}
		});

		if (activitiesExisting) {
			this.durationReadOnly = true;

		}
		else {
			this.durationReadOnly = false;

			if (duration <= 0) {
				duration = this.maxDuration;
			}

		}


		this.diaryServiceActivityForm.get("expectedDuration").patchValue(duration);
		this.diaryServiceActivityForm.get("expectedDuration").markAsTouched();


	}
}
