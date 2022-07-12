import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MedicalRecordRequest, MedicalRecordService } from 'app/md-module/services/mrc';
import { ActiveAlertResourceService, AlertDto } from 'app/services/api/measurementrule';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { orderBy, uniq } from 'lodash';
import * as moment from 'moment';
import { interval, of, Subscription, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// import { PAGE_SIZE_OPTIONS } from '../../shared/constants';
const PAGE_SIZE_OPTIONS = [15, 30, 50, 80, 100];

export interface Alert {
	alert: AlertDto;
	medicalRecord?: MedicalRecordRequest;
}

@Component({
	selector: 'app-alert-dashboard',
	templateUrl: './alert-dashboard.component.html',
	styleUrls: ['./alert-dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDashboardComponent extends BaseComponent implements OnInit {

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	alerts: Alert[] = [];
	pageSizeOptions = PAGE_SIZE_OPTIONS;
	loading = true;
	expanded: number;
	readonly = true;
	newAlerts: Alert[] = [];
	medicalRecordFind: MedicalRecordRequest;
	timeinteval: Subscription;

	constructor(
		private readonly activeAlertResourceService: ActiveAlertResourceService,
		private readonly medicalRecordService: MedicalRecordService,
		private readonly cd: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {

		this.timeinteval = interval(15000)
			// tslint:disable-next-line: deprecation
			.subscribe({
				next: res => {
					this.getActiveAlerts();
				}
			});
		this.on(this.timeinteval);
		this.getActiveAlerts();
	}

	getActiveAlerts() {
		console.log("index: " + this.expanded);
		
		this.activeAlertResourceService
			.getActiveAlertsUsingGET(undefined, this.paginator.pageIndex, this.paginator.pageSize)
			.pipe(
				mergeMap((pageOfAlert, i) => {
					const medicalRecordIds = uniq((pageOfAlert.content || []).map(a => a.medicalRecordCode));
					const medicalRecords$ = medicalRecordIds.map(id => this.medicalRecordService.list9(id));
					return zip(of(pageOfAlert), medicalRecords$.length ? zip(...medicalRecords$) : of([]));
				})
			)
			// tslint:disable-next-line: deprecation
			.subscribe(
				([pageOfAlert, medicalRecords]) => {
					console.log("subscribe index: " + this.expanded);

					const alerts: Alert[] = (pageOfAlert.content || [])
						.map(alert => {
							const medicalRecord = medicalRecords.find(mr => (mr != null) && (mr.id === alert.medicalRecordCode));
							return { alert, medicalRecord };
						})
						.filter(alert => (alert.medicalRecord !== undefined) && (alert.medicalRecord.patient !== undefined));
					
						this.loading = false;
					this.alerts = alerts;
					this.cd.markForCheck();
					this.paginator.length = pageOfAlert.totalElements;
					// const newAlerts = orderBy(alerts, a => moment(a.alert.alertDate).unix(), 'desc');
					// if (newAlerts.length > this.newAlerts.length) {
					// 	this.newAlerts = newAlerts;
					// }
					// if (this.alerts.length <= this.newAlerts.length) {
					// 	this.alerts = this.newAlerts;
					// 	this.paginator.length = pageOfAlert.totalElements;
					// 	this.cd.markForCheck();
					// }
				},
				() => {
					this.loading = false;
					this.cd.markForCheck();
				});
	}

	change(event: MatSlideToggleChange, alert: Alert) {
		this.loading = true;
		this.activeAlertResourceService.deactiveActiveAlertUsingPOST(alert.alert.id)
			// tslint:disable-next-line: deprecation
			.subscribe(
				() => {
					this.loading = false;
					this.alerts = [...this.alerts.filter(a => a.alert.id !== alert.alert.id)];
					this.cd.markForCheck();
				},
				() => {
					this.loading = false;
					this.cd.markForCheck();
				}
			);
	}

	setExpanded(index: number) {
		console.log("setExpanded " + index);
		
		this.expanded = index;
	}

	getMedicalRecord(alert: Alert): MedicalRecordRequest {
		return alert.medicalRecord;
	}

	onPageChange(event: PageEvent) {
		this.loading = true;
		this.getActiveAlerts();
	}
}
