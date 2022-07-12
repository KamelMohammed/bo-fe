import { SearchCriteria } from '../../../../infrastructure/fidcare/models/common.models';
export class PAS {

    public id: string;
    public name: string;
    public careLevelId: string;
    public pathologiesId: string[];
    public active: boolean;
}

export class PASListItem {

    public id: string;
    public name: string;
    public careLevelName: string;
    public pathologiesName: string[];
    public active: boolean;
    public servicesActivityNumber: number;
}

export class PASSearchCriteria extends SearchCriteria {
    public active?: boolean;

}

export class SavePASCommand {
    public name: string;
    public careLevelId: string;
    public pathologies: string[];
}


