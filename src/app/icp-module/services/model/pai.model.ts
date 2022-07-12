import { SearchCriteria } from '../../../../infrastructure/fidcare/models/common.models';

export class PAI{
    public id:string;
    public name:string;
    public careLevelId:string;
    public startDate:Date;
    public endDate:Date;
    public state:string;
    public caseManagerId:string;
    public caseManager:string;
}

export class PAIListItem{
    public id:string;
    public name:string;
    public careLevelName:string;
    public startDate:Date;
    public endDate:Date;
    public state:string;
    public caseManagerFullName:string;
    public caseManagerId:string;
    public patientFiscalCode: string;
    public canApprove:boolean;
}


export class PAIDetails extends PAI{
    public pasId:string;
    public duration:number;
    public target:string;
    public healthAssessment:string;
    public functionalAssessment:string;
    public rehabilitationAssessment:string;
    public socioRelationalAssessment:string;
    public pathologiesId:string[];
    public expectedGEA:number;
    public expectedCIA:number;
    public expectedGdC:number;
    public effectiveGEA:number;
    public effectiveCIA:number;
    public effectiveGdC:number;
    public patientFiscalCode: string;
    public state:string;
}


export class PAIAttachment {
    public id:string;
    public userId:string;
    public documentName:string;
    public content:string;

}


export class PAISearchCriteria extends SearchCriteria{
    public patientFiscalCode?: string;
    public history?:boolean;
    public state?: string;
    public current?: boolean;
}

export class PAIUpdateStateCommand {
    activate?:boolean;
    reactivate?:boolean;
    approve?:boolean;
    terminate?:boolean;
}

export class SavePAICommand {
    public patientFiscalCode:string;
    public patientName:string;
    public patientSurname:string;
    public patientEmail:string;
    public patientId:string;
    public name:string;
    public careLevelId:string;
    public startDate:Date;
    public endDate:Date;
    public pasId:string;
    public duration:number;
    public target:string;
    public healthAssessment:string;
    public functionalAssessment:string;
    public rehabilitationAssessment:string;
    public socioRelationalAssessment:string;
    public pathologiesId:string[];
    public expectedGEA:number;
    public expectedCIA:number;
    public expectedGDC:number;
}

export class ElectCaseManagerCommand{
    public doctorId:string;
    public doctorEmail:string;
    public doctorName:string;
    public doctorSurname:string;
    public doctorFiscalCode:string;
}

export class PAIAttachmentCommand{
    public uviMemeberId:string;
    public uviMemberName:string;
    public uviMemberSurname:string;
    public uviMemberEmail:string;
    public uviMemberFiscalCode:String;
    public documentName:string;
    public content:string;
}

export class DefineEvaluationCommand{
    public uviMemberId:string;
    public uviMemberName:string;
    public uviMemberSurname:string;
    public uviMemberEmail:string;
    public uviMemberFiscalCode:string;
    public date:Date;
    public evaluation:string
}

export class DisapproveInterruptPAICommand{
    public startDate:Date;
    public motivationalNote:string;
    public caseManagerId:string;
    public caseManagerName:string;
    public caseManagerSurname:string;
    public caseManagerEmail:string;
    public caseManagerFiscalCode:string;
    public action:string;
}

export class SuspendPAICommand{
    public startDate:Date;
    public endDate:Date;
    public duration:number;
    public motivationalNote:string;
    public caseManagerId:string;
    public caseManagerName:string;
    public caseManagerSurname:string;
    public caseManagerEmail:string;
    public caseManagerFiscalCode:string;
    public action:string;
}

export class PAINote{
    public id:string;
    public startDate:Date;
    public endDate:Date;
    public duration:number;
    public motivationalNote:string;
    public action:string;
    public caseManagerFullName:string;
}

export enum NoteType{
    SUSPEND="SUSPEND",
    STOP="STOP",
    DISAPPROVE="DISAPPROVE"
}

export class Patient{
    public patientName:string;
    public patientSurname:string;
    public patientId:string;
    public patientFiscalCode:string;
    public patientEmail:string;
}

export class Evaluation{
    public id:string;
    public uviMemberId:string;
    public uviMemberFullName:string;
    public date:Date;
    public evaluation:string;
}

export enum EvaluationType{
    finalevaluation="finalevaluations",
    midtermevaluation="midtermevaluations",
}
