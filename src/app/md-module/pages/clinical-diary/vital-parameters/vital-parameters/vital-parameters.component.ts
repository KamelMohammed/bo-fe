import { SelectionModel } from '@angular/cdk/collections';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MedicalRecord, VitalMeasurement, VitalParameters, VitalParametersChartData, VitalParametersData } from 'app/md-module/models/md.model';
import { PageSurveyResponse, ParameterResponse, SurveyResponse, SurveyService, VitalParametersService } from 'app/services/api/cpmbase';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { first, orderBy } from 'lodash';
import moment from 'moment';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, startWith } from 'rxjs/operators';
import { VitalParametersChartComponent } from '../vital-parameters-chart/vital-parameters-chart.component';
import { AddVitalParameterComponent } from '../add-vital-parameter/add-vital-parameter.component';




@Component({
	selector: 'app-vital-parameters',
	templateUrl: './vital-parameters.component.html',
	styleUrls: ['./vital-parameters.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalParametersComponent implements OnInit, OnChanges {

	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() closeMRMode = false;

	@ViewChild('ttip') ttip: VitalParametersChartComponent;
	@ViewChild('info') info: MatIcon;

	displayedColumns = ['NAME'];
	dataSource = new MatTableDataSource<VitalParameters>([]);
	loading = true;
	filter = new FormControl();
	vitalParameterValueSelection = new SelectionModel<string>(false);
	public profile: Profile;
	private _data: VitalParametersData[] = [];
	public validData: VitalParametersData[] = [];

	constructor(
		private _changeDetectorRef: ChangeDetectorRef,
		private readonly _vitalParametersService: VitalParametersService,
		private readonly _surveyService: SurveyService,
		private readonly _dialogService: DialogService,
		private readonly cd: ChangeDetectorRef,
		private readonly _profileService: ProfileService
	) {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.medicalRecord && changes.medicalRecord.firstChange && this.medicalRecord) {
			this.loadData();
		}
	}

	private loadData() {
		zip(this._vitalParametersService.findAll(), this.getSurveyList$(0, 100))
			.pipe(mergeMap(([pageParameterResponse, pageSurveyResponse]) => {
				const httpCalls: Observable<PageSurveyResponse>[] = [of(pageSurveyResponse)];
				let i = 1;
				while (i < pageSurveyResponse.totalPages || 0) {
					httpCalls.push(this.getSurveyList$(i, 100));
					i++;
				}

				const pagesurveeyResponses = forkJoin(httpCalls).pipe(map(m => {
					const ret = [];
					for (let i = 0; i < m.length; i++) {
						ret.push(...m[i].content || []);
					}
					return ret;
				}));

				return zip(of(pageParameterResponse), pagesurveeyResponses);
			})).subscribe(([pageParameterResponse, pageSurveyResponse]) => {
				//Distinct dei primaryparameter = 
				const primaryParameters = pageSurveyResponse.selectMany(sm => (sm.parameter || [])).filter(f => f.primaryParameter).groupBy(g => g.uuid);
				this._data = [...primaryParameters.map(m => {
					const surveys = pageSurveyResponse.filter(f => (f.parameter || []).find(f1 => f1.primaryParameter && f1.uuid == m.key));
					return new VitalParametersData(m.items.first(), surveys)
				})];


				this.setValidData();
				this.loading = false;
			})


	}

	private setValidData = (filter: string = null): void => {
		this.validData = [...this._data].filter(f => f.surveys.any() && f.surveys.find(f => f.parameter.filter(f => f.primaryParameter)));
		this._changeDetectorRef.markForCheck();
	}

	ngOnInit(): void {
		this.filter.valueChanges
			.pipe(
				startWith(''),
				debounceTime(500),
				distinctUntilChanged(),
				map((value: string) => value.toLowerCase()),
				mergeMap((value: string) => of(
					this.dataSource.data.filter(d => d.vitalParameter.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
				))
			)
			// tslint:disable-next-line: deprecation
			.subscribe(
				data => {
					this.loading = false;
					this.dataSource.data = data;
					this.cd.markForCheck();
				},
				() => {
					this.loading = false;
					this.cd.markForCheck();
				});

		this._profileService.profile$.subscribe(result => {
			this.profile = result;
		})
	}

	getSurveyList$(page: number, size: number) {
		return this._surveyService.list1(this.medicalRecord.id, page, size);
	}

	getValue(vitalMeasurement: VitalMeasurement) {
		return vitalMeasurement.parameter.values
			&& vitalMeasurement.parameter.values.length
			&& vitalMeasurement.parameter.values[0] || '';
	}

	getVitalMeasurements(element: VitalParameters) {
		return element.vitalMeasurements.filter(p => p.parameter.primaryParameter);
	}

	hasMultipleValues(vitalMeasurements: VitalMeasurement[]) {
		return vitalMeasurements.length
			&& vitalMeasurements.filter(v => v.parameter.values && v.parameter.values.length > 1).length > 0;
	}

	openChartDialog(data: VitalParametersData, survey?: SurveyResponse) {
		this._dialogService.show(VitalParametersChartComponent, {
			data: new VitalParametersChartData(this.medicalRecord, data, survey),
			panelClass: 'modal-xl'
		});
	}

	openAddDialog() {
		this._dialogService.show(AddVitalParameterComponent, {
			data: this.medicalRecord,
			panelClass: 'modal-md',
			callback: (result) => {
				if (result) {
					this.loadData();
				}
			}
		});
	}

	selectedParameters;
	over(surveyParameters) {
		if (surveyParameters && surveyParameters.parameter && surveyParameters.parameter.length > 0 ) {
			this.selectedParameters = surveyParameters.parameter;
		}
	}
	out() {
		this.selectedParameters = null;
	}
	// openTooltip(surveyParameters, tooltipSelected: InfoVitalParameterTtipComponent, maticoninfo: MatIcon) {
	//   tooltipSelected.isHidden = false;
	// }

	// closeToolTip(tooltipSelected: InfoVitalParameterTtipComponent) {
	//   tooltipSelected.isHidden = true;
	// }

}

