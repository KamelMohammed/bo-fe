import { SearchCriteria } from './../../../../infrastructure/fidcare/models/common.models';

export enum GlossaryType {
	PROFESSIONALS	= "PROFESSIONALS",
	CARE_LEVEL		= "CARE_LEVEL",
	CARE_PROFILE	= "CARE_PROFILE",
	SERVICE_TYPES	= "SERVICE_TYPES",
	PATHOLOGIES 	=	"PATHOLOGIES",
}

export class GlossaryElement {
	public id: string;
    public name: string;
	public type: GlossaryType;
}

export class GlossarySearchCriteria extends SearchCriteria{
	public type?: GlossaryType;
}

export class DetailedGlossaryElement extends GlossaryElement {
    public description: string;
}


export class CreateGlossaryElementCommand{
	public name: string;
	public description: string;
	public type: string;
}
