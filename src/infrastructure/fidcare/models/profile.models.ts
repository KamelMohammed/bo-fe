export class Profile {
	public firstName: string;
	public lastName: string;
	public email: string;
	public userId: string;
	public roles: string[];

	private isInRole = (role: Roles): boolean => {
		return this.roles.includes(role.toLowerCase());
	}

	public get isUser() {
		return this.isInRole(Roles.USER);
	}

	public get isDoctor() {
		return this.isInRole(Roles.DOCTOR);
	}

	public get isPatient() {
		return this.isInRole(Roles.PATIENT);
	}

	public get isContact() {
		return this.isInRole(Roles.CONTACT);
	}

	public get isUsca() {
		return this.isInRole(Roles.USCA);
	}

	public get isOperator() {
		return this.isInRole(Roles.OPERATOR);
	}

	public get isSuperUsca() {
		return this.isInRole(Roles.SUPERUSCA);
	}

	public get isConfigurator() {
		return this.isInRole(Roles.CONFIGURATOR);
	}

	public get isAdministrator() {
		return this.isInRole(Roles.ADMINISTRATOR);
	}

	public get isCSanitario() {
		return this.isInRole(Roles.CSANITARIO);
	}

	public get isPUAOperator() {
		return this.isInRole(Roles.PUA_OPERATOR);
	}

	public get isCSociale() {
		return this.isInRole(Roles.CSOCIALE);
	}
}

export enum Roles {
	USER = 'user',

	PATIENT = 'patient',
	CONTACT = 'contact',
	USCA = 'usca',
	OPERATOR = 'operator',
	ADMINISTRATOR = 'administrator',
	SUPERUSCA = 'superusca',

	/**
	 * Dottore
	 * esempio di utente: doctor/pass
	 */
	DOCTOR = 'doctor',

	/**
	 * configuratore
	 * esempio di utente: admin/pass
	 */
	CONFIGURATOR = 'configurator',

	/**
	 * Coordinatore Sanitario
	 * esempio di c sanitario: casanitario/pass
	 */
	CSANITARIO = "csanitario",

	/**
	 * PUA Manager
	 */
	PUA_OPERATOR = "puaoperator",

	/**
	 * Coordinatore sociale
	 */
	CSOCIALE = "csociale"
}