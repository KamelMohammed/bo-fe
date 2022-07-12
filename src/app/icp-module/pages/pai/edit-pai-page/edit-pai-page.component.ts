import { PAI_PAS } from './../../../services/api/pai-pas-common.service';
import { PASListItem } from './../../../services/model/pas.model';
import { ProfileService } from './../../../../../infrastructure/fidcare/services/profile.service';
import { CreatePasOnTheFlyComponent } from './create-pas-on-the-fly/create-pas-on-the-fly.component';
import { Evaluation, PAIDetails, Patient } from './../../../services/model/pai.model';
import { PAIPASCommonService } from '../../../services/api/pai-pas-common.service';
import { SaveServiceActivityCommand, ServiceActivityDetail, ServiceActivityListItem } from '../../../services/model/pai-pas-common';
import { PAS } from '../../../services/model/pas.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ElectCaseManagerPageComponent } from './elect-case-manager-page/elect-case-manager-page.component';
import { PASService } from '../../../services/api/pas.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectListitem, SearchResult } from 'infrastructure/fidcare/models/common.models';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { CareLevelService } from 'app/icp-module/services/api/care-level.service';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { ActivatedRoute } from '@angular/router';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { SavePAICommand, EvaluationType } from 'app/icp-module/services/model/pai.model';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { Location } from '@angular/common';
import { CareLevelListItem } from 'app/icp-module/services/model/care-level.model';
import { UserService } from 'app/icp-module/services/api/user.service';
import moment, { Moment } from 'moment';

@Component({
	selector: 'app-edit-pai-page',
	templateUrl: './edit-pai-page.component.html',
	styleUrls: ['./edit-pai-page.component.scss']
})
export class EditPaiPageComponent implements OnInit {
	//form select items
	public careLevelItems: SelectListitem[] = [];
	public careProfileItems: SelectListitem[] = [];
	public pasItems: SelectListitem[] = [];
	public pathologieItems: SelectListitem[] = [];

	public createPaiForm: FormGroup;
	public pageTitle: string = '';
	public currentPai: PAIDetails;
	private currentServiceActivities: ServiceActivityDetail[] = [];

	public id: string;
	public pai_pas: PAI_PAS;
	public midtermEvaluationType: string;
	public finalEvaluationType: string;

	public patientFiscalCode: string;
	public caseManagerId: string;
	private _patient: Patient = new Patient();

	//flags
	public edit = false; //se sono in modalità edit
	public paiSaved = false; // se il pas è nello stato salvato
	private _careLevelChanged: boolean = false; //se il care level è stato modificato
	public createPasOnTheFly: boolean = false; //se posso creare il pas al volo
	public history: boolean = false; //se il pai è nello storico
	public canAddEvaluation: boolean = false; //se posso aggiungere le valutazioni
	//gli unici ruoli che possono modificare il pai
	public isCSanitario: boolean;
	public isCaseManger: boolean;
	private _serviceActivityCounter: number = 0; //solo se ho un numero di prestazioni >1 di posso settare il flag crate pas on the fly a true
	public reloadTable: Subject<void>= new Subject();

	dateGTNowFilter = (d: Date | null): boolean => {
		if (d) {
			return moment().subtract(1, 'days').isBefore(d)
		}
		return true;
	};

	public canAddPaiServiceActivity: boolean = false;
	constructor(
		private _glossarySerivce: GlossaryService,
		private _careLevelService: CareLevelService,
		private _formBuilder: FormBuilder,
		private _paiService: PAIService,
		private _serviceActivityService: PAIPASCommonService,
		private _pasService: PASService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService,
		private _location: Location,
		private _userService: UserService
	) {
	}

	setPasActivitiesCounter(num: number) {
		this._serviceActivityCounter = num;
		this.createPasOnTheFly = this._serviceActivityCounter >= 1;
		this._serviceActivityService.listServiceActivity(this.id, PAI_PAS.PAI).subscribe((activities) => {
			let totalDuration = 0;
			activities.forEach(activity => totalDuration += activity.duration);
			this.createPaiForm.get("expectedGEA").patchValue(totalDuration);
			let command: SavePAICommand = this.createPaiForm.getRawValue();
			this._paiService.save(command, this.id).subscribe({
				next: (result) => {
					this.currentPai = new PAIDetails();
					Object.assign(this.currentPai, result);
					this._setFlags();
				},
				error: (message: string) => alert(message),
			});
		});
	}


	//il ritorno dipende da dove sto chiamando il componente.
	//posso chiamare il componente sia dal modulo icp che dal modulo md
	goBack() {
		this._location.back();
	}

	save() {
		if (this.createPaiForm.isValid()) {
			let command: SavePAICommand = this.createPaiForm.getRawValue();
			if (this.edit) {
				let serviceToInvoke = {
					evaluationsLabel: this._paiService.listEvaluation(this.id, EvaluationType.midtermevaluation),
					finalEvaluationsLabel: this._paiService.listEvaluation(this.id, EvaluationType.finalevaluation),
					activities: this._serviceActivityService.listServiceActivity(this.id, this.pai_pas),
				};

				let confirmCall = (res) => {
					if (res) {
						this._paiService.save(command, this.id).subscribe({
							next: (result) => {
								this.currentPai = new PAIDetails();
								Object.assign(this.currentPai, result);
								//faccio ricaricare le tabele
								this.reloadTable.next();
								//setto i flag
								this._setFlags();
							},
							error: (message: string) => alert(message),
						});
					}
				};

				forkJoin(serviceToInvoke).subscribe(result => {
					let evaulations: Evaluation[] = result.evaluationsLabel;
					let finalEvaluations: Evaluation[] = result.finalEvaluationsLabel;
					let activities: ServiceActivityListItem[] = result.activities;
					let endDate: Date = new Date(this.createPaiForm.get("endDate").value);
					let startDate: Date = new Date(this.createPaiForm.get("startDate").value);

					if (
						evaulations
							.filter(evaluation => (moment(evaluation.date).isBefore(moment(startDate))) ||
								(moment(evaluation.date).isSame(moment(startDate))))
							.length != 0 && this.currentPai.startDate != this.createPaiForm.get("startDate").value
					) {
						return this._dialogService.showConfirm("icp.pai.editPai.deleteMidtermEvaluationConfirmTitle", "icp.pai.editPai.deleteMidtermEvaluationStartDateConfirmDescription", { callback: confirmCall });
					}
					if (
						evaulations
							.filter(evaluation => (moment(evaluation.date).isAfter(moment(endDate))) ||
								(moment(evaluation.date).isSame(moment(endDate))))
							.length != 0 && this.currentPai.duration != this.createPaiForm.get("duration").value
					) {
						return this._dialogService.showConfirm("icp.pai.editPai.deleteMidtermEvaluationConfirmTitle", "icp.pai.editPai.deleteMidtermEvaluationConfirmDescription", { callback: confirmCall });
					}
					if (
						finalEvaluations
							.filter(evaluation => ( !(moment(evaluation.date).isSame(moment(endDate)))))
							.length!=0
					) {
						return this._dialogService.showConfirm("icp.pai.editPai.deleteFinalEvaluationConfirmTitle", "icp.pai.editPai.deleteFinalEvaluationConfirmDescription", { callback: confirmCall });
					}
					if (activities.length != 0 && this._careLevelChanged) {
						return this._dialogService.showConfirm("icp.pai.editPai.deleteServiceActivityConfirmTitle", "icp.pai.editPai.deleteServiceActivityConfirmDescription", { callback: confirmCall });
					}
					this._paiService.save(command, this.id).subscribe({
						next: (result) => {
							this.currentPai = new PAIDetails();
							Object.assign(this.currentPai, result);
							this.edit = true;
							this._dialogService.showMessage("icp.updateOperationResult", "icp.pai.paiUpdated");
							this._setFlags();
						},
						error: (message: string) => alert(message),
					});
				});
			} else {
				Object.assign(command, this._patient);
				this._paiService.save(command).subscribe({
					next: (result) => {
						this.pageTitle = 'icp.pai.editPai.pageTitle';
						this.id = result.id;
						this.createPaiForm.get("id").patchValue(result.id);
						this.currentPai = new PAIDetails();
						Object.assign(this.currentPai, result);
						this.edit = true;
						this.currentServiceActivities.forEach(activityDetails => {
							let serviceActivity = new SaveServiceActivityCommand();
							Object.assign(serviceActivity, activityDetails);
							this._serviceActivityService.saveServiceActivity(serviceActivity, this.id, this.pai_pas).subscribe();
						});
						this._dialogService.showMessage("icp.saveOperationResult", "icp.pai.paiSaved");
						this._setFlags();
					},
					error: (message: string) => alert(message),
				});
			}
		}
	}


	public electCaseManager() {
		this._dialogService.show(ElectCaseManagerPageComponent, {
			panelClass: 'modal-lg',
			data: {
				paiId: this.id,
				caseManagerId: this.currentPai.caseManagerId,
			},
			callback: this._setCaseManager,
		});
	}

	private _setCaseManager = (caseManager: any) => {
		if (caseManager) {
			this._paiService.details(this.id).subscribe((newPai) => {
				this.currentPai = newPai;
				this.createPaiForm.get("caseManager").patchValue(caseManager.name);
			});
		}
	}


	public createPas() {
		let careLevelId = this.createPaiForm.get("careLevelId").value;
		let pathologiesId = this.createPaiForm.get("pathologiesId").value;
		this._dialogService.show(CreatePasOnTheFlyComponent, {
			panelClass: 'modal-lg',
			data: {
				careLevelId: careLevelId,
				pathologiesId: pathologiesId,
				paiId: this.id,
			},
			callback: this._updatePASChoiche,
		});

	}

	private _updatePASChoiche = (pasID: string) => {
		if (pasID) {
			this._pasService.list({
				ascending: true,
				keySelector: null,
				page: 0,
				size: 10,
				active: true
			}).subscribe((pas: SearchResult<PASListItem>) => {
				this.pasItems = pas.content.map(m => new SelectListitem(m.id, m.name));
				this.createPaiForm.get("pasId").patchValue(pasID);
			});
		}

	}


	ngOnInit() {
		this._profileService.profile$.subscribe((user: Profile) => {
			this.isCSanitario = user.isCSanitario;

			this._activatedRoute.params.subscribe(params => {
				this._activatedRoute.queryParams.subscribe(queries => {
					//se sono in edit non ho bisogno dei dati del paziente
					if (params['id'] != undefined) {
						this.id = params['id'];
						//se sono in create mi servono i dati del paziente
					} else {
						this._patient.patientName = queries['patientName'];
						this._patient.patientId = queries['patientId'];
						this._patient.patientSurname = queries['patientSurname'];
						this.patientFiscalCode = queries['patientFiscalCode'];
						this._patient.patientFiscalCode = this.patientFiscalCode;
						this._patient.patientEmail=queries['patientEmail'];
					}

					this.pai_pas = PAI_PAS.PAI;
					this.midtermEvaluationType = EvaluationType.midtermevaluation;
					this.finalEvaluationType = EvaluationType.finalevaluation;

					let form = this._formBuilder.group({
						id: [null],
						name: [null, Validators.required],
						careLevelId: [null],
						pathologiesId: [[]],
						startDate: [null],
						endDate: [null],
						pasId: [null],
						duration: [null, [Validators.min(1), Validators.pattern("^[0-9]*$")]],
						target: [null],
						healthAssessment: [null],
						functionalAssessment: [null],
						rehabilitationAssessment: [null],
						socioRelationalAssessment: [null],
						expectedGEA: [0],
						expectedCIA: [null],
						expectedGDC: [null],
						caseManager: [null],
						effectiveGEA: [null],
						effectiveCIA: [null],
						effectiveGDC: [null],
					});

					let servicesToInvoke: any = {
						careLevels: this._careLevelService.listGlobal(),
						pathologhies: this._glossarySerivce.list(GlossaryType.PATHOLOGIES),
						pas: this._pasService.list({
							ascending: true,
							keySelector: null,
							page: 0,
							size: 10,
							active: true
						}),
					};
					if (this.id != undefined && this.id != null) {
						this.edit = true;
						servicesToInvoke.entity = this._paiService.details(this.id);
						this.pageTitle = 'icp.pai.editPai.pageTitle';
					}
					else {
						this.edit = false;
						this.pageTitle = 'icp.pai.createPai.pageTitle';
					}

					forkJoin(servicesToInvoke).subscribe((result: any) => {
						// this.careLevelItems = result.careLevels.map(m => new SelectListitem(m.id, m.name));
						this.careLevelItems = result.careLevels.map((m: CareLevelListItem) => new SelectListitem(m.id, m.levelName + " - " + m.careProfileName));

						this.pathologieItems = result.pathologhies.map(m => new SelectListitem(m.id, m.name));
						let pasBuffer: SearchResult<PAS> = result.pas;
						this.pasItems = pasBuffer.content.map(m => new SelectListitem(m.id, m.name));

						if (result.entity) {
							form.patchValue(result.entity);
							this.currentPai = result.entity;
							this.isCaseManger = user.userId == this.currentPai.caseManagerId;
							if (result.entity.pasId) {
								form.get("careLevelId").disable();
							}
							this._setFlags();

						}
						this.createPaiForm = form;
						this._subscribeToFormEvents()
					})
				});
			});
		});
	}
	private _setFlags() {
		this._careLevelChanged = false;
		if (this.currentPai.careLevelId) {
			this.canAddPaiServiceActivity = true;
		}
		if (this.currentPai.startDate && this.currentPai.duration) {
			this.canAddEvaluation = true;
		}
		if (this.currentPai.state === "SALVATO") {
			this.paiSaved = true;
		}
		if (this.currentPai.state != "SALVATO" &&
			this.currentPai.state != "ATTIVATO" &&
			this.currentPai.state != "IN_CORSO" &&
			this.currentPai.state != "SOSPESO") {
			this.history = true;
		}
		console.log("flag aggioranti: pai salvato? ",this.paiSaved);
		console.log("sono in edit? ",this.edit);
		console.log("sono cSanitario: ",this.isCSanitario);
		console.log("sono case manager: ",this.isCaseManger);

	}

	private _subscribeToFormEvents() {
		this.createPaiForm.get("pasId").valueChanges.subscribe({
			next: (id: string) => {
				if (id) {
					this._pasService.details(id).subscribe({
						next: (pas: PAS) => {
							this.createPaiForm.patchValue({ careLevelId: pas.careLevelId, pathologiesId: pas.pathologiesId });
							this.createPaiForm.get("careLevelId").disable();
							this._serviceActivityService.listServiceActivity(pas.id, PAI_PAS.PAS).subscribe({
								next: (activities: ServiceActivityListItem[]) => {
									let expectedGEA = 0;
									activities.forEach(
										activity => this._serviceActivityService.serviceActivityDetails(pas.id, activity.id, PAI_PAS.PAS).subscribe({
											next: (activityDetails: ServiceActivityDetail) => {
												expectedGEA += activityDetails.minAccessNumber;
												this.currentServiceActivities.push(activityDetails);
												this.createPaiForm.get("expectedGEA").patchValue(expectedGEA);
											}
										})
									);
								},
							});
						}
					});

				} else {
					this.createPaiForm.get("careLevelId").enable();
					this.createPaiForm.get("pathologiesId").enable();
					this.createPaiForm.get("expectedGEA").setValue(0);
					this.currentServiceActivities = [];
				}
			}
		});

		this.createPaiForm.get("careLevelId").valueChanges.subscribe((id: string) => {
			if (this.currentPai && id != this.currentPai.careLevelId) {
				this._careLevelChanged = true;
			} else {
				this._careLevelChanged = false;
			}
			//se il nuovo livello di cura non lo associo prima al pai non posso aggiungere le prestazioni
			if (id && this.currentPai && this.currentPai.careLevelId == id) {
				this.canAddPaiServiceActivity = true;
			} else {
				this.canAddPaiServiceActivity = false;
			}
		});

		this.createPaiForm.get("duration").valueChanges.subscribe({
			next: (duration: number) => {
				let dateString = this.createPaiForm.get("startDate").value;
				if (dateString) {
					let endDate = moment(dateString).add(duration, "days");
					this.createPaiForm.get("endDate").patchValue(endDate.toISOString());
				}
				let expectedGEA = this.createPaiForm.get("expectedGEA").value ? this.createPaiForm.get("expectedGEA").value : 0;
				this.createPaiForm.get("expectedGDC").patchValue(duration);
				this.createPaiForm.get("expectedCIA").patchValue(expectedGEA / duration);
			}
		});


		this.createPaiForm.get("startDate").valueChanges.subscribe({
			next: (dateString: Moment) => {
				if (dateString) {
					let duration = this.createPaiForm.get("duration").value;
					if (duration) {
						let endDate = moment(dateString).add(duration, "days");
						this.createPaiForm.get("endDate").patchValue(endDate.toISOString());
						// let startDate = moment(dateString).add(0,"days");
						// this.createPaiForm.get("startDate").patchValue(startDate.toISOString());
					}
					this.createPaiForm.get("expectedGDC").patchValue(duration);
					let expectedGEA = this.createPaiForm.get("expectedGEA").value ? this.createPaiForm.get("expectedGEA").value : 0;
					this.createPaiForm.get("expectedCIA").patchValue(expectedGEA / duration);
				} else {
					this.createPaiForm.get("endDate").patchValue(undefined);
					this.canAddEvaluation = false;
				}
			}
		});

		this.createPaiForm.get("expectedGEA").valueChanges.subscribe({
			next: (gea: number) => {
				if ((this.createPaiForm.get("expectedGDC").value) && (this.createPaiForm.get("expectedGDC").value) != 0) {
					this.createPaiForm.get("expectedCIA").patchValue(gea / (this.createPaiForm.get("expectedGDC").value));
				}
			}
		});
	}
}

