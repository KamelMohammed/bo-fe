import { Sort } from "@angular/material/sort";
import { SearchCriteria } from '../../../../infrastructure/fidcare/models/common.models';

export class Service {
    public id: string;
    public service: string;
    public typeId: string;
    public accessCost: number;
    public professionalsId: string[];
}

export class ServiceListItem {
    public id: string;
    public service: string;
    public typeName: string;
    public accessCost: number;
    public professionalsName: string[];
    public duration: number;
    public professionalsId: string[];
}

export class ServiceDetails extends Service {
    public duration: number;

    constructor(id: string, service: string, type: string, accessCost: number, professional: string[]) {
        super();
        super.id = id;
        super.service = service;
        super.typeId = type;
        super.accessCost = accessCost;
        super.professionalsId = professional;
    }
}

export class CreateServiceCommand {
    public service: string;
    public accessCost: number;
    public duration: number;
    public professionalsId: string[];
    public typeId: string;
}

export class ServiceSearchCriteria extends SearchCriteria {
    public type?: string;
    public serviceName?:string;
}