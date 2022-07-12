import { Session } from './pai-service-activiy-scheduling.model';
export class PatientiDiary {
    patientDiaryId:string;
    diaryServiceActivityDTOList:DiaryServiceActivityListItem[];
}

export class DiaryServiceActivity{
    id:string;
    date:Date;
    operatorFullName:string;
    expectedDuration:number;
    effectiveDuration:number;
    servicesId:string[];
    activitiesId:string[];
    notes:string;
    deleted:boolean;
}

export class DiaryServiceActivityListItem{
    id:string;
    date:Date;
    operatorFullName:string;
    expectedDuration:number;
    effectiveDuration:number;
    servicesName:string[];
    activitiesName:string[];
    notes:string;
    deleted:boolean;
    professionalName:string;
}


export class SaveDiaryServiceActivityCommand{
    public date:Date;
    public operatorId:string;
    public operatorName:string;
    public operatorSurname:string;
    public operatorEmail:string;
    public operatorFiscalCode:string;
    public careLevelProfessionalId:string;
    public servicesId:string[];
    public activitiesId:string[];
    public expectedDuration:number;
    public effectiveDuration:number;
    public notes: string;
    public id:string;

}

export class SaveAttachmentCommand{
    public userId:string;
    public documentName:string;
    public content:string;
}
