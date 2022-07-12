import { Activities, ChartInfo, Survey, SurveyChart } from './../../models/survey-tct.model';
import { SurveyTctService } from './../../services/survey-tct.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { VitalParametersService } from 'app/services/api/cpmbase';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { VitalParametersChartTctComponent } from '../vital-parameters-chart-tct/vital-parameters-chart-tct.component';


@Component({
	selector: 'app-vital-parameters-tct',
	templateUrl: './vital-parameters-tct.component.html',
	styleUrls: ['./vital-parameters-tct.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalParametersTctComponent implements OnInit {
	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() closeMRMode = false;

	@ViewChild('ttip') ttip: VitalParametersChartTctComponent;
	@ViewChild('info') info: MatIcon;

	displayedColumns = ['NAME'];
	dataSource = new MatTableDataSource<SurveyChart>([]);
	loading = true;
	filter = new FormControl();
	vitalParameterValueSelection = new SelectionModel<string>(false);
	public profile: Profile;
	private _currentSurveyResponse: Activities ;
	public surveyChart: SurveyChart[] = [];

	constructor(
		private _changeDetectorRef: ChangeDetectorRef,
		private readonly _vitalParametersService: VitalParametersService,
		private readonly _surveyService: SurveyTctService,
		private readonly _dialogService: DialogService,
		private readonly cd: ChangeDetectorRef,
		private readonly _profileService: ProfileService
	) {

	}

	private loadData() {
		this._surveyService.list(this.medicalRecord.patient.id).subscribe((activities) => {
			this.surveyChart=[];
			this._currentSurveyResponse = activities;
			for (let i = 0; i < activities.activities.length; i++) {
				let surveyChart = new SurveyChart();
				surveyChart.name=activities.activities[i].activity.name;
				surveyChart.symbol=activities.activities[i].activity.measurementUnit.symbol;
				surveyChart.activityId=activities.activities[i].activity.id;
				let surveys :Survey[]=[];
				for (let j = 0; j < activities.activities[i].surveys.length; j++) {
					let survey:Survey = new Survey();
					survey.measurementDate =activities.activities[i].surveys[j].measurementDate;
					survey.value=activities.activities[i].surveys[j].value;
					surveys.push(survey);
				}
				surveyChart.surveys=surveys;
				this.surveyChart.push(surveyChart);
			}
			this.loading=false;
			this.dataSource.data=this.surveyChart;
			this._changeDetectorRef.markForCheck();
		});
	}

	ngOnInit(): void {
		this.loadData();
		this._profileService.profile$.subscribe(result => {
			this.profile = result;
		})
	}

	openChartDialog(data: SurveyChart) {
		this._dialogService.show(VitalParametersChartTctComponent, {
			data: new ChartInfo(this.medicalRecord, data.activityId,data.name),
			panelClass: 'modal-xl'
		});
	}
}
