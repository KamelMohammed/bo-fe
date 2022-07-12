import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { SearchResult } from 'infrastructure/fidcare/models/common.models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataTablePage } from 'app/icp-module/pages/base-data-table.page';
import { TemplateDocument, TemplateDocumentSearchCriteria } from 'app/mef-module/model/template-document.model';
import { UploadFileDialogComponent } from 'app/mef-module/pages/documents-configuration/upload-file-dialog/upload-file-dialog.component';
import { TemplateDocumentService } from 'app/mef-module/services/template-document.service';
import { DataTableAction, DataTableColumn, IDataTableManager, ListTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconDownload, iconTrash, iconReplace } from 'infrastructure/fidcare/utils/icons.utils';
import { result } from 'lodash';

@Component({
	selector: 'app-add-proposal-document-template-page',
	templateUrl: './add-proposal-document-template-page.component.html',
	styleUrls: ['./add-proposal-document-template-page.component.scss']
})
export class AddProposalDocumentTemplatePageComponent extends BaseListTablePage<TemplateDocument> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];

	constructor(
		_activatedRoute: ActivatedRoute,
		private _templateDocumentService: TemplateDocumentService,
		private _dialogServide: DialogService
	) {
		super(_activatedRoute, true);
	}

	protected initialize = () => {
		this.createColumms();
		this.createActions();
	}

	private _getDocuments=(): Observable<TemplateDocument[]>=>{
		let searchCriteria = new TemplateDocumentSearchCriteria();
		searchCriteria.ascending=true;
		searchCriteria.keySelector="";
		searchCriteria.page=0;
		searchCriteria.size=100;
		return this._templateDocumentService.list(searchCriteria)
		.pipe(map( (result: SearchResult<TemplateDocument>)=>result.content));
	}

	protected getDataTableManager = (): ListTableManager<TemplateDocument> => {
		return new ListTableManager("FormsPageComponent", this._getDocuments)
	}

	private createColumms = (): void => {
		let type = DataTableUtils.createStringColumn("type", "mef.templateDocument.listTemplateDocuments.typeLabel", true);
		this.tableColumns.push(type);

		let reference = DataTableUtils.createStringColumn("fileReference", "mef.templateDocument.listTemplateDocuments.fileReferenceLabel", true);
		this.tableColumns.push(reference);
	}

	private createActions = (): void => {
		let downloadButton = new DataTableAction();
		downloadButton.funcToInvoke = this.download;
		downloadButton.label = "download";
		downloadButton.icon = iconDownload;
		this.tableActions.push(downloadButton)

		let deleteButton = new DataTableAction();
		deleteButton.funcToInvoke = this.delete;
		deleteButton.label = "elimina";
		deleteButton.icon = iconTrash;
		this.tableActions.push(deleteButton)

		
		let replaceButton = new DataTableAction();
		replaceButton.funcToInvoke = this.replace;
		replaceButton.label = "sostituisci";
		replaceButton.icon = iconReplace;
		this.tableActions.push(replaceButton)

	}

	public download = (row: TemplateDocument): void => {
		this._templateDocumentService.download(row.id, row.fileName).subscribe((file) => {
			var data = new Blob([file], { type: 'application/pdf' })
			var fileURL = URL.createObjectURL(data);
			window.open(fileURL);
		});
	}

	public replace = (row: TemplateDocument): void => {
		this._dialogServide.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			callback: this._refreshList,
			data:{
				_templateDocumentService: this._templateDocumentService,
				fileType:row.type,
				fileId:row.id,
				filteredFileType: [row.type]
			}
		});
		
	}

	public delete = (row: TemplateDocument): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._templateDocumentService.delete(row.id).subscribe({
					next: () => this._refreshList,
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogServide.showConfirm("Elimina documento", "Sei sicuro di voler eliminare il documento selezionato?", { callback: remove });
	}

	public create = (): void => {
		this._dialogServide.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			callback: this._refreshList,
		});
	}

	private _refreshList = (): void => {
		this.dataTableManager.startReload();
	}

}

class Filters {
}
