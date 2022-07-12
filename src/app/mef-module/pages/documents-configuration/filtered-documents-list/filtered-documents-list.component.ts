import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseDataTablePage } from 'app/icp-module/pages/base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, ListTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { TemplateDocument, TemplateDocumentSearchCriteria } from 'app/mef-module/model/template-document.model';
import { TemplateDocumentService } from 'app/mef-module/services/template-document.service';
import { iconDownload, iconReplace, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { AccessProposalResponse, AttachedFileResponse } from 'app/mef-module/model/access-proposal.model';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';


@Component({
	selector: 'mef-filtered-documents-list',
	templateUrl: './filtered-documents-list.component.html'
})
export class FilteredDocumentsListPageComponent implements OnInit {

	public attachTableColumns: DataTableColumn[] = [];
	public attachTabletableActions: DataTableAction[] = [];
	public attachTabledataTableManagerB: ListTableManager;

	@Input() title = "";
	@Input() readonly: boolean = false;
	@Input() filteredFileType: string[] = undefined;
	@Input() documentService;
	@Input() accessProposal: AccessProposalResponse;
	@Input() templateDocuments: TemplateDocument[] = [];
	@Output() attachmentUpdates: EventEmitter<any> = new EventEmitter();
	get canUploadNewFile() {
		return	!this.readonly &&
				this.accessProposal &&
				this.accessProposal.attachments &&
				this.accessProposal.attachments.length>0 &&
				this.filteredFileType &&
				this.accessProposal.attachments.filter(p => {return this.filteredFileType.indexOf(p.type)>=0}).length < this.filteredFileType.length;
	}
	get _defaultTemplateDocumentService() {
		if (this.documentService) return this.documentService
		return this.defaultTemplateDocumentService;
	}
	constructor(
		// _activatedRoute: ActivatedRoute,
		private defaultTemplateDocumentService: TemplateDocumentService,		
		private _dialogService: DialogService,
		private _accessProposalService: AccessProposalService
	) {
		
	}

	protected initializeTable = () =>{
		this.createColumms();
		this.createActions();
	}

	ngOnInit() {
		this._initAttachment();
		this.initializeTable();
		this.attachTabledataTableManagerB.startSearch();
	}

	private _initAttachment = () => {
		let attachments;
		if (this.accessProposal && this.accessProposal.attachments) {
			attachments = () => {
				return of(this.filteredFileType && this.filteredFileType.length>0 ? 
					this.accessProposal.attachments.filter((element) => {return this.filteredFileType.indexOf(element.type) >= 0;  
			}) : this.accessProposal.attachments); }
		}
		else {
			attachments = () => { return of([])};
		}
		
		this.attachTabledataTableManagerB = new ListTableManager("1", attachments);
	}

	private createColumms = (): void => {
		let columns: DataTableColumn[] = [];
		let type = DataTableUtils.createStringColumn("type", "mef.accessProposal.details.typeLabel", true);
		columns.push(type);

		let reference = DataTableUtils.createStringColumn("fileReference", "mef.accessProposal.details.fileReferenceLabel", true);
		columns.push(reference);

		this.attachTableColumns.push(...columns);

	}

	private createActions = (): void => {
		let downloadButton = new DataTableAction();
		downloadButton.funcToInvoke = this.downloadAttachment;
		downloadButton.label = "download";
		downloadButton.icon = iconDownload;
		this.attachTabletableActions.push(downloadButton)


		let deleteButton = new DataTableAction();
		deleteButton.funcToInvoke = this.deleteAttachment;
		deleteButton.label = "elimina";
		deleteButton.icon = iconTrash;
		deleteButton.enableFunc = (row) => { return !this.readonly };
		this.attachTabletableActions.push(deleteButton);

		let updateButton = new DataTableAction();
		updateButton.funcToInvoke = this.replaceAttachment;
		updateButton.label = "Aggiorna";
		updateButton.icon = iconReplace;
		updateButton.enableFunc = (row) => { return !this.readonly };
		this.attachTabletableActions.push(updateButton);

	}



	public downloadDocumentTemplate = (template: TemplateDocument) => {
		this.defaultTemplateDocumentService.download(template.id, template.fileName).subscribe((file) => {
			var data = new Blob([file], { type: 'application/bin' });
			var fileURL = URL.createObjectURL(data);
			window.open(fileURL);
		});
	}

	public deleteAttachment = (row: AttachedFileResponse): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._accessProposalService.detach({ accessProposalId: this.accessProposal.id, attachId: row.id }).subscribe({
					next: () => {
						this.attachmentUpdates.emit(true);
						this.accessProposal.attachments = this.accessProposal.attachments.filter((element) => {
							return element.id != row.id;
						})
						this._initAttachment();
						this.attachTabledataTableManagerB.startSearch();
					},
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogService.showConfirm("Elimina documento", "Sei sicuro di voler eliminare il documento selezionato?", { callback: remove });
	}

	public replaceAttachment = (row: TemplateDocument): void => {
		let callBack = (data) => {
			if (data) {
				this.accessProposal = data;
				this.attachmentUpdates.emit(true);
				this._initAttachment();
				this.attachTabledataTableManagerB.startSearch();	
			}

		}
		this._dialogService.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			callback: callBack,
			data:{
				_templateDocumentService: this._defaultTemplateDocumentService,
				fileType:row.type,
				fileId:row.id,
				filteredFileType: [row.type],
				additionalParameters: {accessProposalId: this.accessProposal.id, attachId: row.id}
			}
		});
		
	}

	public downloadAttachment = (row: AttachedFileResponse): void => {
		this._accessProposalService.download({ id: row.id, fileName: row.fileName }).subscribe((file) => {
			var data = new Blob([file], { type: 'application/bin' });
			var fileURL = URL.createObjectURL(data);
			window.open(fileURL);
		});
	}

	public addAttachment = (): void => {
		let refreshAttachmentList = () => {
			this.attachmentUpdates.emit(true);
			this._accessProposalService.detailsCurrent(this.accessProposal.id)
				.subscribe((result) => {
					this.accessProposal = result;
					this._initAttachment();
					this.attachTabledataTableManagerB.startSearch();

				})
		};

		this._dialogService.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			data: {
				_templateDocumentService: this._defaultTemplateDocumentService,
				filteredFileType: this.filteredFileType,
				additionalParameters: {
					accessProposalId: this.accessProposal.id
				}
			},
			callback: refreshAttachmentList,
		});
	}

}

class Filters {
}
