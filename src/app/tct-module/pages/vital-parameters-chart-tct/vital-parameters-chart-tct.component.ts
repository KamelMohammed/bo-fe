import { Survey, SurveyChart } from './../../models/survey-tct.model';
import { filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectListitem } from './../../../../infrastructure/fidcare/models/common.models';
import { SurveyTctService } from './../../services/survey-tct.service';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { VitalParametersChartData } from 'app/md-module/models/md.model';
import { ChartInfo } from 'app/tct-module/models/survey-tct.model';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';
import { orderBy } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';


declare var google: any;
@Component({
	selector: 'app-vital-parameters-chart-tct',
	templateUrl: './vital-parameters-chart-tct.component.html',
	styleUrls: ['./vital-parameters-chart-tct.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalParametersChartTctComponent implements AfterViewInit, OnInit {

	@ViewChild('chart') chart: ElementRef;
	private _freq: string[] = ["Mensile"]
	public freq: SelectListitem[] = [];
	public filterForm: FormGroup;
	public dataReady: boolean = false;
	private _surveyChart: SurveyChart[] = [];

	constructor(
		private readonly translate: TranslateService,
		public readonly dialogRef: MatDialogRef<VitalParametersChartTctComponent>,
		private readonly _surveyService: SurveyTctService,
		@Inject(MAT_DIALOG_DATA) public data: ChartInfo,
		private readonly _formBuilder: FormBuilder
	) { }
	ngOnInit(): void {
		if (this.data.activityName == "Cadute") {
			this._freq.push("Trimestrale");
		}
		if (this.data.activityName == "Frequenze cardiaca" || this.data.activityName == "Tempo inattività" || this.data.activityName == "Numero Passi") {
			this._freq.push("Settimanale");
			this._freq.push("Giornaliero");
		}
		this.freq = this._freq.map(f => new SelectListitem(f, f));
		this.filterForm = this._formBuilder.group({
			filter: [null, Validators.required]
		});

	}

	ngAfterViewInit(): void {
		this.filterForm.controls.filter.valueChanges.subscribe((freq) => {
			console.log("carico i dati");
			switch (freq) {
				case "Giornaliero":
					this._loadData(moment(), moment());
					break;
				case "Trimestrale":
					this._loadData(moment().subtract(3, 'months'), moment());
					break;
				case "Settimanale":
					this._loadData(moment().subtract(7, 'days'), moment());
					break;
				case "Mensile":
					this._loadData(moment().subtract(1, 'month'), moment());
					break;
			}
		});
		this.filterForm.controls.filter.patchValue("Mensile");
	}


	private _loadData(from: Moment, to: Moment) {
		this._surveyService.listHistory(this.data.medicalRecord.patient.id, this.data.activityId, from, to).subscribe((activities) => {
			this._surveyChart = [];
			for (let i = 0; i < activities.activities.length; i++) {
				let surveyChart = new SurveyChart();
				surveyChart.name = activities.activities[i].activity.name;
				surveyChart.symbol = activities.activities[i].activity.measurementUnit.symbol;
				surveyChart.activityId = activities.activities[i].activity.id;
				let surveys: Survey[] = [];
				for (let j = 0; j < activities.activities[i].surveys.length; j++) {
					let survey: Survey = new Survey();
					survey.measurementDate = activities.activities[i].surveys[j].measurementDate;
					survey.value = activities.activities[i].surveys[j].value;
					surveys.push(survey);
				}
				surveyChart.surveys = surveys;
				this._surveyChart.push(surveyChart);
			}
			this._buildGraph();
		});
	}

	private _buildGraph() {
		if (this._surveyChart && this._surveyChart.length != 0) {
			let columns: string[] = [];
			let rows: any[][] = [];
			let min: number = 0;
			let max: number = 0;
			columns.push(this.translate.instant("common.date"));
			columns.push(this._surveyChart[0].name);
			for (let i = 0; i < this._surveyChart[0].surveys.length; i++) {
				const item = this._surveyChart[0].surveys[i];
				const value = +item.value;
				if (min > value) {
					min = value;
				} if (max < value) {
					max = value;
				}
				rows.push([DatetimeUtils.toDateTime(item.measurementDate.toString()), value])
			}

			const array = [columns, ...orderBy(rows, r => r[0])];

			google.charts.load('current', { packages: ['corechart', 'line'] });
			google.charts.setOnLoadCallback(() => {
				const data = google.visualization.arrayToDataTable(array);
				const options = {
					chartArea: {
						height: '100%',
						width: '100%',
						top: 100,
						left: 100,
						bottom: 100,
						right: 100
					},
					height: '100%',
					width: '100%',
					legend: {
						position: 'top',
						alignment: 'start'
					},
					annotations: {
						textStyle: {
							fontSize: 14,
						}
					},
					vAxis: {
						textStyle: {
							fontSize: 14
						},
						viewWindow: {}
					},
					hAxis: {
						textStyle: {
							fontSize: 14
						},
						ticks: this.multiplesOf(rows.map((_V, i) => i), 10)
							.map(v => ({ v, f: `${v}` }))
					},
					seriesType: 'line',
				};
				options.vAxis.viewWindow = {
					max: max,
					min: min
				};

				const chart = new google.visualization.ComboChart(this.chart.nativeElement);
				chart.draw(data, options);
			});
		}
	}

	multiplesOf = (numbers: number[], num: number) => numbers.filter(n => n % num === 0);


	getTime(value: number) {
		const seconds = value / 250;

		return new Date(seconds * 1000).toISOString().substr(11, 8);
	}

	getPatientAge() {
		const ageDifMs = Date.now() - moment(this.data.medicalRecord.patient.birthDate).toDate().getTime();
		const ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
}
