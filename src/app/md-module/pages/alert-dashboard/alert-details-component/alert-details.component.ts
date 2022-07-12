import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MedicalRecord } from "app/md-module/models/md.model";


@Component({
	selector: 'md-alert-details',
	templateUrl: './alert-details.component.html',
	// styleUrls: ['./alert-dashboard.component.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDetailsComponent implements OnInit {
	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() isAlert = false;
	selectedIndex = 1;
	closeMRMode = false;

	constructor() {
	}


	ngOnInit(): void {
	}
}