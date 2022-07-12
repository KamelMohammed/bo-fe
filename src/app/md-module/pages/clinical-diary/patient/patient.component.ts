import { F } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Contact, MedicalRecord } from 'app/md-module/models/md.model';
import { DoctorDto, MedicalRecordRequest, MedicalRecordService } from 'app/md-module/services/mrc';
import { DoctorService } from 'app/services/api/pas';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, share, startWith, switchMap, tap } from 'rxjs/operators';
import {
	AslControllerService,
	AslDTO,
	AslRegionControllerService,
	AslRegionDTO,
	CitizenshipControllerService,
	CitizenshipDTO,
	CityControllerService,
	CityDTO,
	ContactDTO,
	DistrictControllerService,
	DistrictDTO,
	NationalityControllerService,
	NationalityDTO,
	NeighborhoodControllerService,
	NeighborhoodDTO,
	OtherContactDTO,
	PatientControllerService,
	PatientDTO,
	PatientInsertDTO,
	ProvinceControllerService,
	ProvinceDTO,
	StudyControllerService,
	StudyDTO,
} from '../../../../services/api/cdr';
import { CloseMedicalRecordDialogComponent } from '../close-medical-record-dialog/close-medical-record-dialog.component';


export interface GenderDTO {
	id: number;
	description: string;
}

export interface OldOtherContactDTO {
	addrerss?: string;
	contacts?: Array<ContactDTO>;
	name?: string;
	surname?: string;
	uniqueCode?: string;
	id?: string;
}

export enum MedicalRecordStatus {
	APERTA = 'APERTA',
	CHIUSA = 'CHIUSA',
	STORICIZZATA = 'STORICIZZATA'
}

@Component({
	selector: 'app-patient',
	templateUrl: './patient.component.html',
	styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, AfterViewInit {
	@Input() medicalRecord?: MedicalRecordRequest;
	@Input() readOnly = false;

	private _closeMRMode: boolean = false;
	@Input() set closeMRMode(closeMode: boolean) {
		if (closeMode && this.form)
			this.form.disable({ emitEvent: false });
		this._closeMRMode = closeMode;
	}
	get closeMRMode() { return this._closeMRMode};


	@Output() outputMedicalRecord = new EventEmitter<MedicalRecord>();


	// TODO... attenzione ai dati cablati nel codice
	assistenzaValues = ["DOMICILIARE", "REPARTO DI CARDIOLOGIA – GIUGLIANO"].map(m => new SelectListitem(m, m));


	CODE_LENGTH = 16;
	MIN_LENGTH = 3;
	TEAM_CODE_LENGTH = 20;

	form?: FormGroup;
	references = [
		{
			arrayName: 'mobiles',
			controlName: 'mobile',
			label: 'common.mobile'
		},
		{
			arrayName: 'phones',
			controlName: 'phone',
			label: 'common.phone'
		},
		{
			arrayName: 'emails',
			controlName: 'email',
			label: 'common.email'
		}
	];
	personalReferences = [
		{
			arrayName: 'mobiles',
			controlName: 'mobile',
			label: 'common.mobile'
		},
		{
			arrayName: 'phones',
			controlName: 'phone',
			label: 'common.phone'
		},
		{
			arrayName: 'emails',
			controlName: 'email',
			label: 'common.email'
		}
	];
	contactsToDelete: string[] = [];
	districtsBDay$: Observable<CityDTO[]>;
	districtsAddress$: Observable<CityDTO[]>;
	districtsDomicile$: Observable<CityDTO[]>;
	nationality$: Observable<CitizenshipDTO[]>;
	statesFilteredList$: Observable<NationalityDTO[]>;
	provinceBday$: Observable<ProvinceDTO[]>;
	provinceAddress$: Observable<ProvinceDTO[]>;
	provinceDomicile$: Observable<ProvinceDTO[]>;
	regionBDay$: Observable<AslRegionDTO[]>;
	regionsAddress$: Observable<AslRegionDTO[]>;
	regionDomicile$: Observable<AslRegionDTO[]>;
	asl$: Observable<AslDTO[]>;
	private _asl: AslDTO[] = [];
	aslDistrict$: Observable<DistrictDTO[]>;
	study$: Observable<StudyDTO[]>;
	maritalStatuses = [{ description: 'Celibe/Nubile', id: 0 },
	{ description: 'Coniugato/a', id: 1 },
	{ description: 'Vedovo/a', id: 2 },
	{ description: 'Divorziato/a', id: 3 },
	{ description: 'Non classificabile/ignoto/n.c', id: 4 },
	{ description: 'Stato libero a seguito di decesso della parte unita civilmente', id: 5 },
	{ description: 'Stato libero a seguito di scioglimento dell’unione', id: 6 }];

	neighborhoodAddress$: Observable<NeighborhoodDTO[]>;
	neighborhoodDomicile$: Observable<NeighborhoodDTO[]>;
	genderFilteredList: GenderDTO[] = [
		{ description: 'Uomo', id: 1 },
		{ description: 'Donna', id: 2 }];
	updateMode: boolean;
	patientUuid: string;
	profile: Profile;
	doctorDtoLogged: DoctorItem;
	initialDoctor: DoctorItem;
	private _districts: DistrictDTO[] = [];
	private _mmgSelected: DoctorItem = null;

	@Input() fromAlert = false;

	constructor(
		private readonly citizenshipControllerService: CitizenshipControllerService,
		private readonly patientControllerService: PatientControllerService,
		private readonly cityControllerService: CityControllerService,
		private readonly aslRegionControllerService: AslRegionControllerService,
		private readonly provinceControllerService: ProvinceControllerService,
		private readonly nationalityControllerService: NationalityControllerService,
		private readonly neighborhoodControllerService: NeighborhoodControllerService,
		private readonly aslControllerService: AslControllerService,
		private readonly districtControllerService: DistrictControllerService,
		private readonly studyControllerService: StudyControllerService,
		private readonly medicalRecordService: MedicalRecordService,
		private readonly profileService: ProfileService,
		private readonly snackBarService: SnackBarService,
		private readonly translate: TranslateService,
		private readonly formBuilder: FormBuilder,
		private dialog: MatDialog,
		private readonly router: Router,
		private readonly doctorService: DoctorService
	) { }

	ngOnInit(): void {
		this.profileService.profile$.subscribe(result => {
			this.profile = result;
		})
		this.updateMode = !!this.medicalRecord;
		this.initializeForm();
		this.nationality$ = this.citizenshipControllerService.loadCitizenshipsUsingGET().pipe(share());
		this.statesFilteredList$ = this.nationalityControllerService.loadNationalitiesUsingGET().pipe(share());
		this.study$ = this.studyControllerService.loadStudiesUsingGET();
		this.registerEvents();
		this.districtControllerService.loadDistrictsUsingGET().subscribe(result => {
			const a = result;
		})

		if (this.updateMode) {
			this.loadData();
			this.form.controls.checkDomicilieController.setValue(true);
		}

		if (!this.readOnly && !this.updateMode) {
			this.profileService.profile$.subscribe(user => {
				const { firstName: doctorName, lastName: doctorSurname } = user;
				this.doctorDtoLogged = new DoctorItem({
					doctorCode: "doctorMockCode",
					doctorName: user.firstName,
					doctorSurname: user.lastName
				});
			});
			this.form.controls.checkDomicilieController.valueChanges.subscribe(newValue => {
				this.enableDomus(newValue);
			})
			this.enableDomus();
		}

		if (this.updateMode) {
			this.disableFormController('mmgController');
		}

		if (this._closeMRMode && this.form)
			this.form.disable({ emitEvent: false });
	}

	searchDoctors = (value: string): Observable<DoctorItem[]> => {
		return this.doctorService.findBySurname(value === '' ? value = ' ' : value).pipe(map(result => {
			return result.map(m => new DoctorItem({
				doctorCode: m.doctorCode,
				doctorId: m.doctorId,
				doctorName: m.doctorName,
				doctorSurname: m.doctorSurname
			}));
		}));
	}

	public mmgSelected = (doctor: DoctorItem): void => {
		this._mmgSelected = doctor;
	}

	public get domusEnabled() {
		if (this.form)
			return this.form.controls.checkDomicilieController.value;
		return false;
	}


	enableDomus(check: boolean = null) {
		if (check === null) {
			check = this.form.controls.checkDomicilieController.value;
		}
		if (check) {
			this.enableFormController('addressDomicileController');
			this.enableFormController('cvNumberDomicileController');
			this.enableFormController('stateDomicileController');
			this.enableFormController('regionDomicileController');
			this.enableFormController('provinceDomicileController');
			this.enableFormController('districtDomicileController');
			this.enableFormController('capDomicileController');

			this.form.controls.quarterDomicileController.enable();
			this.form.controls.quarterDomicileController.updateValueAndValidity();

		} else {
			this.disableFormController('addressDomicileController');
			this.disableFormController('cvNumberDomicileController');
			this.disableFormController('stateDomicileController');
			this.disableFormController('regionDomicileController');
			this.disableFormController('provinceDomicileController');
			this.disableFormController('districtDomicileController');
			this.disableFormController('capDomicileController');
			this.disableFormController('quarterDomicileController');
		}
	}

	disableFormController(formController: string) {
		this.form.controls[formController].disable();
		this.form.controls[formController].setValue('');
		this.form.controls[formController].clearValidators();
		this.form.controls[formController].setValidators([]);
		this.form.controls[formController].updateValueAndValidity();
	}

	enableFormController(formController: string) {
		this.form.controls[formController].enable();
		this.form.controls[formController].setValidators([CommonValidators.required]);
		this.form.controls[formController].updateValueAndValidity();
	}

	ngAfterViewInit(): void {
		// if (this.closeMRMode) {
		// 	this.form.disable({ emitEvent: false });
		// }
	}

	initializeForm() {
		this.form = this.formBuilder.group({
			birthDate: new FormControl(({ value: null, disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			code: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			teamCode: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			name: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			gender: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			nationalityController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			references: new FormArray([this.getReferenceFormGroup({ emails: [], mobiles: [], surname: '', name: '', phones: [], id: '' })]),
			personalReferences: new FormArray([this.getReferenceFormGroup({ emails: [], mobiles: [], surname: '', name: '', phones: [] }, true)]),
			surname: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			healthInsuranceCard: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			stateOfBday: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			districtOfBday: new FormControl(({ value: '', disabled: true })),
			provinceOfBdayController: new FormControl(({ value: '', disabled: true })),
			regionOfBdayController: new FormControl(({ value: '', disabled: true })),
			addressController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			cvNumberController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			capController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			stateAddressController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			regionAddressController: new FormControl(({ value: '', disabled: true })),
			districtAddressController: new FormControl(({ value: '', disabled: true })),
			provinceAddressController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			quarterAddressController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			aslController: new FormControl(({ value: '', disabled: true })),
			districtController: new FormControl(({ value: '', disabled: true })),
			mmgController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert }), [CommonValidators.required]),
			assistenzaController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			maritalstatusController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			degreeController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),

			checkDomicilieController: new FormControl(false),
			addressDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			cvNumberDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			capDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			districtDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			quarterDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			provinceDomicileController: new FormControl(({ value: '', disabled: true })),
			regionDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
			stateDomicileController: new FormControl(({ value: '', disabled: this.updateMode && this.fromAlert })),
		});

		this.form.get('stateOfBday').valueChanges.subscribe((r) => {this.checkStateField('stateOfBday')})
		this.form.get('stateAddressController').valueChanges.subscribe((r) => {this.checkStateField('stateAddressController')})
		this.form.get('stateDomicileController').valueChanges.subscribe((r) => {this.checkStateField('stateDomicileController')})

	}

	selectedStates = {
		stateOfBday: false,
		stateAddressController: false,
		stateDomicileController: false
	}

	loadData() {
		const { patient = {} } = this.medicalRecord;
		const { code: fiscalCode } = patient;
		this.searchFiscalCode(fiscalCode);
	}

	// Metodo rimosso tramite gestione dell'evento di cambio di valore della select
	// isItaly(stateController: string) {
	// 	const formName = this.getFormNamesToDisable(stateController);
	// 	const selectedValue = this.form.controls[stateController].value as NationalityDTO;
	// 	const nat: string = selectedValue.description as string;
		
	// 	if (nat === undefined || nat.toLowerCase() !== 'italia') {
	// 	  return false;
	// 	}
	// 	return true;
	//   }
	isItaly(stateController: string) {
		return this.selectedStates[stateController];	
	}
	registerEvents() {
		/* register state fields event */
		[{ control: this.form.controls.stateOfBday, regionControllerName: 'regionOfBdayController' },
		{ control: this.form.controls.stateAddressController, regionControllerName: 'regionAddressController' },
		{ control: this.form.controls.stateDomicileController, regionControllerName: 'regionDomicileController' }]
			.forEach(({ control, regionControllerName }) => {
				control
					.valueChanges
					.pipe(filter(val => val))
					.subscribe((val: string) => {
						this.loadRegionData(val, regionControllerName);
					});
			});
		/* register region fields event */
		[{ control: this.form.controls.regionOfBdayController, regionControllerName: 'provinceOfBdayController' },
		{ control: this.form.controls.regionAddressController, regionControllerName: 'provinceAddressController' },
		{ control: this.form.controls.regionDomicileController, regionControllerName: 'provinceDomicileController' }]
			.forEach(({ control, regionControllerName }) => {
				control
					.valueChanges
					.pipe(filter(val => val))
					.subscribe((val: string) => {
						this.loadProvinceData(val, regionControllerName);
					});
			});
		/* register province fields event */
		[{ control: this.form.controls.provinceOfBdayController, regionControllerName: 'districtOfBday' },
		{ control: this.form.controls.provinceAddressController, regionControllerName: 'districtAddressController' },
		{ control: this.form.controls.provinceDomicileController, regionControllerName: 'districtDomicileController' }]
			.forEach(({ control, regionControllerName }) => {
				control
					.valueChanges
					.pipe(filter(val => val))
					.subscribe((val: string) => {
						this.loadDistrictData(val, regionControllerName);
					});
			});
		/* register district field event on Residence  */
		this.form.controls.districtAddressController
			.valueChanges
			.pipe(filter(val => val))
			.subscribe((val: string) => {
				this.loadAslData(val);
				this.loadNeighborhoodData(val, 'quarterAddressController');
			});

		this.form.controls.districtDomicileController
			.valueChanges
			.pipe(filter(val => val))
			.subscribe((val: string) => {
				this.loadAslData(val);
				this.loadNeighborhoodData(val, 'quarterDomicileController');
			});
		/* register asl field Event */
		this.form.controls.aslController
			.valueChanges
			.pipe(
				filter(val => val)
			)
			.subscribe((val: CitizenshipDTO) => {
				this.loadAslDistrictsData();
			});
	}

	loadRegionData(id: string, formControlToEnable: string) {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls[formControlToEnable].enable();
		}
		const regions$ = this.aslRegionControllerService.loadRegionsByStateUsingGET(id)
			.pipe(share());
		switch (formControlToEnable) {
			case ('regionOfBdayController'):
				this.regionBDay$ = regions$;
				break;
			case ('regionAddressController'):
				this.regionsAddress$ = regions$;
				break;
			case ('regionDomicileController'):
				this.regionDomicile$ = regions$;
				break;
		}

	}

	loadProvinceData(regionId: string, formControlToEnable: string) {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls[formControlToEnable].enable();
		}
		const provinces$ = this.provinceControllerService.loadProvincesByRegionUsingGET(regionId);
		switch (formControlToEnable) {
			case ('provinceOfBdayController'):
				this.provinceBday$ = provinces$;
				break;
			case ('provinceAddressController'):
				this.provinceAddress$ = provinces$;
				break;
			case ('provinceDomicileController'):
				this.provinceDomicile$ = provinces$;
				break;
		}
	}

	loadDistrictData(provinceId: string, formControlToEnable: string) {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls[formControlToEnable].enable();
		}
		const district$ = this.cityControllerService.loadCitiesByProvinceUsingGET(provinceId);
		switch (formControlToEnable) {
			case ('districtOfBday'):
				this.districtsBDay$ = district$;
				break;
			case ('districtAddressController'):
				this.districtsAddress$ = district$;
				break;
			case ('districtDomicileController'):
				this.districtsDomicile$ = district$;
				break;
		}
	}
	// neighborhoodControllerService
	loadNeighborhoodData(districtId: string, formControlToEnable: string) {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls[formControlToEnable].enable();
		}
		const district$ = this.neighborhoodControllerService.loadNeighborhoodByCityUsingGET(districtId);
		switch (formControlToEnable) {
			case ('quarterAddressController'):
				this.neighborhoodAddress$ = district$;
				break;
			case ('quarterDomicileController'):
				this.neighborhoodDomicile$ = district$;
				break;
		}
	}

	public get aslEnabled() {
		return this.form && this.form.controls.aslController.enabled;
	}
	// aslControllerService
	loadAslData(districtId: string) {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls.aslController.enable();
		}
		this.asl$ = this.aslControllerService.loadAslByCityUsingGET(districtId).pipe(tap(r => {
			this._asl = r;
		}));
	}

	loadAslDistrictsData() {
		if (!this.closeMRMode && !this.fromAlert) {
			this.form.controls.districtController.enable();
		}
		this.aslDistrict$ = this.districtControllerService.loadDistrictByAslUsingGET(this.form.controls.aslController.value).pipe(tap(result => this._districts = result));
	}

	districtDisplayProperty(district: CityDTO) {
		if (district) {
			return district.description;
		}
	}


	autocompleteSelectedEvent(controllerName: string) {
		const { cap = '' } = this.form.controls[controllerName].value as CityDTO;
		if (cap) {
			this.form.controls.capController.patchValue(cap);
			this.form.controls.capController.disable();
		} else {
			this.form.controls.capController.enable();
		}
	}

	searchFiscalCode(code: string) {
		this.patientControllerService.getPatientByUniqueCodeUsingGET(code)
			.subscribe(data => {
				if (data) {
					this.patientUuid = data.uuid;
					this.setPatientData(data);
					this.setBirthData(data);
					this.setResidenceData(data);
					this.setDomicileData(data);
					this.setAslData(data);
					this.setOtherInfo(data);
					this.setPersonalContacts(data);
					this.setOtherContacts(data);
				}
			});
	}

	setPatientData(patientDetails: PatientDTO) {
		const { name, surname, sex, birthDate, healthCard, contacts, uniqueCode, citizenshipId } = patientDetails;
		const gender = this.genderFilteredList.find(({ id }) => sex === id);

		if (patientDetails.typeCode === 'team' || patientDetails.typeCode === 't.e.a.m.') {
			this.form.controls.teamCode.patchValue(uniqueCode);
		} else {
			this.form.controls.code.patchValue(uniqueCode);
		}
		this.form.controls.name.patchValue(name);
		this.form.controls.surname.patchValue(surname);
		this.form.controls.birthDate.patchValue(birthDate);
		this.form.controls.gender.patchValue(gender.id);
		this.form.controls.nationalityController.patchValue(citizenshipId.uuid);
		this.form.controls.healthInsuranceCard.patchValue(healthCard);
	}

	setBirthData(patientDetails: PatientDTO) {
		this.form.controls.stateOfBday.patchValue(patientDetails.stateNationalityId.uuid);
		if (patientDetails.birthCityId && patientDetails.birthCityId.uuid) {
			this.cityControllerService.getCityUsingGET(patientDetails.birthCityId.uuid)
				.subscribe(cityDetails => {
					const { aslRegion: region, province } = cityDetails;
					this.form.controls.regionOfBdayController.patchValue(region.uuid);
					this.form.controls.provinceOfBdayController.patchValue(province.uuid);
					this.form.controls.districtOfBday.patchValue(cityDetails.uuid);
				});
		}
	}

	setResidenceData(patientDetails: PatientDTO) {
		const { addressResidence, addressResidenceNumber, cityResidenceId, neighborhoodId, capResidence } = patientDetails;
		const stateResidenceId = patientDetails.cityResidenceId.aslRegion.nation.uuid;
		this.statesFilteredList$.subscribe(list => {
			const state = list.find(l => l.uuid === stateResidenceId);

			this.form.controls.addressController.patchValue(addressResidence);
			this.form.controls.cvNumberController.patchValue(addressResidenceNumber);
			this.form.controls.stateAddressController.patchValue(state.uuid);
			this.form.controls.capController.patchValue(capResidence);
			this.cityControllerService.getCityUsingGET(cityResidenceId.uuid)
				.subscribe(cityDetails => {
					const { aslRegion: region, province } = cityDetails;
					this.form.controls.regionAddressController.patchValue(region.uuid);
					this.form.controls.provinceAddressController.patchValue(province.uuid);
					this.form.controls.districtAddressController.patchValue(cityDetails.uuid);
					if (neighborhoodId && neighborhoodId.uuid) {
						this.form.controls.quarterAddressController.patchValue(neighborhoodId.uuid);
					}
				});
		});
	}

	setDomicileData(patientDetails: PatientDTO) {
		const { addressDomicile, addressDomicileNumber,
			cityDomicileId, neighborhoodDomicileId, capDomicile
		} = patientDetails;
		const stateDomicileId = patientDetails.cityDomicileId.aslRegion.nation.uuid;
		this.statesFilteredList$.subscribe(list => {
			const state = list.find(l => l.uuid === stateDomicileId);
			this.form.controls.addressDomicileController.patchValue(addressDomicile);
			this.form.controls.cvNumberDomicileController.patchValue(addressDomicileNumber);
			this.form.controls.stateDomicileController.patchValue(state.uuid);
			this.form.controls.capDomicileController.patchValue(capDomicile);
			this.cityControllerService.getCityUsingGET(cityDomicileId.uuid)
				.subscribe(cityDetails => {
					const { aslRegion: region, province } = cityDetails;
					this.form.controls.regionDomicileController.patchValue(region.uuid);
					this.form.controls.provinceDomicileController.patchValue(province.uuid);
					this.form.controls.districtDomicileController.patchValue(cityDetails.uuid);
					if (neighborhoodDomicileId && neighborhoodDomicileId.uuid) {
						this.form.controls.quarterDomicileController.patchValue(neighborhoodDomicileId.uuid);
					}
				});
		});
	}

	setAslData(patientDetails: PatientDTO) {
		const { aslId, district, mmg, serviceType } = patientDetails;
		this.form.controls.aslController.patchValue(aslId.uuid);
		this.form.controls.districtController.patchValue(district.uuid);
		this.initialDoctor = new DoctorItem(this.medicalRecord.doctor);
		this.form.controls.mmgController.patchValue(this.initialDoctor.label);
		this.form.controls.assistenzaController.patchValue(serviceType);
	}

	setPersonalContacts(patientDetails: PatientDTO) {
		const oneContact = [{
			contacts: patientDetails.contacts
		}];
		const mappedContacts = oneContact
			.map((contact, index) => {

				const resAcc = contact.contacts
					.reduce((acc, val) => {
						const { email = '', mobileNumber = '', telephoneNumber = '' } = val;
						acc.email.push(email);
						acc.mobileNumber.push(mobileNumber);
						acc.telephoneNumber.push(telephoneNumber);
						return acc;
					}, ({ email: [], mobileNumber: [], telephoneNumber: [] }));

				return {
					emails: resAcc.email.filter(e => e).map(e => ({ email: e })),
					mobiles: resAcc.mobileNumber.filter(e => e).map(e => ({ mobile: e })),
					name: '',
					phones: resAcc.telephoneNumber.filter(e => e).map(e => ({ phone: e })),
					surname: '',
				};
			});
		const contactHaveEmails = mappedContacts.find(c => c.emails.find(e => e.email));
		if (contactHaveEmails) {
			this.getFormArrayFromFormGroup(this.getFormArray(this.form.controls.personalReferences).controls[0], 'emails')
				.removeAt(0);
		}
		/* simulate add button for each further contact */
		mappedContacts.forEach((contact, index) => {
			const { emails = [], mobiles = [], phones = [] } = contact;
			emails.forEach(email => {
				this.addFormControl(this.getFormArray(this.form.controls.personalReferences).controls[index], 'emails', 'email');
			});
			mobiles.forEach(mobile => {
				this.addFormControl(this.getFormArray(this.form.controls.personalReferences).controls[index], 'mobiles', 'mobile');
			});
			phones.forEach(phone => {
				this.addFormControl(this.getFormArray(this.form.controls.personalReferences).controls[index], 'phones', 'phone');
			});
		});

		this.getFormArray(this.form.controls.personalReferences).controls
			.forEach((control, index) => {
				control.patchValue(mappedContacts[index] || '');
			});
	}

	setOtherContacts(patientDetails: PatientDTO) {
		const { otherContacts = [] } = patientDetails;
		const mappedOtherContacts: OldOtherContactDTO[] = [];
		if (otherContacts.length) {
			for (const oc of otherContacts) {
				const currentContact: OldOtherContactDTO = {} as OldOtherContactDTO;
				currentContact.id = oc.id;
				currentContact.name = oc.name;
				currentContact.surname = oc.surname;
				currentContact.contacts = [];
				const contactLength = Math.max(oc.emails.length, oc.mobiles.length, oc.phones.length);
				for (let i = 0; i < contactLength; i++) {
					currentContact.contacts.push({
						email: oc.emails[i] ? oc.emails[i] : '',
						mobileNumber: oc.mobiles[i] ? oc.mobiles[i] : '',
						telephoneNumber: oc.phones[i] ? oc.phones[i] : ''
					});
				}
				mappedOtherContacts.push(currentContact);
			}

			const mappedContacts = mappedOtherContacts
				.map((contact, index) => {
					if (!contact.contacts) {
						contact.contacts = [];
					}
					const resAcc = contact.contacts
						.reduce((acc, val) => {
							const { email = '', mobileNumber = '', telephoneNumber = '' } = val;
							acc.email.push(email);
							acc.mobileNumber.push(mobileNumber);
							acc.telephoneNumber.push(telephoneNumber);
							return acc;
						}, ({ email: [], mobileNumber: [], telephoneNumber: [] }));

					return {
						id: contact.id,
						emails: resAcc.email.filter(e => e).map(e => ({ email: e })),
						mobiles: resAcc.mobileNumber.filter(e => e).map(e => ({ mobile: e })),
						name: contact.name,
						phones: resAcc.telephoneNumber.filter(e => e).map(e => ({ phone: e })),
						surname: contact.surname,
					};
				});

			const formArray = [];
			for (const mc of mappedContacts) {
				formArray.push(this.getReferenceFormGroup({ emails: [], mobiles: [], surname: '', name: '', phones: [], id: '' }));
			}
			this.form.controls.references = new FormArray(formArray);
			const contactHaveEmails = mappedContacts.find(c => c.emails.find(e => e.email));
			if (contactHaveEmails) {
				this.getFormArrayFromFormGroup(this.getFormArray(this.form.controls.references).controls[0], 'emails')
					.removeAt(0);
			}
			// simulate add button for each further contact
			mappedContacts.forEach((contact, index) => {
				const { emails = [], mobiles = [], phones = [] } = contact;
				emails.forEach(email => {
					this.addFormControl(this.getFormArray(this.form.controls.references).controls[index], 'emails', 'email');
				});
				mobiles.forEach(mobile => {
					this.addFormControl(this.getFormArray(this.form.controls.references).controls[index], 'mobiles', 'mobile');
				});
				phones.forEach(phone => {
					this.addFormControl(this.getFormArray(this.form.controls.references).controls[index], 'phones', 'phone');
				});
			});

			this.getFormArray(this.form.controls.references).controls
				.forEach((control, index) => {
					control.patchValue(mappedContacts[index] || '');
				});
		}
	}

	setOtherInfo(patientDetails: PatientDTO) {
		this.form.controls.maritalstatusController.patchValue(patientDetails.maritalStatus);
		if (patientDetails.stateNationalityId) {
			this.form.controls.degreeController.patchValue(patientDetails.study.uuid);
		}
	}

	registerOnComuni(controllerName: string) {
		return this.form.controls[controllerName]
			.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				filter(val => val.length >= this.MIN_LENGTH),
				mergeMap((val) => this.cityControllerService.getCityByDescriptionUsingGET(val))
			);
	}

	getReferenceFormGroup(reference: Contact, requiredEmail?) {
		return new FormGroup({
			id: new FormControl(reference.id),
			emails: new FormArray(
				reference.emails.length? reference.emails.map(email => new FormGroup({ email: new FormControl({ value: email, disabled: this.updateMode && this.fromAlert },
					((requiredEmail)?[Validators.email, Validators.required]:[Validators.email])
				) }))
				: [new FormGroup({ email: new FormControl('', 
				
				((requiredEmail)?[Validators.email, Validators.required]:[Validators.email])
				
				) })]
			),
			mobiles: new FormArray(reference.mobiles.length
				? reference.mobiles.map(mobile => new FormGroup({ mobile: new FormControl(mobile) }))
				: [new FormGroup({ mobile: new FormControl('') })]
			),
			name: new FormControl(reference.name),
			phones: new FormArray(reference.phones.length
				? reference.phones.map(phone => new FormGroup({ phone: new FormControl(phone) }))
				: [new FormGroup({ phone: new FormControl('') })]
			),
			surname: new FormControl(reference.surname),
		});
	}

	getFormArray(control: AbstractControl) {
		return control as FormArray;
	}

	getFormGroup(control: AbstractControl) {
		return control as FormGroup;
	}

	getFormArrayFromFormGroup(control: AbstractControl, formControlName: string) {
		const formGroup = this.getFormGroup(control);
		return formGroup.controls[formControlName] as FormArray;
	}

	addFormControl(control: AbstractControl, formControlName: string, name: string) {
		const formGroup = new FormGroup({});
		formGroup.addControl(name, new FormControl('', name === 'email' ? [Validators.email] : []));
		this.getFormArrayFromFormGroup(control, formControlName).push(formGroup);
		this.form.updateValueAndValidity();
	}

	deleteFormControl(control: AbstractControl, formControlName: string, index: number) {
		this.getFormArrayFromFormGroup(control, formControlName).removeAt(index);
	}

	addReference() {
		this.getFormArray(this.form.controls.references)
			.push(this.getReferenceFormGroup({ emails: [], mobiles: [], surname: '', name: '', phones: [] }));
	}

	deleteReference(index: number) {
		const formArray = this.getFormArray(this.form.controls.references);
		const formGroup = this.getFormGroup(formArray.controls[index]);
		const contactId = formGroup.controls.id.value;
		this.contactsToDelete.push(contactId);
		this.getFormArray(this.form.controls.references).removeAt(index);
	}

	checkStateField(stateController: string) {

		/* v2-id25
		Se seleziono una voce diversa da "Italia"
		per il campo "Stato di nascita" i campi Regione, Provincia e Comune devono essere disabilitati e nulli  */
		// e' stato richiesto lo stesso comportamento per tutti i campi di Stato
		// const formName = this.getFormNamesToDisable(stateController);
		// const selectedValue = this.form.controls[stateController].value as NationalityDTO;
		// if (selectedValue && selectedValue.description) {
		// 	if (selectedValue.description.toLowerCase() !== 'italia') {
		// 		this.resetBdayFields(formName);
		// 	} else {
		// 		formName
		// 			.forEach(controller => {
		// 				if (this.form.controls[controller].disabled && this.fromAlert) {
		// 					this.form.controls[controller].enable();
		// 				}
		// 			});
		// 	}
		// }

		
		const formName = this.getFormNamesToDisable(stateController);

		let selectedNationId = this.form.controls[stateController].value;
		if (selectedNationId) {
			this.statesFilteredList$.subscribe((nations) => {
				let index = nations.findIndex((nation) => {return nation.description.toLowerCase() === 'italia'});
				if (index >= 0) {
					if (selectedNationId == nations[index].uuid) {
						formName.forEach(controller => {
							if (this.form.controls[controller].disabled && this.fromAlert) {
								this.form.controls[controller].enable();
							}
						});
						this.selectedStates[stateController] = true;
					}
					else {
						this.resetBdayFields(formName);
						this.selectedStates[stateController] = false;
					}
				}
				else {
					this.resetBdayFields(formName);
					this.selectedStates[stateController] = false;
				}
			})
			
		}
		else {
			this.selectedStates[stateController] = false;
			this.resetBdayFields(formName);
		}
	}

	getFormNamesToDisable(stateControllerName: string) {
		let formNames: string[];
		switch (stateControllerName) {
			case ('stateOfBday'):
				formNames = ['regionOfBdayController', 'provinceOfBdayController', 'districtOfBday'];
				break;
			case ('stateAddressController'):
				formNames = ['regionAddressController', 'provinceAddressController', 'districtAddressController',
					'capController', 'quarterAddressController', 'aslController', 'districtController'];
				break;
			case ('stateDomicileController'):
				formNames = ['regionDomicileController', 'provinceDomicileController', 'districtDomicileController',
					'capDomicileController', 'quarterDomicileController'];
				break;
		}

		return formNames;
	}

	resetBdayFields(formName: string[]) {
		formName
			.forEach(controller => {
				this.form.controls[controller].patchValue('');
				this.form.controls[controller].disable();
			});
	}

	maritalStatusCompareFn(itemX: GenderDTO, itemY: GenderDTO) {
		const { id: idX } = itemX;
		const { id: idY } = itemY;

		return itemX && itemY ? idX === idY : itemY;
	}


	save() {
		if (!this.form.isValid()) {
			return;
		}
		const uniqueCode = this.form.controls.code.value ? this.form.controls.code.value : this.form.controls.teamCode.value;
		const typeCode = this.form.controls.code.value ? null : 'team';
		const otherContacts = this.mapOtherContact(uniqueCode);
		const healthCard = this.form.controls.healthInsuranceCard.value;
		const name = this.form.controls.name.value;
		const surname = this.form.controls.surname.value;
		const birthDate = this.form.controls.birthDate.value;
		const addressResidence = this.form.controls.addressController.value;
		const addressResidenceNumber = this.form.controls.cvNumberController.value;
		const capResidence = this.form.controls.capController.value;
		const aslId = this.form.controls.aslController.value;
		const birthCityId = this.form.controls.districtOfBday.value;
		const contacts = this.buildPersonalContacts();
		const mmg = this.form.controls.mmgController.value;
		const serviceType = this.form.controls.assistenzaController.value;
		const citizenshipId = this.form.controls.nationalityController.value;
		const cityResidenceId = this.form.controls.districtAddressController.value;
		const maritalStatus = this.form.controls.maritalstatusController.value ?
			this.form.controls.maritalstatusController.value.id : undefined;
		const neighborhoodId = this.form.controls.quarterAddressController.value;
		const stateNationalityId = this.form.controls.stateOfBday.value;
		const stateResidenceId = this.form.controls.stateOfBday.value;
		const sex = this.form.controls.gender.value;
		const study = this.form.controls.degreeController.value;
		const districtId = this.form.controls.districtController.value;
		const districtAsl = districtId ? this._asl.find(f => f.uuid == aslId).description : "";
		const districtCode = districtId ? this._districts.find(f => f.uuid == districtId).name : "";
		const districtName = districtId ? this._districts.find(f => f.uuid == districtId).description : "";


		let addressDomicile;
		let addressDomicileNumber;
		let stateDomicileId;
		let neighborhoodDomicileId;
		let cityDomicileId;
		let capDomicile;
		let temp;
		if (this.form.controls.checkDomicilieController.value) {
			addressDomicile = this.form.controls.addressDomicileController.value;
			addressDomicileNumber = this.form.controls.cvNumberDomicileController.value;
			stateDomicileId = this.form.controls.stateDomicileController.value;
			if (this.form.controls.quarterDomicileController.value) {
				neighborhoodDomicileId = this.form.controls.quarterDomicileController.value;
			}
			if (this.form.controls.districtDomicileController.value) {
				cityDomicileId = this.form.controls.districtDomicileController.value;
			}
			capDomicile = this.form.controls.capDomicileController.value;
		} else {
			addressDomicile = this.form.controls.addressController.value;
			addressDomicileNumber = this.form.controls.cvNumberController.value;
			stateDomicileId = this.form.controls.stateOfBday.value;
			if (this.form.controls.quarterAddressController.value) {
				neighborhoodDomicileId = this.form.controls.quarterAddressController.value;
			}
			cityDomicileId = this.form.controls.districtAddressController.value;
			capDomicile = this.form.controls.capController.value;
		}

		let patientOtherContact: OtherContactDTO[];
		patientOtherContact = otherContacts.filter(contact => contact.id !== undefined && contact.id !== '' && contact.id !== null);
		const patient: PatientInsertDTO = {
			addressDomicile,
			addressDomicileNumber,
			addressResidence,
			addressResidenceNumber,
			aslId,
			birthCityId,
			birthDate,
			capDomicile,
			capResidence,
			citizenshipId,
			cityDomicileId,
			cityResidenceId,
			contacts,
			districtId,
			healthCard,
			maritalStatus,
			mmg,
			name,
			neighborhoodDomicileId,
			neighborhoodId,
			otherContacts: patientOtherContact,
			serviceType,
			sex,
			stateNationalityId,
			stateDomicileId,
			stateResidenceId,
			study,
			surname,
			typeCode,
			uniqueCode,
		};
		if (this.updateMode && !this.fromAlert) {
			const patientToUpdate = {
				...patient,
				updateDate: new Date(),
				updateUserId: this.profile.userId,
				uuid: this.patientUuid
			};
			this.patientControllerService.updatePatientUsingPUT(patientToUpdate, this.patientUuid)
				.subscribe(patientId => {
					if (otherContacts.length) {
						this.addOrUpdateContact(otherContacts, patientId.uuid);
					}
					const messageS = 'Update avvenuto con successo.';
					this.snackBarService.success(messageS);
					// this.snackBar.open(messageS, 'CHIUDI', { duration: 7000 });
				}, error => {
					const { messageE = 'Qualcosa e\' andato storto' } = error;
					this.snackBarService.error(messageE);
					
					// this.snackBar.open(messageE, 'CHIUDI', { duration: 7000 });
				});

			// TODO: Update MedicalRecord ( for mmgController )

		} else { // new patient
			this.patientControllerService.create(patient)
				.subscribe(patientId => {
					const message = 'Salvataggio avvenuto con successo.';
					this.snackBarService.success(message);
					// this.snackBar.open(message, 'CHIUDI', { duration: 7000 });
					this.updateMode = true;
					this.patientUuid = patientId;
					const { firstName: doctorName, lastName: doctorSurname } = this.profile;
					const { nosological } = (this.medicalRecord || { nosological: `${moment().format('YY')}D` });
					const medicalRecord: MedicalRecordRequest = {
						district: {
							districtAsl,
							districtCode,
							districtId,
							districtName
						},
						doctor: this._mmgSelected.doctor,
						nosological,
						operator: this.doctorDtoLogged.doctor,
						patient: {
							birthDate,
							code: patient.uniqueCode,
							id: patientId, // uuid del paziente
							name,
							surname
						},
						status: MedicalRecordStatus.APERTA
					};
					this.medicalRecordService.create(medicalRecord)
						.subscribe(data => {
							this.medicalRecord = data;
							this.outputMedicalRecord.emit({
								district: {
									districtAsl: this.medicalRecord.district.districtAsl,
									districtCode: this.medicalRecord.district.districtCode,
									districtId: this.medicalRecord.district.districtId,
									districtName: this.medicalRecord.district.districtName
								},
								doctor: this._mmgSelected.doctor,
								id: this.medicalRecord.id,
								nosological: this.medicalRecord.nosological,
								operator: this.doctorDtoLogged.doctor,
								patient: this.medicalRecord.patient,
								status: this.medicalRecord.status,
							});
							this.addOrUpdateContact(otherContacts, patientId);
							const messageS = 'Salvataggio avvenuto con successo.';
							this.snackBarService.success(messageS);
							// this.snackBar.open(messageS, 'CHIUDI', { duration: 7000 });
						}, error => {
							const { messageE = 'Qualcosa e\' andato storto' } = error;
							this.snackBarService.error(messageE);
							// this.snackBar.open(messageE, 'CHIUDI', { duration: 7000 });
						});
				}, error => {
					const { message = 'Qualcosa e\' andato storto' } = error;
					this.snackBarService.error(message);
					// this.snackBar.open(message, 'CHIUDI', { duration: 7000 });
				});
		}
		const controllerToCkeck = Object.values(this.form.controls).filter(control => this.getValidator(control));
		if (!controllerToCkeck.find(c => c.status !== 'DISABLED' && !c.valid)) {

		} else {
			const mess1 = this.translate.instant('INSERT_MANDATORY_CODES');
			const mess2 = this.translate.instant('INSERT_MANDATORY_FIELDS');
			this.snackBarService.info('- ' + mess1 + '\n' + '- ' + mess2);
			// this.snackBar.open('- ' + mess1 + '\n' + '- ' + mess2, 'CHIUDI', { duration: 7000, panelClass: ['custom-snackbar'] });
		}
	}

	addOrUpdateContact(otherContacts: OtherContactDTO[], patientId: string) {
		for (const cont of otherContacts) {
			if (cont.id) {
				this.patientControllerService.updateContact(patientId, cont).subscribe(data => {
					console.log('Contact updated.');
				});
			} else {
				this.patientControllerService.addContact(patientId, cont).subscribe(data => {
					console.log('Contact added.');
				});
			}
		}
	}

	getValidator(control: AbstractControl) {
		const validator = control.validator && control.validator({} as AbstractControl);
		if (validator && validator.required) {
			return true;
		}
	}

	buildOldOtherContacts(): OldOtherContactDTO[] {
		return this.getFormArray(this.form.controls.references).controls
			.map((control) => {
				const values = this.getFormGroup(control).value;
				// tslint:disable-next-line:no-shadowed-variable
				const picked = (({ emails, mobiles, phones }) => ({ emails, mobiles, phones }))(values);
				const rowLength = Math.max(...[...Object.values(picked)].map(el => el.length));
				const rows = [...Array(rowLength).keys()];
				const contacts: ContactDTO[] = rows
					.map(i => ({
						email: (picked.emails[i] || { email: '' }).email,
						mobileNumber: (picked.mobiles[i] || { mobile: '' }).mobile,
						telephoneNumber: (picked.phones[i] || { phone: '' }).phone
					}));

				return {
					id: values.id,
					name: values.name,
					surname: values.surname,
					contacts
				};
			});
	}

	mapOtherContact(uniqueCode: string) {
		const oldOtherContact: OldOtherContactDTO[] = this.buildOldOtherContacts();
		const other: OtherContactDTO[] = [];
		let mailExist = false;
		for (const parentContact of oldOtherContact) {
			const currentContact = {} as OtherContactDTO;
			currentContact.name = parentContact.name;
			currentContact.id = parentContact.id;
			currentContact.surname = parentContact.surname;
			currentContact.emails = [];
			currentContact.mobiles = [];
			currentContact.phones = [];
			currentContact.uniqueCode = uniqueCode;
			for (const contact of parentContact.contacts) {
				if (contact.email.length) {
					currentContact.emails.push(contact.email);
					mailExist = true;
				}
				if (contact.mobileNumber.length) {
					currentContact.mobiles.push(contact.mobileNumber);
				}
				if (contact.telephoneNumber.length) {
					currentContact.phones.push(contact.telephoneNumber);
				}
			}
			if (currentContact.name && currentContact.surname && mailExist) {
				other.push(currentContact);
			}
		}
		return other;
	}

	buildPersonalContacts(): ContactDTO[] {
		return this.getFormArray(this.form.controls.personalReferences).controls
			.map((control) => {
				const values = this.getFormGroup(control).value;
				// tslint:disable-next-line:no-shadowed-variable
				const picked = (({ emails, mobiles, phones }) => ({ emails, mobiles, phones }))(values);
				const rowLength = Math.max(...[...Object.values(picked)].map(el => el.length));
				const rows = [...Array(rowLength).keys()];
				const contacts: ContactDTO[] = rows
					.map(i => ({
						email: (picked.emails[i] || { email: '' }).email,
						mobileNumber: (picked.mobiles[i] || { mobile: '' }).mobile,
						telephoneNumber: (picked.phones[i] || { phone: '' }).phone
					}));

				return contacts;
			})[0];
	}

	closeMedicalRecord() {
		this.dialog.open(CloseMedicalRecordDialogComponent, {
			data: {
				id: this.medicalRecord && this.medicalRecord.id
			}
		})
			.afterClosed()
			.subscribe(res => {
				if (res === 'SUCCESS') {
					this.snackBarService.info('Chiusura cartella avvenuta con successo');
					// this.snackBar.open('Chiusura cartella avvenuta con successo', 'CHIUDI', { duration: 7000 });
					this.router.navigate(['/']);
				} else if (res === 'ERROR') {
					this.snackBarService.error('Qualcosa è andato storto');
					// this.snackBar.open('Qualcosa è andato storto', 'CHIUDI', { duration: 7000 });
				}
			});
	}
}

class DoctorItem {
	public label: string;
	constructor(public doctor: DoctorDto) {
		this.label = doctor.doctorSurname + ' ' + doctor.doctorName;
		if (this.doctor.doctorCode) {
			this.label = this.label + "  ";
		}
	}

}