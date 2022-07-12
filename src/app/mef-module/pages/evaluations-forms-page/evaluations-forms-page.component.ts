import { TemplateDocumentService } from 'app/mef-module/services/template-document.service';
import { Component, Input, OnInit } from '@angular/core';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { forkJoin, Observable, of } from 'rxjs';
import { UploadFileDialogComponent } from 'app/mef-module/pages/documents-configuration/upload-file-dialog/upload-file-dialog.component';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconDownload, iconReplace, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { AccessProposalResponse, AccessProposalStatus, AttachedFileResponse } from 'app/mef-module/model/access-proposal.model';
import { TemplateDocument } from 'app/mef-module/model/template-document.model';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';
import { environment } from 'environments/environment';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { AttachmentService } from 'app/mef-module/services/attachment-service.service-util';


@Component({
	selector: 'app-evaluations-forms-page',
	templateUrl: './evaluations-forms-page.component.html',
	styleUrls: ['./evaluations-forms-page.component.scss']
})
export class EvaluationsFormsPageComponent implements OnInit {

	@Input() medicalRecord: MedicalRecord;
	_accessProposalResponse: AccessProposalResponse;
	
	public canUploadb: boolean = false;
	public canUploadc: boolean = false;
	public dataLoaded: boolean = false;

	public templateDocumentsB: TemplateDocument[] = [];
	public templateDocumentsC: TemplateDocument[] = [];

	documentServiceFileB;
	documentServiceFileC;

	filteredDocumentsTypeC = ["Svama C"]
	filteredDocumentsTypeB = [];
	

	constructor(
		private _profileService: ProfileService,
		private _templateDocumentService: TemplateDocumentService,
		private _accessProposalService: AccessProposalService,
		private _httpService: HttpService
	) {
		this.documentServiceFileB = new AttachmentService(this._httpService,"attachsvamb");
		this.documentServiceFileC = new AttachmentService(this._httpService,"attachsvamc");
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
						if (this._accessProposalResponse.disability)
							this.filteredDocumentsTypeB = ['Svamdi B'];
						else this.filteredDocumentsTypeB = ['Svama B'];

						this.canUploadb = result.user.isCSanitario;
						this.canUploadc = result.user.isCSociale;
					
					}

					this.templateDocumentsB = result.template.content.filter(doc => {
						return doc.usedForEvaluation && this.filteredDocumentsTypeB.indexOf(doc.type)>=0;
					});
					this.templateDocumentsC = result.template.content.filter(doc => {
						return doc.usedForEvaluation && this.filteredDocumentsTypeC.indexOf(doc.type)>=0;
					});

					this.dataLoaded = true;
				});
			}
			else {
				this.dataLoaded = true;
			}
		})
		
	}

}
