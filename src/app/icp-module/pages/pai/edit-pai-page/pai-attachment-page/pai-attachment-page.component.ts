import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { EditPaiAttachmentPageComponent } from './edit-pai-attachment-page/edit-pai-attachment-page.component';
import { PAIAttachment } from './../../../../services/model/pai.model';
import { BaseListTablePage } from 'app/icp-module/pages/base-list-table.page';
import { Component, Input, OnInit } from '@angular/core';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { PAIService } from 'app/icp-module/services/api/pai.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { Observable } from 'rxjs';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { iconDownload, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { Profile } from 'infrastructure/fidcare/models/profile.models';

@Component({
	selector: 'app-pai-attachment-page',
	templateUrl: './pai-attachment-page.component.html',
	styleUrls: ['./pai-attachment-page.component.css']
})
export class PaiAttachmentPageComponent extends BaseListTablePage<PAIAttachment> implements OnInit {

	public tableColumns: DataTableColumn[] = [];
	public tableActions: DataTableAction[] = [];
	public filters: Filters = new Filters();
	@Input() paiId: string;
	@Input() caseMangerId: string;
	@Input() patientId: string;
	@Input() history: boolean;
	@Input() reloadTable: Observable<void>;
	public canUpload: boolean;
	private _isCSanitario: boolean;
	private _initialized:boolean=false;


	constructor(
		private _paiService: PAIService,
		private _activatedRoute: ActivatedRoute,
		private _dialogService: DialogService,
		private _profileService: ProfileService

	) {
		super(_activatedRoute, true);



	}

	protected initialize = () => {
		this.reloadTable.subscribe(()=>{
			this.dataTableManager.startReload();
		});

		this._profileService.profile$.subscribe((user: Profile) => {
			this.canUpload = this.caseMangerId == user.userId || user.isCSanitario || user.userId == this.patientId;
			//posso vedere gli allegati e caricarli solo se sono il case manager
			//se sono il coordinatore sanitario oppure il paziente del pai
			this._isCSanitario=user.isCSanitario;
			if(!this._initialized){
				this.createColumms();
				this.createActions();
				this._initialized=true;
				this.dataTableManager.startReload();
			}
		});

	}




	private getDecoratedProfessionals = (): Observable<PAIAttachment[]> => {
		return this._paiService.listPAIAttachment(this.paiId);
	}


	protected getDataTableManager = (): ListTableManager<PAIAttachment> => {
		return new ListTableManager("to fix", this.getDecoratedProfessionals);
	}

	private createColumms = (): void => {
		let name = DataTableUtils.createStringColumn("documentName", "icp.pai.listPaiAttachment.nameLabel", false);
		this.tableColumns.push(name);

		let user = DataTableUtils.createStringColumn("userId", "icp.pai.listPaiAttachment.userLabel", false);
		this.tableColumns.push(user);
	}

	private createActions = (): void => {

		let button = new DataTableAction();
		button.funcToInvoke = this.delete;
		button.label = "common.delete";
		button.icon = iconTrash;
		button.enableFunc= ()=> this._isCSanitario;
		this.tableActions.push(button);

		button = new DataTableAction();
		button.funcToInvoke = this.download;
		button.label = "common.download";
		button.icon = iconDownload;
		this.tableActions.push(button);
	}

	public download = (row: PAIAttachment): void => {

	}

	public add = (): void => {
		this._dialogService.show(EditPaiAttachmentPageComponent, {
			panelClass: 'modal-lg',
			callback: this.refreshList,
			data: {
				paiId: this.paiId,
				caseManagerId: this.caseMangerId,
				patientId: this.patientId
			}
		});
	}

	private refreshList = (data?: any) => {
		this.dataTableManager.startReload();
	}

	public delete = (row: PAIAttachment): void => {
		let deleteCall = (res) => {
			if (res) {
				this._paiService.deletePAIAttachment(this.paiId, row.id).subscribe((result) => {
					this.refreshList()
				})
			}

		};
		this._dialogService.showConfirm("icp.pas.listPasActivity.deletePasActivityConfirmTitle", "icp.pas.listPasActivity.deletePasActivityConfirmDescription", { callback: deleteCall });

	}
}

class Filters {
}
