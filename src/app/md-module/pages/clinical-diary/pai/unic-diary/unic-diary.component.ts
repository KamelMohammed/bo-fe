import { Profile } from '../../../../../../infrastructure/fidcare/models/profile.models';
import { EditDiaryServiceActivityComponent } from './edit-diary-service-activity/edit-diary-service-activity.component';
import { DialogService } from '../../../../../../infrastructure/fidcare/services/dialog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnicDiaryService } from '../../../../../icp-module/services/api/unic-diary.service';
import { DiaryServiceActivityListItem, PatientiDiary } from '../../../../../icp-module/services/model/patient-diary.model';
import { Component, Input, OnInit } from '@angular/core';
import { groupBy, orderBy } from 'lodash';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import moment from 'moment';


@Component({
	selector: 'app-unic-diary',
	templateUrl: './unic-diary.component.html',
	styleUrls: ['./unic-diary.component.scss']
})
export class UnicDiaryComponent implements OnInit {



	public filterForm: FormGroup;
	private _user: Profile;
	public loading = true;
	private _data: DiaryServiceActivityListItem[] = [];
	public dataTable: Map<string, DiaryServiceActivityListItem[]>;
	@Input() private patientFiscalCode: string;
	private patientDiaryId: string;
	public careTeam: boolean = true;

	constructor(
		private _diaryService: UnicDiaryService,
		private _formBuilder: FormBuilder,
		private _dialogService: DialogService,
		private _profileService: ProfileService) {
	}




	ngOnInit() {
		this.loadData();
		this.filterForm = this._formBuilder.group({
			filter: [null],
			dateFilter: [null]
		});

		this.filterForm.controls.filter.valueChanges.pipe(
			startWith(''),
			debounceTime(0),
			distinctUntilChanged())
			.subscribe(newValue => {
				this.buildData();
			}
			);

		this.filterForm.controls.dateFilter.valueChanges.pipe(
			debounceTime(0),
			distinctUntilChanged())
			.subscribe(newValue => {
				this.buildData();
			}
			);

		this._profileService.loadUserProfile().subscribe((user) => {
			this._user = user;
		});

	}

	updateData() {
		this.loadData();
	}


	addDiaryServicesActivity() {
		this._dialogService.show(EditDiaryServiceActivityComponent, {
			panelClass: 'modal-lg',
			data: {
				patientDiaryId: this.patientDiaryId,
				operatorId: this._user.userId,
			},
			callback: (result) => {
				if (result) {
					this.loadData();
				}
			}
		});

	}


	public loadData() {
		this._diaryService.getPatientDiary(this.patientFiscalCode).subscribe({
			next: (result: PatientiDiary) => {
				this._data = result.diaryServiceActivityDTOList;
				this.loading = false;
				this.patientDiaryId = result.patientDiaryId;
				this.buildData();
			},
			error: (message: string) => {
				this.loading = false;

			},
			complete: () => {
				this.loading = false;
			}
		});
	}

	public buildData() {
		this.dataTable = new Map<string, DiaryServiceActivityListItem[]>();
		let data = [...this._data];
		const filter = this.filterForm.value.filter || "";
		if (filter.length >= 1) {
			data = [...data.filter(f => f.operatorFullName.fullText(filter, false))];
		}

		const dateFilter = this.filterForm.value.dateFilter;
		if (dateFilter) {
			data = [...data.filter(f => moment(f.date).isSame(moment(dateFilter),'day'))];

		}
		const orderedByDate = orderBy(data, (d: DiaryServiceActivityListItem) => d.date, ["desc"]);
		const groupedByDate = groupBy(orderedByDate, (d: DiaryServiceActivityListItem) => d.date);
		const groupedByDateKeys = Object.keys(groupedByDate);
		groupedByDateKeys.forEach(date => this.dataTable.set(date, groupedByDate[date]));
	}


}