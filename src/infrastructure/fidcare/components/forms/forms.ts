import { InjectionToken } from '@angular/core'

export const FORM_COMPONENTS_TOKEN = new InjectionToken<IFormComponents>('FormComponents');

export interface IFormComponents {
    appearance: string;
    floatLabel: string;
}

export class FileUploadData {
    public response: any = null;
    public status: FileUploadDateStatus = FileUploadDateStatus.TOBESTARTED;
    constructor(public id: number, public file: File) {

    }
}

export enum FileUploadDateStatus {
    TOBESTARTED = 0,
    INPROGRESS = 1,
    UPLOADED = 2,
    ERROR = 3
}