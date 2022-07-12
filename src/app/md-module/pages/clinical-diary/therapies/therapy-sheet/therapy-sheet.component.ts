import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AdministrationAggregateDto, AdministrationService, LocalTime, SutDto, TherapyService,  } from "app/services/api/atm";
import { BaseComponent } from "infrastructure/fidcare/components/common/base.component";
import { MatChipItem } from "infrastructure/fidcare/models/common.models";
import { DialogService } from "infrastructure/fidcare/services/dialog.service";
import * as moment from 'moment';
import { Router } from "@angular/router";
import { AdministrationDetailDialogComponent } from './administration-detail/administration-detail';
import { UniqueTherapySheet } from "app/md-module/models/unique-therapy-sheet";
import { MatTableDataSource } from "@angular/material/table";


@Component({
	selector: 'app-therapy-sheet',
	templateUrl: './therapy-sheet.component.html',
	styleUrls: ['./therapy-sheet.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TherapySheetComponent extends BaseComponent implements OnInit {
	public currentDate: moment.Moment;
	dateColumns = [];
	displayedColumns = [];
	dataSource: MatTableDataSource<UniqueTherapySheet>;
	loading = true;
	sut: SutDto;
	pathologies: MatChipItem<string>[] = [];
	allergies: MatChipItem<string>[] = [];
	time = '';
	weekIndex = 0;


	constructor(private _router: Router, private _dialogService: DialogService, private _therapyService: TherapyService, private _translateService: TranslateService,
		private _administrationService: AdministrationService, private readonly cd: ChangeDetectorRef) {
		super()
	}

	ngOnInit(): void {
		this.dateColumns = this.getCurrentWeek(moment());
    	this.displayedColumns = ['drug', 'via', 'quantity', ...this.dateColumns];
		this.currentDate = moment().clone().startOf('isoWeek');
		const monday = this.currentDate.valueOf();
		this.callSut(monday);
	}

	callSut(monday: number) {
		this._therapyService
		  .getSut(monday, history.state.id).subscribe(
			result => {
			  this.loading = false;
			  this.sut = result;
			  this.pathologies = result.pathologies.map(m => new MatChipItem(m));
			  this.allergies = result.allergies?.map(m => new MatChipItem(m.description));
			  this.sut.startDate = this.sut.startDate ? moment(this.sut.startDate).format('DD/MM/YYYY') : '';
			  this.sut.endDate = this.sut.endDate ? moment(this.sut.endDate).format('DD/MM/YYYY') : '';
			  if (this.sut.startDate && this.sut.endDate) {
				this.time = moment(this.sut.endDate, 'DD/MM/YYYY').diff(moment(this.sut.startDate, 'DD/MM/YYYY'), 'days').toString();
			  }
			  if (this.sut.administrations.length) {
				const tableElements = this.tableMapper(this.sut.administrations);
				this.dataSource = new MatTableDataSource(tableElements);
			  }
			  this.cd.markForCheck();
			});
	  }
	

	  tableMapper(administrations: Array<AdministrationAggregateDto>) {
		const tableElements: UniqueTherapySheet[] = [];
		let j = 0;
		for (let i = 0; i < administrations.length; i++) {
			let drugAdministration: string[] = [];
			j = i;
			for (const drug of administrations[i].drugs) {
				if(drugAdministration.indexOf(drug.drugName) === -1){
					if(drugAdministration.length != 0){
						j++;//is a new drug row in table
					}
					drugAdministration.push(drug.drugName);
					tableElements[j] = {} as UniqueTherapySheet;
					tableElements[j] = {
					drug: drug.drugName,
					via: administrations[i].administrationRoute,
					quantity: drug.quantity.toString()
					};
				}

			const columnDate = moment(drug.date).format('DD/MM/YYYY').toString();
			if (!Array.isArray(tableElements[j][columnDate])) {
			 	tableElements[j][columnDate] = [];
			}
			let time = moment(drug.administrationTime.toString(), [moment.ISO_8601, 'HH:mm']);
			tableElements[j][columnDate].push({ time: time.format('HH:mm'), type: drug.status, administationID: drug.administrationId, }); // status enum
			} 
		}
		return tableElements;
	  }

	getCurrentWeek(currentDate: moment.Moment) {
		const currentDays = [];
		const weekStart = currentDate.clone().startOf('isoWeek');
	
		for (let i = 0; i < 7; i++) {
		  currentDays.push(moment(weekStart).add(i, 'days').format('DD/MM/YYYY'));
		}
	
		return currentDays;
	  }
	

	public nextWeek = (): void => {
		this.dataSource = undefined;
		this.weekIndex++;
		const monday = moment(this.dateColumns[0], 'DD/MM/YYYY').add(1, 'week');
		this.dateColumns = this.getCurrentWeek(monday);
		this.displayedColumns = ['drug', 'via', 'quantity', ...this.dateColumns];
		this.callSut(monday.valueOf());	
	}

	public back = (): void => {
		this._router.navigate(['/md/clinical-diary'], { state: { data: history.state.data, closeMRMode: true } });
	}
	public previousWeek = (): void => {
		this.dataSource = undefined;
		this.weekIndex--;
		const monday = moment(this.dateColumns[0], 'DD/MM/YYYY').add(-1, 'week');
		this.dateColumns = this.getCurrentWeek(monday);
		this.displayedColumns = ['drug', 'via', 'quantity', ...this.dateColumns];
		this.callSut(monday.valueOf());

	}

	goToDetails(item) {
		this._administrationService
		  .getDetails(item.administationID).subscribe(
			result => {
			  this._dialogService.show(AdministrationDetailDialogComponent, {
				width: '1000px',
				data: {
				  result,
				}
			  })
			});
	  }
	
	  getSommClass(type: string) {
		switch (type) {
		  case 'Not Administered Rejected':
			return 'red-time';
		  case 'To Administer':
			return 'yellow-time';	
		  case 'Not Administered Time Window Expired':
			return 'red-time';
		  case 'Administered':
			return 'green-time';
		  case 'Not Administered Missed':
			return 'red-time';
		  case 'Unknown':
			return 'orange-time';
		  default:
			return 'to-somm';
		}
	  }
}