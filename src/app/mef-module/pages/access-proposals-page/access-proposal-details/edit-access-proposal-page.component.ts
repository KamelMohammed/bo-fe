import { AccessProposalEvaluateRequest, AccessProposalPuaRequest, AccessProposalRequest, AccessProposalResponse, AccessProposalStatus, AttachedFileResponse } from '../../../model/access-proposal.model';
import { AccessProposalService } from 'app/mef-module/services/access-proposal.service';
import { FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, map, Observable, of } from 'rxjs';
import { TemplateDocument } from 'app/mef-module/model/template-document.model';
import { TemplateDocumentService } from 'app/mef-module/services/template-document.service';
import { DataTableAction, DataTableColumn, ListTableManager } from 'infrastructure/fidcare/components/data-table/types';
import { DataTableUtils } from 'infrastructure/fidcare/utils/data-table.utils';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { iconDownload, iconReplace, iconTrash } from 'infrastructure/fidcare/utils/icons.utils';
import { UploadFileDialogComponent } from '../../documents-configuration/upload-file-dialog/upload-file-dialog.component';
import { Roles } from 'infrastructure/fidcare/models/profile.models';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { UviService } from 'app/mef-module/services/uvi.service';
import { Member, MemberStatus } from 'app/mef-module/model/uvi.model';
import { AuthService } from 'infrastructure/fidcare/services/auth.service';

@Component({
	selector: 'app-edit-access-proposal-page',
	templateUrl: './edit-access-proposal-page.component.html',
	styleUrls: ['./edit-access-proposal-page.component.scss']
})
export class EditAccessProposalPageComponent implements OnInit {

	@Input() medicalRecord: MedicalRecord;
	@Input() patientId: string;

	memershipToConfirm: boolean = false;
	enableMembershipUpdate = false;
	memershipRefused: boolean = false;
	loading: boolean = true;
	private history = false;
	public internalSelectedIndex: number = 0;
	public config: any;
	private readonly: boolean = false;
	myMembership: Member[] = [];

	public baseAccessProposalForm: FormGroup;
	created: boolean = false;
	accessProposalResponse: AccessProposalResponse;
	templateDocuments: TemplateDocument[] = [];
	public puaForm: FormGroup;

	public attachTableColumns: DataTableColumn[] = [];
	public attachTabledataTableManager: ListTableManager;
	public attachTabletableActions: DataTableAction[] = [];
	
	dateGTNowFilter = (d: Date | null): boolean => {
		if (d) {
			return moment().subtract(1, 'days').isBefore(d)
		}
		return true;
	};

	setPalliativeAccessProposal(value: boolean) {
		if (value) {
			this.baseAccessProposalForm.get("palliativeAccessProposal").patchValue(value);
			this.baseAccessProposalForm.get("protectDischarge").patchValue(false);
		}
		else {
			this.baseAccessProposalForm.get("palliativeAccessProposal").patchValue(false);
		}
	}
	setProtectDischarge(value: boolean) {
		if (value) {
			this.baseAccessProposalForm.get("palliativeAccessProposal").patchValue(false);
			this.baseAccessProposalForm.get("protectDischarge").patchValue(value);
		}
		else {
			this.baseAccessProposalForm.get("protectDischarge").patchValue(false);
		}
	}
	setComplexNeed(value: boolean) {
		if (value) {
			this.puaForm.get("complexNeed").patchValue(value);
			this.puaForm.get("simpleNeed").patchValue(false);
			this.puaForm.get("needNotPresent").patchValue(false);
			this.puaForm.get("proposalNotValid").patchValue(false);
		}
		else {
			this.puaForm.get("complexNeed").patchValue(false);
		}
	}

	setSimpleNeed(value: boolean) {
		if (value) {
			this.puaForm.get("complexNeed").patchValue(false);
			this.puaForm.get("simpleNeed").patchValue(value);
			this.puaForm.get("needNotPresent").patchValue(false);
			this.puaForm.get("proposalNotValid").patchValue(false);
		}
		else {
			this.puaForm.get("simpleNeed").patchValue(false);
		}
	}

	setNeedNodPresent(value: boolean) {
		if (value) {
			this.puaForm.get("complexNeed").patchValue(false);
			this.puaForm.get("simpleNeed").patchValue(false);
			this.puaForm.get("needNotPresent").patchValue(value);
			this.puaForm.get("proposalNotValid").patchValue(false);
		}
		else {
			this.puaForm.get("needNotPresent").patchValue(false);
		}

	}

	setProposalNotValid(value: boolean) {
		if (value) {
			this.puaForm.get("complexNeed").patchValue(false);
			this.puaForm.get("simpleNeed").patchValue(false);
			this.puaForm.get("needNotPresent").patchValue(false);
			this.puaForm.get("proposalNotValid").patchValue(value);
		}
		else {
			this.puaForm.get("proposalNotValid").patchValue(false);
		}
	}


	constructor(
		private _profileService: ProfileService,
		private _formBuilder: FormBuilder,
		private _accessProposalService: AccessProposalService,
		private _tempalteDocumentService: TemplateDocumentService,
		private _dialogRef: MatDialogRef<EditAccessProposalPageComponent>,
		private _dialogServide: DialogService,
		private _uviService: UviService,
		private _authService: AuthService
	) {
		
		
		this.prepareTable();
	}
	ngOnInit() {
		this.loading = true;
		this.history = this.config.data.history;
		this.readonly = this.config.data.readonly;
		this.baseAccessProposalForm = this._formBuilder.group({
			id: [],
			patientId: [(this.config.data)?.patientId, Validators.required],
			palliativeAccessProposal: [false],
			protectDischarge: [false],
			disability: [false]

		});
		this.puaForm = this._formBuilder.group({
			id: [null, Validators.required],
			protocolDate: [moment().toISOString(), Validators.required],
			protocolNumber: [null, [Validators.required, CommonValidators.regex("^[a-zA-Z0-9_.-]*$")]],
			complexNeed: [false],
			needNotPresent: [false],
			simpleNeed: [false],
			note: [null],
			proposalNotValid: [false],
		});

		let serviceToInvoke = { templatesList: this.initDocumentListTemplate() };

		if (this.config.data.id) {
			serviceToInvoke["currentAccessProposal"] = this._accessProposalService.detailsCurrent(this.config.data.id, this.config.data.history);
			if (!this.history)
				serviceToInvoke["uviMembers"] = this._uviService.getUviMembers(this.config.data.id);
		}

		forkJoin(serviceToInvoke)

			.subscribe((result: any) => {
				if (result.currentAccessProposal) {
					this.accessProposalResponse = result.currentAccessProposal;
					this.patchFormGroups();
				}
				if (result.uviMembers && result.uviMembers.members) {
					
					this.myMembership = result.uviMembers.members.filter((element:Member) => {
						return element.id == this._authService.getLoggedUserId();
					});
					if (this.myMembership && this.myMembership[0]) {
						this.memershipToConfirm = this.myMembership[0].state == MemberStatus.CONFIRMANT || this.myMembership[0].state == MemberStatus.REGISTRANT;
						this.memershipRefused = this.myMembership[0].state == MemberStatus.REFUSING;
						if (this.accessProposalResponse && this.accessProposalResponse.attachments) {
							let discovederSvamaD: boolean = false;
							this.accessProposalResponse.attachments.forEach((attach) => {
								discovederSvamaD = discovederSvamaD || attach.type == 'Svama D';
							})
							this.enableMembershipUpdate = !discovederSvamaD;
						}
					}
				}
				
				this.initAttachment();
				this.attachTabledataTableManager.startSearch();
				if (this.config.data.id) {
					this.created = true;
				}
				this.loading = false;

			},
			(error) => {
				console.log("Error...");
				
				this.loading = false;
			}
		)
	}

	public confirmMembership = () => {
		if (this.enableMembershipUpdate) {
			this.loading = true;
			this._uviService.acceptConvocation(this.config.data.id,this.myMembership[0].id).subscribe((result) => {
				this.ngOnInit();
			})
		}
		
	}
	public rejectConvocation = () => {
		if (this.enableMembershipUpdate) {
			this.loading = true;
			this._uviService.rejectConvocation(this.config.data.id,this.myMembership[0].id).subscribe((result) => {
				this.ngOnInit();
			})
		}
		
	}

	public canShowProposal = () => {
		return !this.loading && !this.memershipToConfirm && !this.memershipRefused;
	}

	private patchFormGroups = () => {
		this.baseAccessProposalForm.patchValue({
			id: this.accessProposalResponse.id,
			patientId: this.accessProposalResponse.patientId,
			palliativeAccessProposal: this.accessProposalResponse.palliativeAccessProposal,
			protectDischarge: this.accessProposalResponse.protectDischarge,
			disability: this.accessProposalResponse.disability
		})
		this.puaForm.patchValue({
			id: this.accessProposalResponse.id,
			protocolDate: this.accessProposalResponse.protocolDate,
			protocolNumber: this.accessProposalResponse.protocolNumber,
			complexNeed: this.accessProposalResponse.complexNeed,
			needNotPresent: this.accessProposalResponse.needNotPresent,
			simpleNeed: this.accessProposalResponse.simpleNeed,
			note: this.accessProposalResponse.note,
			proposalNotValid: this.accessProposalResponse.proposalNotValid
		})
	}

	private prepareTable = (): void => {
		let columns: DataTableColumn[] = [];
		let type = DataTableUtils.createStringColumn("type", "mef.accessProposal.details.typeLabel", true);
		columns.push(type);

		let reference = DataTableUtils.createStringColumn("fileReference", "mef.accessProposal.details.fileReferenceLabel", true);
		columns.push(reference);

		this.attachTableColumns.push(...columns);

		let downloadButton = new DataTableAction();
		downloadButton.funcToInvoke = this.downloadAttachment;
		downloadButton.label = "download";
		downloadButton.icon = iconDownload;
		this.attachTabletableActions.push(downloadButton)

		let deleteButton = new DataTableAction();
		deleteButton.funcToInvoke = this.deleteAttachment;
		deleteButton.label = "elimina";
		deleteButton.icon = iconTrash;
		deleteButton.enableFunc = (row) => { return this.canUpdateFiles };
		this.attachTabletableActions.push(deleteButton);


		let updateButton = new DataTableAction();
		updateButton.funcToInvoke = this.replaceAttachment;
		updateButton.label = "Aggiorna";
		updateButton.icon = iconReplace;
		updateButton.enableFunc = (row) => { return this.canUpdateFiles };
		this.attachTabletableActions.push(updateButton);

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
			this._accessProposalService.detailsCurrent(this.config.data.id)
				.subscribe((result) => {
					this.accessProposalResponse = result;
					this.initAttachment();
					this.attachTabledataTableManager.startSearch();
				})
		}

		this._dialogServide.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			data: {
				_templateDocumentService: this._accessProposalService,
				additionalParameters: {
					accessProposalId: this.accessProposalResponse.id
				}
			},
			callback: refreshAttachmentList,
		});
	}
	public replaceAttachment = (row: TemplateDocument): void => {
		let callBack = (data) => {
			if (data) {
				this.accessProposalResponse = data;
				this.initAttachment();
				this.attachTabledataTableManager.startSearch();	
			}

		}
		this._dialogServide.show(UploadFileDialogComponent, {
			panelClass: 'modal-lg',
			callback: callBack,
			data:{
				_templateDocumentService: this._accessProposalService,
				fileType:row.type,
				fileId:row.id,
				filteredFileType: [row.type],
				additionalParameters: {accessProposalId: this.accessProposalResponse.id, attachId: row.id}
			}
		});
		
	}
	public deleteAttachment = (row: AttachedFileResponse): void => {
		let remove = (confirm) => {
			if (confirm) {
				this._accessProposalService.detach({ accessProposalId: this.accessProposalResponse.id, attachId: row.id }).subscribe({
					next: (result) => {
						this.accessProposalResponse = result;
						// this.accessProposalResponse.attachments = this.accessProposalResponse.attachments.filter((element) => {
						// 	return element.id != row.id;
						// })
						this.initAttachment();
						this.attachTabledataTableManager.startSearch()
					},
					error: (message: string) => { console.log(message) }
				});


			}
		}
		this._dialogServide.showConfirm("Elimina documento", "Sei sicuro di voler eliminare il documento selezionato?", { callback: remove });
	}

	private initAttachment = () => {
		let attachments = () => { return of(this.accessProposalResponse && this.accessProposalResponse.attachments ? this.accessProposalResponse.attachments : []); }
		this.attachTabledataTableManager = new ListTableManager("1", attachments);
	}

	private initDocumentListTemplate = (): Observable<any> => {
		return this._tempalteDocumentService.list({ ascending: false, page: 0, size: 100, keySelector: "id" }).pipe(map((res) => {
			this.templateDocuments = res.content;
		}))
	}

	downloadDocumentTemplate = (template: TemplateDocument) => {
		this._tempalteDocumentService.download(template.id, template.fileName).subscribe((file) => {
			var data = new Blob([file], { type: 'application/bin' });
			var fileURL = URL.createObjectURL(data);
			window.open(fileURL);
		});
	}

	public get notesRequired(): boolean {
		let result = this.puaForm.value.complexNeed || this.puaForm.value.simpleNeed || this.puaForm.value.needNotPresent || this.puaForm.value.proposalNotValid;
		if (result) {
			this.puaForm.get("note").clearValidators();
			this.puaForm.get("note").addValidators(Validators.required);
		}
		else {
			this.puaForm.get("note").clearValidators();
		}
		return result;
	}

	public get valid(): boolean {
		return this.puaForm.valid;
	}

	public save() {
		if (this.canEditBaseFlags && this.canSave()) {
			if (this.baseAccessProposalForm.valid) {
				let command = new AccessProposalRequest();
				Object.assign(command, this.baseAccessProposalForm.value);
				this._accessProposalService.saveMMGPLS(command).subscribe((result: AccessProposalResponse) => {
					this.accessProposalResponse = result;
					this.patchFormGroups();
					this.initAttachment();
					this.attachTabledataTableManager.startSearch();
					this.config.data["id"] = result.id;
					this.created = true;
				})
			}
		}
		else if (this.canEditPuaData && this.canSave()) {
			let command = new AccessProposalEvaluateRequest();
			Object.assign(command, this.puaForm.value);
			this._accessProposalService.evaluate(command).subscribe((result: AccessProposalResponse) => {

				// this.accessProposalResponse = result;
				// this.patchFormGroups();
				// this.initAttachment();
				// this.attachTabledataTableManager.startSearch();
			})
		}



	}

	public close = (): void => {
		this._dialogRef.close(false);
	}

	public canSave() {
		return !this.readonly && ((this.canEditBaseFlags && this.baseAccessProposalForm.valid) || (this.canEditPuaData && this.puaForm.valid));
	}


	public get canEditPuaData() {
		return !this.readonly && (this.accessProposalResponse
			&& this.accessProposalResponse.status == AccessProposalStatus.TO_EVALUATE &&
			(this._profileService.isInRole(Roles.PUA_OPERATOR) || this._profileService.isInRole(Roles.CSANITARIO)));
	}
	public get canEditAdditionalPuaData() {
		return !this.readonly && (this.accessProposalResponse
			&& this.accessProposalResponse.status == AccessProposalStatus.TO_EVALUATE &&
			this._profileService.isInRole(Roles.CSANITARIO));
	}

	public get canEditBaseFlags() {
		return !this.readonly && this._profileService.isInRole(Roles.DOCTOR) && (!this.created || (this.accessProposalResponse &&
			(
				this.accessProposalResponse.status == AccessProposalStatus.SAVED ||
				this.accessProposalResponse.status == AccessProposalStatus.TO_SEND ||
				this.accessProposalResponse.status == AccessProposalStatus.REJECTED
			)));

	}
	public get canUpdateFiles() {
		return !this.readonly && (this.accessProposalResponse &&
			(
				this.accessProposalResponse.status == AccessProposalStatus.SAVED ||
				this.accessProposalResponse.status == AccessProposalStatus.TO_SEND ||
				this.accessProposalResponse.status == AccessProposalStatus.REJECTED
			));

	}

	public get proposalState() {
		if (this.accessProposalResponse) return 'enums.AccessProposalStatus.'+this.accessProposalResponse.status;
		return "";
	}
}
