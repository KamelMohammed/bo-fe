import { SearchCriteria } from './../../../infrastructure/fidcare/models/common.models';

export class AccessProposalSearchCriteria extends SearchCriteria{
	public state?: string;
	public name?: string;
	public surname?:string;
}


export class AccessProposalEvaluateRequest{
	id:	string; //Access proposal's uuid
	complexNeed: boolean;	
	needNotPresent: boolean; //Indicates that the need is not necessary
	note?: string; //Access proposal's note
	proposalNotValid: boolean; //Indicates that the Access proposal is not valid
	protocolDate: string; //The PROTOCOL date
	protocolNumber: string; //The access proposal's protocol number
	simpleNeed: boolean;
}

export enum AccessProposalStatus {
	SAVED="SAVED",
	TO_SEND="TO_SEND",
	TO_EVALUATE="TO_EVALUATE",
	REFUSED="REFUSED",
	REJECTED="REJECTED",
	ACCEPTED_COMPLEX_NEED="ACCEPTED_COMPLEX_NEED",
	ACCEPTED_SIMPLE_NEED="ACCEPTED_SIMPLE_NEED",
	CLOSE="CLOSE"
}
export enum TelevisitaStatus {
	REFIUSED = "REFIUSED",
	PRESENTED = "PRESENTED",
	SCADUTA = "SCADUTA"

}
export enum AccessProposalType {
	ACCESS_PROPOSAL="ACCESS_PROPOSAL",
	PALLIATIVE_ACCESS_PROPOSAL="PALLIATIVE_ACCESS_PROPOSAL"
}
export class AccessProposalMinResponse {
	enumStatus: AccessProposalStatus;
	id: string;
	lastUpdate:	string; //($date-time)
	note: string;
	patientId: string; //($uuid)
	patientName: string;
	patientSurname: string;
	proposalType: AccessProposalType;
	protocolNumber:	string;
	svamaAPresence:	boolean;
	svamaDPresence: boolean;
}

export class AccessProposalPuaRequest {
	id: string;
	protocolDate: string;
	protocolNumber: string;
}

export class AccessProposalRequest {
	id?: string;
	disability: boolean;
	palliativeAccessProposal: boolean;
	patientId: string;
	protectDischarge: boolean;
}


export class AccessProposalResponse {
	id: string;
	attachments: AttachedFileResponse[] = [];
	complexNeed: boolean;
	creationDate: string;
	disability: boolean;
	doctorId: string;
	lastUpdate: string; //$date-time)
	needNotPresent: boolean;
	note: string;
	palliativeAccessProposal: boolean;
	patientId: string;
	proposalNotValid:	boolean;
	protectDischarge:	boolean;
	protocolDate:	string; //($date)
	protocolNumber:	string;
	puaId:	string;
	puaLastUpdate:	string; //($date-time)
	simpleNeed:	boolean;
	status: AccessProposalStatus;
}


export class ActivityLogResponse {
	accessProposalId:	string; //($uuid)
	action:	string;
	activityDate:	string; //($date-time)
	field:	string;
	newValue:	string;
	oldValue:	string;
	user:	string;
}

export class AttachTypeResponse{
	code: string;
	description: string;
}

export class AttachedFileResponse {
	fileName: string;
	fileReference: string;
	id: string; //($uuid)
	type:string
}

export class Link{
	href: string;
	templated: boolean;
}

export class MemberRequest{
	id?:	string; //($uuid)	The member's Id
	email:	string; //The member's email
	name: string; //The member's name
	state?:	string; //The member's state
	surname: string; //The member's surname
}

export enum MemberRole {
	MMG="MMG",
	SOCIAL_COORDINATOR="SOCIAL_COORDINATOR",
	HEALTCARE_COORDINATOR="HEALTCARE_COORDINATOR",
	OTHER="OTHER"
}
export enum MemberStatus {
	REGISTRANT="REGISTRANT",
	CONFIRMANT="CONFIRMANT",
	CONFIRMED="CONFIRMED",
	REFUSING="REFUSING"
}
export class MemberResponse{
	id:	string;
	email: string
	mandatory:	boolean;
	name:	string
	role:	MemberRole;
	state:	MemberStatus;
	surname:string;
}

export enum UviMemberRole {
	MMG="MMG",
	SOCIAL_COORDINATOR="SOCIAL_COORDINATOR",
	HEALTCARE_COORDINATOR="HEALTCARE_COORDINATOR",
	OTHER="OTHER"
}
export class UviMemberRequest{
	id:	string; //UviMember's uuid
	name:	string; //UviMember's name
	surname: string; //UviMember's surname
	role:	UviMemberRole; //UviMember's role
	state: MemberStatus; //UviMember's state
}

export class UviAssociationRequest {
	uviMembers: UviMemberRequest[] = []
}
export class UviResponse{
	id:	string; //($uuid)
	creationDate: string; //($date)
	lastUpdate: string; //($date-time)
	members: MemberResponse[] = [];
}