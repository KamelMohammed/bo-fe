import { FuseNavigationItem } from "infrastructure/@fuse/components/navigation/navigation.types";
import { Roles } from "infrastructure/fidcare/models/profile.models";


export const mefNavigation: FuseNavigationItem[] = [
	{
		id: 'configuration',
		title: 'Configurazione',
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/mef',
		roles: [Roles.CONFIGURATOR],
		children: [
			{
				id: 'forms',
				title: 'Modulistica',
				type: 'basic',
				icon: 'mat_outline:settings',
				link: '/mef/document-list'
			},
		]
	},
	{
		id: 'access porposal',
		title: 'Proposte di accesso',
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/mef/accessProposals',
		roles: [Roles.CSANITARIO, Roles.PUA_OPERATOR, Roles.DOCTOR],
		children: [
			{
				id: 'accessPorposal',
				title: 'Proposte di accesso',
				type: 'basic',
				icon: 'mat_outline:settings',
				link: '/mef/accessProposals',
			},
		]
	}	
];
