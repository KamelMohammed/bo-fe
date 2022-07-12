import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { VitalParametersChartData } from 'app/md-module/models/md.model';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';
import { orderBy } from 'lodash';
import * as moment from 'moment';

declare var google: any;


@Component({
	selector: 'app-vital-parameters-chart',
	templateUrl: './vital-parameters-chart.component.html',
	styleUrls: ['./vital-parameters-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalParametersChartComponent implements AfterViewInit {

	@ViewChild('chart') chart: ElementRef;

	constructor(
		private readonly translate: TranslateService,
		public readonly dialogRef: MatDialogRef<VitalParametersChartComponent>,
		@Inject(MAT_DIALOG_DATA) public data: VitalParametersChartData
	) { }

	ngAfterViewInit() {
		let columns: string[] = [];
		let rows: any[][] = [];
		let min: number = 0;
		let max: number = 0;
		columns.push(this.translate.instant("common.date"));
		columns.push(this.data.data.parameter.description);
		if(this.data.survey == null) {
			for (let i = 0; i < this.data.data.surveys.length; i++) {
				const item = this.data.data.surveys[i];
				const parameter = item.parameter.find(f => f.uuid == this.data.data.parameter.uuid);
				if (parameter && parameter.values.length == 1) {
					const value = +parameter.values.first();
					if (min > value) {
						min = value;
					} if (max < value) {
						max = value;
					}
					rows.push([DatetimeUtils.toDateTime(item.dateTime.toString()), value])
				} 
			}
		} else {
			let numVal = [];
			const parameter = this.data.survey.parameter.find(f => f.uuid == this.data.data.parameter.uuid);
			parameter.values.forEach((v, i) => {
				rows.push([i, Number(v)])
				numVal.push(Number(v))
			})

			max = Math.max(...numVal);
			min = Math.min(...numVal);

		}	

		const array = [columns, ...orderBy(rows, r => r[0])];

		google.charts.load('current', { packages: ['corechart', 'line'] });
		google.charts.setOnLoadCallback(() => {
			const data = google.visualization.arrayToDataTable(array);
			const options = {
				chartArea: {
					height: '100%',
					width: this.data.survey != null ? rows.length : '100%',
					top: 100,
					left: 100,
					bottom: 100,
					right: 100
				},
				height: '100%',
				width: this.data.survey != null ? rows.length : '100%',
				legend: {
					position: this.data.survey != null ? 'none' : 'top',
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
					ticks: this.multiplesOf(rows.map((_V, i) => i), this.data.survey != null ? 1250 : 10)
           			 .map(v => ({ v, f: `${this.data.survey != null ? this.getTime(v) : v}` }))

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
