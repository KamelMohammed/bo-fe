import { IcpAgeTemplate } from 'app/icp-module/services/model/icp-age.model';

import { MissedAdministrationRequest } from 'app/services/api/atm/model/missedAdministrationRequest';
import { AgendaDto } from '../../services/api/atm';
import { Field } from '../components/components.model';
import { Submission } from '../services';

export interface AgendaFormTO extends Submission {
	fields?: Field[];
	atmAgendaDto?: AgendaDto;
	icpAgendaDto?: IcpAgeTemplate;
}


export class AdministrationTherapyDialog {
	public patientId: string;
	public date: string
}

export class MissingAdministrationDialog {
	public id: string;;
	public patientUUID: string;
	public status: MissedAdministrationRequest.PtComponentNoteReadEnum;
}

export class MakeAdministrationDialog {
	public id: string;;
	public patientUUID: string;
	public status: MissedAdministrationRequest.PtComponentNoteReadEnum;
}

export class EditDrugNoteDialog {
	public id: string;;
	public patientUUID: string;
	public alreadyRead: boolean;
	public administrationNote: string;
	public drugNote: string;

}

export class AddDrugNoteDialog {
	public id: string;
}

