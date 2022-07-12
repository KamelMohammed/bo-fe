import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { AccessProposalMinResponse, AccessProposalStatus } from 'app/mef-module/model/access-proposal.model';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { EventBusService } from 'infrastructure/fidcare/services/event-bus.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { MedicalRecord } from '../../models/md.model';

@Component({
	selector: 'app-clinical-diary',
	templateUrl: './clinical-diary.component.html',
	styleUrls: ['./clinical-diary.component.scss']
})
export class ClinicalDiaryComponent extends BaseComponent implements OnInit {
	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() isAlert = false;
	selectedIndex = 0;
	closeMRMode = false;
	@ViewChild('tabs') tabGroup: MatTabGroup;

	constructor(private readonly _profileService: ProfileService, private _mefService: AccessProposalService, private _eventBusService: EventBusService) {
		super()
	}


	ngOnInit(): void {
		// TODO: migliorare a modalità di passaggio di dati tra le pagine
		this._eventBusService.subscribe("clinical-diary-update", (message)=> {
			this.onMefUpdate(true);
		} );

		if (history.state.data) {
			this.medicalRecord = history.state.data;
			this.closeMRMode = history.state.closeMRMode;
			this.selectedIndex = history.state.selectedIndex ? history.state.selectedIndex : 0;
		}

		this.onMefUpdate(true);
	}

	onOutputMedicalRecord(event: MedicalRecord) {
		this.medicalRecord = event;
	}

	showUvi: boolean = false;
	showPai: boolean = false;
	showAccessProposalEvaluation: boolean = false;
	onMefUpdate = ($event: any) => {
		this._mefService.detailsCurrentAccessProposalByPatient(this.medicalRecord.patient.id).subscribe((result: AccessProposalMinResponse) => {
			if (result.enumStatus == AccessProposalStatus.ACCEPTED_COMPLEX_NEED) {
				this.showUvi = true;
				this.showPai = result.svamaDPresence;
				this.showAccessProposalEvaluation = true;

			}
			else {
				this.showUvi = false;
				this.showPai = false;
				this.showAccessProposalEvaluation = false;
			}

		}) 
	}
}
