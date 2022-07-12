import { SearchCriteria } from './../../../infrastructure/fidcare/models/common.models';
export class TemplateDocumentSearchCriteria extends SearchCriteria {
}

export class TemplateDocument{
    public fileName:string;
    public fileReference:string;
    public id:string;
    public type:string;
	public usedForEvaluation?: boolean = false;
}

export class DownloadedTemplateDocument{
    public absolute:boolean;
    public absoluteFile: string;
    public absolutePath: string;
    public canonicalFile: string;
    public canonicalPath: string;
    public directory: boolean;
    public file: boolean;
    public freeSpace: number;
    public hidden: boolean;
    public name: string;
    public parent: string;
    public parentFile: string;
    public path: string;
    public totalSpace: number;
    public usableSpace: number;
}

export class TemplateType{
    public code:string;
    public description:string;
}

export class UploadFileCommand{
    public file: File;
    public typeAttach: string;
}
