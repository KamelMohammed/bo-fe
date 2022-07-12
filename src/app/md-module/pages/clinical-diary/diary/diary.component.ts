import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionEnum, ActionIconEnum } from 'app/md-module/models/md.model';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { ActivityControllerService, ActivityDTO } from 'app/services/api/dia';
import { Action } from 'app/shared/actions/actions.model';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { DatetimeUtils } from 'infrastructure/fidcare/utils/datetime.utils';
import { groupBy, orderBy } from 'lodash';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { ClinicalDiaryDataSource } from '../../../models/clinical-diary-table';
import { AddDiaryComponent } from './add-diary/add-diary.component';


@Component({
	selector: 'app-diary',
	templateUrl: './diary.component.html',
	styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {

	constructor(private _snackBarService: SnackBarService, private _dialogService: DialogService, private readonly translate: TranslateService, private readonly router: Router, private readonly diaservice: ActivityControllerService) {
	}

	@Input() medicalRecord?: MedicalRecordRequest;
	@Input() closeMRMode = false;
	@Input() readOnly = false;

	public displayedColumns: string[] = ['USER', 'TIME', 'NOTE', 'ACTIONS'];
	public displayedColumns2: string[] = ['USER-2', 'TIME-2', 'NOTE-2', 'ACTIONS-2'];

	public clinicalDiaryDataSources: ClinicalDiaryDataSource[];
	public loading = true;
	public form: FormGroup;
	private _data: ActivityDTO[] = [];



	ngOnInit() {

		if (this.closeMRMode || this.readOnly) {
			this.displayedColumns = this.displayedColumns.filter(c => c !== 'ACTIONS');
			this.displayedColumns2 = this.displayedColumns2.filter(c => c !== 'ACTIONS-2');
		}

		if (history.state.data) {
			this.medicalRecord = history.state.data;
		}

		this.loadData();
		this.form = new FormGroup({
			filter: new FormControl()
		});

		this.form.controls.filter.valueChanges.pipe(
			startWith(''),
			debounceTime(0),
			distinctUntilChanged())
			.subscribe(newValue => {
				this.buildData();
			})
	}

	loadData() {
		this.diaservice.getDiaAllActivityUsingGET(this.medicalRecord.id).subscribe(result => {
			this._data = result;
			this.loading = false;
			this.buildData();
		});
	}


	addClinicalDiary() {
		this._dialogService.show(AddDiaryComponent, {
			panelClass: 'modal-md',
			data: this.medicalRecord,
			callback: (result) => {
				if (result) {
					this.loadData();
				}
			}
		})
		//this.router.navigate(['/md/clinical-diary/add-clinical-diary'], { state: { data: this.medicalRecord, selectedIndex: 3 } });
	}

	delete(element: ActivityDTO) {
		if (!element.deleted) {
			this.diaservice.deleteDiaActivityUsingDELETE(element.operatorUuid, element.uuid)
				.subscribe(() => {
					this._snackBarService.success('md.CLINICAL_NOTE_DELETED');
					this._data.find(f => f.id == element.id).deleted = true;
					this.buildData();
				});
		}
	}

	buildData() {
		let data = [...this._data]
		const filter = this.form.value.filter || "";
		if (filter.length >= 1) {
			data = [...data.filter(f => f.activity.fullText(filter, false))];
		}
		const orderedByDate = orderBy(data, (d: ActivityDTO) => d.activityDate, ["desc"]);
		const groupedByDate = groupBy(orderedByDate, (d: ActivityDTO) => DatetimeUtils.toFullDate(d.activityDate));
		const groupedByDateKeys = Object.keys(groupedByDate);

		this.clinicalDiaryDataSources = [...groupedByDateKeys.map(date => ({ date, data: groupedByDate[date] }))];
	}

	getActions(element: ActivityDTO) {

		const activeButtons = [];
		if (!element.deleted) {
			const deleteAction: Action = {
				name: ActionEnum.DELETE,
				description: ActionEnum.DELETE,
				icon: ActionIconEnum.DELETE,
				click: () => this.delete(element)
			};
			activeButtons.push(deleteAction);
		}

		return activeButtons;
	}

}
