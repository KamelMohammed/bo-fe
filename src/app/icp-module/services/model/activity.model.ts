import { SearchCriteria } from '../../../../infrastructure/fidcare/models/common.models';

export class Activity {
    public id: string;
    public typeId: string;
    public activity: string;
    public accessCost: number;
    public duration: number;
    public professionalsId: string[];
}

export class ActivityListItem {
    public id: string;
    public typeName: string;
    public activity: string;
    public accessCost: number;
    public duration: number;
    public professionalsName: string[];
    public professionalsId: string[];
}

export class CreateActivityCommand {
    public typeId: string;
    public activity: string;
    public accessCost: number;
    public duration: number;
    public professionalsId: string[];
}


export class ActivitySearchCriteria extends SearchCriteria {
    public type?: string;
    public activityName?:string;
}
