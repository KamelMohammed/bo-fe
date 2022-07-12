import { SearchCriteria } from "infrastructure/fidcare/models/common.models";

export class ServiceActivity {
    public id: string;
    public duration: number;
    public activitiesId: string[];
    public servicesId: string[];
    public professionalId: string;
    public frequency:string;
}

export class ServiceActivityListItem {
    public id: string;
    public duration: number;
    public activitiesName: string[];
    public servicesName: string[];
    public professionalName: string;
    public frequency:string;
    public maxAccessNumber:number;
    public minAccessNumber:number;
    public alreadyScheduled:boolean;
}

export class ServiceActivityDetail extends ServiceActivity {
    public therapy: string;
    public minAccessNumber: number;
    public maxAccessNumber: number;
}


export class ServiceActivitySearchCriteria extends SearchCriteria {

}

export class SaveServiceActivityCommand {
    public duration: number;
    public minAccessNumber: number;
    public maxAccessNumber: number;
    public professionalId: string;
    public therapy: string;
    public activitiesId: string[];
    public servicesId: string[];
    public frequency:string;
}

export class UrlPortions {

    public collectionName: string;
    public itemId: string;
    public activityCollectionName: string;
    public activityId?: string;

}
