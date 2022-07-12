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
		postLogoutRedirectUri: null
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
			icpBasePath: "https://api-gateway.officinaedisanto.cloud/fidcare-api",
			mefBasePath: "https://api-gateway.officinaedisanto.cloud/fidcare-mef-api",
			// mefBasePath:`${API_BASE_PATH}/api/mef`,
			
			// profileBasePath: "http://fidcarefe.dev.kiranet.it/api/pas",
			// icpBasePath: "https://fidcaresvil.kiranet.it",
			serviceBasePath: `${API_BASE_PATH}`,
			profileBasePath: `${API_BASE_PATH}/api/pas`,
			tctBasePath:`${API_BASE_PATH}/api/tct`,
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
		}
	}
};

// export const environment = {
// 	production: false,
// 	authentication: {
// 		issuer: "https://91.121.169.44:19090/auth/realms/fidicp",
// 		silentRefreshRedirectUri: "/assets/authentication/silent-refresh.html",
// 		clientId: "fidicp-bo",
// 		responseType: "code",
// 		scope: "openid profile offline_access roles phone address",
// 		redirectUri: null,
// 		postLogoutRedirectUri: null
// 	},
// 	forms: {
// 		"appearance": "outline",
// 		"floatLabel": "auto"
// 	},
// 	culture: {
// 		resourcePaths: [
// 			"./assets/i18n/{code}.json",
// 			"./app/icp-module/assets/i18n/icp-{code}.json",
// 		],
// 		cultureCodes: [
// 			"en",
// 			"it"
// 		],
// 		defaultCultureCode: "it"
// 	},
// 	services: {
// 		api: {
// 			icpBasePath: "http://91.121.169.44:12020",
// 			profileBasePath: "http://fidcarefe.dev.kiranet.it/api/pas",
// 			atmBasePath: "http://91.121.169.44:12020/api/atm"
// 		}
// 	}
// };