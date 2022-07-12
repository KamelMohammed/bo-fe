// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const API_BASE_PATH = 'https://fidcaresvil.kiranet.it';

export const environment = {
	production: false,
	authentication: {
		issuer:  `${API_BASE_PATH}/auth/realms/kiranet`,
		silentRefreshRedirectUri: "/assets/authentication/silent-refresh.html",
		clientId: "frontend",
		responseType: "code",
		scope: "openid profile roles phone address",
		redirectUri: null,
		postLogoutRedirectUri: null,

	},
	forms: {
		"appearance": "outline",
		"floatLabel": "auto"
	},
	culture: {
		resourcePaths: [
			"./assets/i18n/{code}.json",
			"./app/age-module/assets/i18n/age-{code}.json",
			"./app/icp-module/assets/i18n/icp-{code}.json",
			"./app/md-module/assets/i18n/md-{code}.json",
			"./app/aed-module/assets/i18n/aed-{code}.json",
			"./app/mef-module/assets/i18n/mef-{code}.json",
			"./app/tct-module/assets/i18n/tct-{code}.json"
		],
		cultureCodes: [
			"en",
			"it"
		],
		defaultCultureCode: "it"
	},
	services: {
		api: {
			serviceBasePath: `${API_BASE_PATH}`,
			mefBasePath:`${API_BASE_PATH}/api/mef`,
			icpBasePath: `${API_BASE_PATH}/api/icp`,
			// icpBasePath:  "https://api-gateway.officinaedisanto.cloud/fidcare-api",
			profileBasePath: `${API_BASE_PATH}/api/pas`,

			cdr: `${API_BASE_PATH}/api/cdr`,
			measurementruleBasePath: `${API_BASE_PATH}/api/measurementrule`,
			vitalMeasurementBasePath: `${API_BASE_PATH}/api/patientmeasurement/api`,
			diaBasePath: `${API_BASE_PATH}/api/dia`,
			medicalRecordBasePath: `${API_BASE_PATH}/api/mrc`,
			cpmBaseBasePath: `${API_BASE_PATH}/api/cpmbase`,
			atmBasePath: `${API_BASE_PATH}/api/atm`,
			aedBasePath: `${API_BASE_PATH}/api/aed`,
			pasBasePath: `${API_BASE_PATH}/api/pas`,
			ddrBasePath: `${API_BASE_PATH}/api/ddr`,
			ageBasePath: `${API_BASE_PATH}/api/age`,
			tctBasePath:`${API_BASE_PATH}/api/tct`,
		}
	}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
