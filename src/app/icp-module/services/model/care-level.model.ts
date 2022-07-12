import { SearchCriteria } from '../../../../infrastructure/fidcare/models/common.models';
import { Sort } from '@angular/material/sort';

export class CareLevelListItem {
	public id: string;
    public name: string;
	public careProfileName: string;
    public levelName: string;
}

export class BaseCareLevel {
    public id: string;
    public name: string;
}

export class CareLevel extends BaseCareLevel {
    public careProfileId: string;
    public levelId: string;
}


export class CareLevelDetails extends CareLevel {
    public professionalsId: string[];
    public used: boolean;
}


export class Professional {
    public id: string;
    public professionalId: string;
    public frequency: string;
    public minAccessNumber: number;
    public maxAccessNumber: number;
    public duration: number;
}

export class ProfessionalListItem {
    public id: string;
    public professionalName: string;
    public frequency: string;
    public minAccessNumber: number;
    public maxAccessNumber: number;
    public duration: number;
}





export class CreateCarelevelCommand {
    public name: string;
    public level: string;
    public careProfile: string;
}

export class CreateProfessionalCommand {
    public professional: string;
    public frequency: string;
    public minAccessNumber: number;
    public maxAccessNumber: number;
    public duration: number;
}

export class CareLevelsSearchCriteria extends SearchCriteria {
    public level?: string;
    public global?: boolean;
}

export class ProfessionalsSearchCriteria extends SearchCriteria{
    public global?: boolean;
}
