import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FilesUtils } from 'infrastructure/fidcare/utils/files.utils';
import { BaseComponent } from './base.component';


@Component({
    selector: 'upload-file',
    templateUrl: './upload-file.component.html'
})
export class UploadFileComponent extends BaseComponent {
    @Input() public accept: string[] = [];
    @Output() public onFileSelected: EventEmitter<File> = new EventEmitter<File>();
    @ViewChild('fileInput', { static: true }) file;
    public get extensionAllowed() {
        return this.accept.any() ? this.accept.map(m => m.startsWith("." ? m : "." + m)).join(',') : null;
    }

    public openDialog = (): void => {
        this.file.nativeElement.click();
    }

    public fileSelected = (files: File[]): void => {
        let selectedFiles = [...files || []];
        if (selectedFiles.length > 0) {
            //Controllo che l'estensione sia valida
            if (this.accept.any()) {
                let extensions = FilesUtils.getFilenameExtension(selectedFiles[0].name).toLowerCase();
                if (this.accept.indexOf(extensions) < 0) {
                    return;
                }
            }
            this.onFileSelected.emit(selectedFiles[0]);

        }
    }
}