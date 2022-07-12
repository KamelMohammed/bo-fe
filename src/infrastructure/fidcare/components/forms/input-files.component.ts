import { Component, Input, Optional, Host, SkipSelf, Output, EventEmitter, ViewChild, forwardRef, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadData, FileUploadDateStatus } from './forms';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { FilesUtils } from '../../utils/files.utils';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';

@Component({
    selector: 'input-files',
    templateUrl: './input-files.component.html',
    styleUrls: ['./input-file.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputFilesComponent),
        multi: true,
    }]
})

export class InputFilesComponent extends BaseInputComponent<string[], string[]> {
    @Input() public url: string = null;
    @Input() public itemKey: string = "id";
    @Input() public accept: string[] = [];
    @Input() public download: (id: string) => Observable<string>;
    @Output() public fileState: EventEmitter<FileUploadData> = new EventEmitter<FileUploadData>();
    @ViewChild('fileInput', { static: true }) file;
    public get extensionAllowed() {
        return this.accept.any() ? this.accept.map(m => m.startsWith("." ? m : "." + m)).join(',') : null;
    }

    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, private _httpService: HttpService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }

    protected toInternalFormat(value: string[]): string[] {
        return value || [];
    }

    protected toExternalFormat(value: string[]): string[] {
        return value || [];
    }

    public downloadCallback(id: string): Observable<string> {
        return this.download(id);
    }

    public openDialog = (): void => {
        this.file.nativeElement.click();
    }

    public get isDisabled(): boolean {
        return this.control.disabled;
    }

    public onFilesSelected = (files: File[]): void => {
        let selectedFiles = [...files || []];
        let index = 0;

        //Prmo controllo tutte le estensioni
        for (let i = 0; i < selectedFiles.length; i++) {
            if (this.accept.any()) {
                let extensions = FilesUtils.getFilenameExtension(selectedFiles[i].name).toLowerCase();
                if (this.accept.indexOf(extensions) < 0) {
                    return;
                }
            }
        }

        for (let i = 0; i < selectedFiles.length; i++) {
            let file = selectedFiles[i];
            const fileData = new FileUploadData(index, file);
            fileData.status = FileUploadDateStatus.INPROGRESS;
            this.fileState.emit(fileData);
            this._httpService.uploadFile(this.url, file).subscribe(result => {
                this.value = [...this.value, result[this.itemKey]];
                fileData.status = FileUploadDateStatus.UPLOADED;
                fileData.response = result;
                this.fileState.emit(fileData);
                this.file.nativeElement.value = '';
            }, error => {
                fileData.status = FileUploadDateStatus.ERROR;
                fileData.response = error;
                this.fileState.emit(fileData);
                this.file.nativeElement.value = '';
            });
            index++;
        }
    }
    public remove(index: number): void {
        this.value.splice(index, 1)
        this.value = [...this.value];
    }
}