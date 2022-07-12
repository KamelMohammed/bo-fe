import { forkJoin } from 'rxjs';
import { ScheduleCommand } from './../../../services/model/pai-service-activiy-scheduling.model';
import { ServiceActiviySchedulingService } from './../../../services/api/service-activiy-scheduling.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'app/icp-module/services/api/user.service';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import moment from 'moment';
import { Doctor } from 'app/icp-module/services/model/user';

@Component({
	selector: 'app-schedule-service-activity-page',
	templateUrl: './schedule-service-activity-page.component.html',
	styleUrls: ['./schedule-service-activity-page.component.scss']
})
export class ScheduleServiceActivityPageComponent implements OnInit {

	public operatorItems: SelectListitem[] = [];
	private activityId: string;
	private paiId: string;
	public scheduleServiceActivityForm: FormGroup;
	public config: any;
	public readonly: boolean = false;
	private _doctors: Doctor[]=[];
	public minAccessNumber: number;
	public maxAccessNumber:number;

	constructor(
		private _usersService: UserService,
		private _formBuilder: FormBuilder,
		private _scheduleService: ServiceActiviySchedulingService,
		private _dialogRef: MatDialogRef<ScheduleServiceActivityPageComponent>
	) {

	}

	dateGTNowFilter = (d: Date | null): boolean => {
		if (d) {
			return moment().subtract(1, 'days').isBefore(d)
		}
		return true;
	};





	public get formValid() {
		return this.scheduleServiceActivityForm && this.scheduleServiceActivityForm.valid;
	}



	save = () => {
		if (this.scheduleServiceActivityForm.isValid()) {
			let command: ScheduleCommand = this.scheduleServiceActivityForm.getRawValue();
			command.dates=command.dates.filter(date=> date!=null);
			let operator=this._doctors.filter(doctor=>doctor.doctorId==this.scheduleServiceActivityForm.get("operatorId").value)[0];
			command.operatorName=operator.doctorName;
			command.operatorSurname=operator.doctorSurname;
			command.operatorEmail=operator.doctorEmail;
			command.operatorFiscalCode=operator.doctorCode;
			this._scheduleService.save(this.paiId, this.activityId, command).subscribe({
				next: () => this._dialogRef.close(true)
			});
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		this.activityId = this.config.data.activityId;
		this.readonly = this.config.data.readonly;
		this.paiId = this.config.data.itemId;
		this.minAccessNumber=this.config.data.minAccess;
		this.maxAccessNumber=this.config.data.maxAccess;
		let arrayControllers : FormControl[]=[];
		for(let i=0; i<this.minAccessNumber; i++){
			arrayControllers.push(new FormControl(null,Validators.required));
		}
		//max access non vannos schedulati
		for(let i=0; i<(this.maxAccessNumber-this.minAccessNumber); i++){
			arrayControllers.push(new FormControl(null));
		}

		let form = this._formBuilder.group({
			operatorId: [null, Validators.required],
			dates: new FormArray(arrayControllers),
		});

		let serviceToInvoke = {
			users: this._usersService.getDoctors({ ascending: true, page: 0, size: 10, keySelector: "" }),
		}

		forkJoin(serviceToInvoke).subscribe((result) => {
			this.operatorItems = result.users.content.map((user) => new SelectListitem(user.doctorId, (user.doctorName + " " + user.doctorSurname)));
			this._doctors= result.users.content;
			this.scheduleServiceActivityForm = form;
		});



	}


	public get title(): string {
		return 'icp.pai.scheduleServiceActivity.createSession';
	}

	get dates(): FormArray {
		return this.scheduleServiceActivityForm.get('dates') as FormArray;
	  }
}