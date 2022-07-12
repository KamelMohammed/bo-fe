import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../../infrastructure/fidcare/services/profile.service';
import { map } from 'rxjs/operators';
import { SelectListitem } from './../../../../../../../infrastructure/fidcare/models/common.models';
import { DefineEvaluationCommand, PAIDetails } from './../../../../../services/model/pai.model';
import { EvaluationType } from 'app/icp-module/services/model/pai.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { forkJoin } from 'rxjs';
import { UserService } from 'app/icp-module/services/api/user.service';
import moment from 'moment';
import { Doctor } from 'app/icp-module/services/model/user';

@Component({
	selector: 'app-edit-evaluation-page',
	templateUrl: './edit-evaluation-page.component.html',
	styleUrls: ['./edit-evaluation-page.component.css']
})
export class EditEvaluationPageComponent implements OnInit {

	public evaluationType: EvaluationType;
	private paiId: string;
	private evaluationId: string;
	public doctorListItems: SelectListitem[] = [];
	private _uviMembers: Doctor[]=[];

	public createEvaluationForm: FormGroup;
	public config: any;
	public defining: boolean = true;
	public writing: boolean = false;
	public history: boolean = false;
	private _pai: PAIDetails;


	constructor(
		private _formBuilder: FormBuilder,
		private _paiService: PAIService,
		private _userService: UserService,
		private _dialogRef: MatDialogRef<EditEvaluationPageComponent>,
		private _profileService: ProfileService
	) {

	}

	dateGTNowFilter = (d: Date | null): boolean => {
		let endDate = moment(this._pai.endDate);
		let startDate = moment(this._pai.startDate);
		if (d && this.evaluationType==EvaluationType.midtermevaluation) {
			return moment(d).isBetween(startDate,endDate, "days");
		}
		return true;
	};


	save = () => {
		if (this.createEvaluationForm.isValid()) {
			let command: DefineEvaluationCommand = this.createEvaluationForm.getRawValue();
			let uviMember =this._uviMembers.filter(uvi=> uvi.doctorId==this.createEvaluationForm.get("uviMemberId").value)[0];
			command.uviMemberName=uviMember.doctorName;
			command.uviMemberSurname=uviMember.doctorSurname;
			command.uviMemberEmail=uviMember.doctorEmail;
			command.uviMemberFiscalCode=uviMember.doctorCode;
			this._paiService.defineEvaluation(command, this.paiId, this.evaluationType, this.evaluationId).subscribe({
				next: () => this._dialogRef.close(true)
			});
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}

	get readOnlyEvaluationDate() {
		return this.writing || this.history || this.evaluationType==EvaluationType.finalevaluation;
	}
	get readOnlyEvaluation() {
		return this.defining || this.history || !this.writing;
	}
	get readOnlyUviMember() {
		return this.history || this.writing;
	}
	ngOnInit() {
		this.paiId = this.config.data.paiId;
		this.evaluationType = this.config.data.evaluationType;
		this.evaluationId = this.config.data.evaluationId;
		this.writing = this.config.data.writing;
		this.history = this.config.data.history;


		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isCSanitario || user.userId == this._pai.caseManagerId) {
				let form = this._formBuilder.group({
					id: [null],
					uviMemberId: [null, Validators.required],
					uviMemberName:[null],
					uviMemberSurname:[null],
					uviMemberEmail:[null],
					date: [null, Validators.required],
					evaluation: [null]
				});


				let serviceToInvoke: any = {
					doctors: this._userService.getDoctors({ ascending: true, page: 0, size: 10, keySelector: "" }),
					pai: this._paiService.details(this.paiId)
				};

				if (this.evaluationId) {
					serviceToInvoke.entity = this._paiService.getEvaluation(this.paiId, this.evaluationId, this.evaluationType);
				} else {
					this.defining = true;
					this.writing = false;
				}

				forkJoin(serviceToInvoke).subscribe((result: any) => {
					this.doctorListItems = result.doctors.content.map((m) => new SelectListitem(m.doctorId, (m.doctorName + " " + m.doctorSurname)));
					this._pai = result.pai;
					this._uviMembers=result.doctors.content;


					if(this.evaluationType==EvaluationType.finalevaluation){
						form.get("date").patchValue(this._pai.endDate);
					}

					if (result.entity) {
						this.defining = false;
						this.writing = true;
						form.patchValue(result.entity);
						if(result.entity.uviMemberId==user.userId && this._pai.endDate==new Date()){
							this.writing=true;
						}else{
							this.writing=false;
						}

					}
					this.createEvaluationForm = form;
				});
			}
		});
	}



	public get formValid() {
		if (this.createEvaluationForm) return this.createEvaluationForm.valid;
		return false;
	}


	public get title(): string {
		if (this.writing) {
			return 'icp.pai.listEvaluation.editPageTitle';
		}
		return 'icp.pai.listEvaluation.createPageTitle';
	}
}