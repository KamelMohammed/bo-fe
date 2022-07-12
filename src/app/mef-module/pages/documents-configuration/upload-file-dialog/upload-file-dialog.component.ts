import { TemplateDocumentService } from '../../../services/template-document.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { UploadFileCommand } from 'app/mef-module/model/template-document.model';
import { forkJoin } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
	selector: 'mef-upload-file-dialog',
	templateUrl: './upload-file-dialog.component.html',
	styleUrls: ['./upload-file-dialog.component.scss']
})
export class UploadFileDialogComponent implements OnInit {

	public uploadFileForm: FormGroup;
	public fileTypes: SelectListitem[] = [];
	public canUploadFile:boolean = false;
	private _fileId:string;
	private _fileType:string;
	private _filteredFileType:string[];
	public config:any;
	public replaceMode:boolean=false;

	constructor(
		// private _templateDocumentService: TemplateDocumentService,
		private _formBuilder: FormBuilder,
		private _dialogRef: MatDialogRef<UploadFileDialogComponent>
	) {

	}

	private _fileChosen: File;
	fileErrorMessage: string = "";

	handleFileInput = ($event) => {
		this._fileChosen = null;
		this.fileErrorMessage = "";
		if ($event && $event.target && $event.target.files && $event.target.files.length > 0) {
			this._fileChosen = $event.target.files[0];
			if (this._fileChosen) {
				if (this._fileChosen.size > 10000000) {
					this._fileChosen = null;
					this.fileErrorMessage = "La dimensione del file non deve eccedere i 10MB";
				}
			}
		}
	}
	canSave = () => {
		return this.uploadFileForm && this._fileChosen && this.uploadFileForm.valid;
	}

	save = () => {
		if (this.uploadFileForm.isValid()) {
			let command: UploadFileCommand = this.uploadFileForm.value;
			command.file = this._fileChosen;
			if (this.config.data.additionalParameters) {
				for (let key in this.config.data.additionalParameters) {
					command[key] = this.config.data.additionalParameters[key];
				}
			}
			this.config.data._templateDocumentService.uploadFile(command).subscribe({
				next: (result) => this._dialogRef.close(result),
			});
		}
	}

	back = () => {
		this._dialogRef.close(false);
	}


	ngOnInit() {
		if (this.config && this.config.data) {
			this._fileId=this.config.data.fileId;
			this._fileType=this.config.data.fileType;
			this._filteredFileType = this.config.data.filteredFileType;
		}

		let form = this._formBuilder.group({
			id:[null],
			// file: [null, Validators.required],
			typeAttach: [null, Validators.required],
		});

		form.get("typeAttach").valueChanges.subscribe((result)=>{
			if(result){
				this.canUploadFile=true;
			}else{
				this.canUploadFile=false;
			}
		});
				
		this.config.data._templateDocumentService.listTemplateTypes().subscribe((result) => {
			this.fileTypes = result.map(m => new SelectListitem(m.code, m.description));
			if(this._fileId){
				this.replaceMode=true;
				this.fileTypes = this.fileTypes.filter((type)=>type.label==this._fileType);
				let codeType= this.fileTypes[0].id;
				form.get("typeAttach").patchValue(codeType);
				form.get("id").patchValue(this._fileId);
			}
			
			if (this._filteredFileType && this._filteredFileType.length>0) {
				this.fileTypes = this.fileTypes.filter((type)=>{					
					return this._filteredFileType.indexOf(type.label)>=0;
				});
			}
			this.uploadFileForm=form;
		});	
	}

	public get title(): string {
		return 'mef.templateDocument.uploadFile.title';
	}

}
