import { iconDownload, iconTrash, iconReplace } from '../../../../infrastructure/fidcare/utils/icons.utils';
import { TemplateDocumentService } from '../../services/template-document.service';
import { TemplateDocument, TemplateDocumentSearchCriteria } from '../../model/template-document.model';
import { Component, Input, OnInit } from '@angular/core';
import { BaseDataTablePage } from 'app/icp-module/pages/base-data-table.page';
import { DataTableAction, DataTableColumn, IDataTableManager, RemoteDataTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { UploadFileDialogComponent } from './upload-file-dialog/upload-file-dialog.component';

@Component({
	selector: 'mef-documents-list-page',
	templateUrl: './documents-list-page.component.html',
	styleUrls: ['./documents-list-page.component.scss']
})
export class DocumentsListPageComponent extends BaseDataTablePage<TemplateDocument, Filters> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];

	constructor(
		_activatedRoute: ActivatedRoute,
		private _templateDocumentService: TemplateDocumentService,
		private _dialogServide: DialogService
	) {
		super(_activatedRoute, true);
	}

	protected initialize = () =>{
		this.createColumms();
		this.createActions();
	}

	protected getDataTableManager = (searchCriteria: TemplateDocumentSearchCriteria): IDataTableManager<TemplateDocument> => {
		return new RemoteDataTableManager("FormsPageComponent", this._templateDocumentService.list, this.setSearchCriteria, searchCriteria)
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
		this.tableActions.push(downloadButton);

		let deleteButton = new DataTableAction();
		deleteButton.funcToInvoke = this.delete;
		deleteButton.label = "elimina";
		deleteButton.icon = iconTrash;
		this.tableActions.push(deleteButton);

		let updateButton = new DataTableAction();
		updateButton.funcToInvoke = this.replace;
		updateButton.label = "Aggiorna";
		updateButton.icon = iconReplace;
		this.tableActions.push(updateButton);

	}

	public download = (row: TemplateDocument): void => {
		this._templateDocumentService.download(row.id, row.fileName).subscribe((file) => {
			var data = new Blob([file], { type: 'application/bin' });
			var fileURL = URL.createObjectURL(data);
			window.open(fileURL);
		});
	}

	public delete = (row: TemplateDocument): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._templateDocumentService.delete(row.id).subscribe({
					next: () => this.dataTableManager.startSearch(),
					error: (message: string) => { console.log(message) }
				});
			}
		}
		this._dialogServide.showConfirm("Elimina documento", "Sei sicuro di voler eliminare il documento selezionato?", { callback: remove });
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


	public create = (): void => {
		this._dialogServide.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			data: {
				_templateDocumentService: this._templateDocumentService
			},
			callback: this._refreshList,
		});
	}

	private _refreshList = (): void => {
		this.dataTableManager.startReload();
	}

}

class Filters {
}
