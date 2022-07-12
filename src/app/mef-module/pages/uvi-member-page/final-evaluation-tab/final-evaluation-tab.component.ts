import { AccessProposalResponse, AccessProposalStatus } from '../../../model/access-proposal.model';
import { TemplateDocumentService } from 'app/mef-module/services/template-document.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Component, Input, OnInit } from '@angular/core';
import { TemplateDocument } from 'app/mef-module/model/template-document.model';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { forkJoin } from 'rxjs';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { AttachmentService } from 'app/mef-module/services/attachment-service.service-util';
import { NotificationMessage } from 'infrastructure/fidcare/models/common.models';
import { EventBusService } from 'infrastructure/fidcare/services/event-bus.service';

@Component({
	selector: 'app-final-evaluation-tab',
	templateUrl: './final-evaluation-tab.component.html',
	styleUrls: ['./final-evaluation-tab.component.scss']
})
export class FinalEvaluationTabComponent implements OnInit {

	@Input() medicalRecord: MedicalRecord;
	_accessProposalResponse: AccessProposalResponse;
	
	public canUploadD: boolean = false;
	public dataLoaded: boolean = false;

	public templateDocumentsD: TemplateDocument[] = [];

	documentServiceFileD;

	filteredDocumentsTypeD = ["Svama D"];
	

	constructor(
		private _profileService: ProfileService,
		private _templateDocumentService: TemplateDocumentService,
		private _accessProposalService: AccessProposalService,
		private _httpService: HttpService,
		private _eventBusService: EventBusService
	) {
		this.documentServiceFileD = new AttachmentService(this._httpService,"attachsvamd");
	}


	ngOnInit() {
		this._accessProposalService.detailsCurrentAccessProposalByPatient(this.medicalRecord.patient.id).subscribe((accessMinResponse) => {
			if (accessMinResponse && accessMinResponse.enumStatus == AccessProposalStatus.ACCEPTED_COMPLEX_NEED) {
				let servicesToInvoke = {
					template: this._templateDocumentService.list({ ascending: false, page: 0, size: 100, keySelector: "id" }),
					user: this._profileService.loadUserProfile(),
					accessProposal: this._accessProposalService.detailsCurrent(accessMinResponse.id)
				};
				forkJoin(servicesToInvoke).subscribe((result) => {
					
					
					
					this._accessProposalResponse = result.accessProposal;
					if (this._accessProposalResponse) {
						this.canUploadD = result.user.isCSanitario;
					
					}

					this.templateDocumentsD = result.template.content.filter(doc => {
						return doc.usedForEvaluation && this.filteredDocumentsTypeD.indexOf(doc.type)>=0;
					});
					
					this.dataLoaded = true;
				});
			}
			else {
				this.dataLoaded = true;
			}
		})
		
	}

	onAttachUpdates = ($event) => {
		let message: NotificationMessage = {
			code: "clinical-diary-update"
		}
		this._eventBusService.emit(message)
	} 

}
