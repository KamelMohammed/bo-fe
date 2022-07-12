export class ProfileWrite {
	public firstName: string;
	public lastName: string;
	public email: string;

}

export class ChangePassword {
	public oldUserPassword: string;
	public newUserPassword: string;
	public confirmNewUserPassword: string;
}