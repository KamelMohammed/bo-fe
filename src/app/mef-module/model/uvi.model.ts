export class  UviMembers{
    public creationDate: Date;
    public id: string;
    public lastUpdate: Date;
    public members:Member[];
}

export enum MemberRole {
	MMG = "MMG",
	SOCIAL_COORDINATOR = "SOCIAL_COORDINATOR",
	HEALTCARE_COORDINATOR = "HEALTCARE_COORDINATOR",
	OTHER = "OTHER"
}
export enum MemberStatus {
	REGISTRANT="REGISTRANT",
	CONFIRMANT="CONFIRMANT",
	CONFIRMED="CONFIRMED",
	REFUSING="REFUSING"
}
export class Member{
    public email: string;
    public id:string;
    public mandatory:boolean;
    public name:string;
    public role:MemberRole;
    public state:MemberStatus;
    public surname:string;

}
