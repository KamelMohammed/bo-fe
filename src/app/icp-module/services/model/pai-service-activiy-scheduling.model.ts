import { Moment } from 'moment';
import { Time } from '@angular/common';
export class Session {
    public id: string;
    public patient:string;
	public patientId: string;
    public operator:string;
    public date:Moment;
    public duration:number;
    public entryTime:Moment;
    public exitTime:Moment;
    public notes:string;
    public attachments:string[];
    public servicesId:string[];
    public activitiesId:string[];
}


export class ScheduleCommand{
    public operatorId:string;
    public dates:Date[];
    public operatorName:string;
    public operatorSurname:string;
    public operatorEmail:string;
    public operatorFiscalCode:string;
}

export class CloseSessionCommand{
    public entryTime: Time;
    public exitTime:Time;
    public notes:string;
    public duration:number;
}

export class ProvideNotProvideServiceActivityCommand{
    public provisionId:string;
    public date:Date;
    public notes:string;
    public duration:string;
}

export class Provision{
    public id:string;
    public name:string;
    public date:Date;
    public operator:string;
    public state:ProvisionState;
    public notes:string;
    public duration:number;
    public serviceId:string;
    public activityId:string;
}

export enum ProvisionState{
    PROVIDED="PROVIDED",
	NOT_PROVIDED="NOT_PROVIDED",
    NEW=""
    
}

export class SessionAttachment {
    public id:string;
    public userId:string;
    public documentName:string;
    public content:string;

}
