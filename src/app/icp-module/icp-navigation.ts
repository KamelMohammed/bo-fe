import { FuseNavigationItem } from "infrastructure/@fuse/components/navigation/navigation.types";
import { Roles } from "infrastructure/fidcare/models/profile.models";


export const icpNavigation: FuseNavigationItem[] = [
	{
		id: 'configuration',
		title: 'Configurazione',
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/icp/configuration',
		roles: [Roles.CONFIGURATOR],
		children: [
			{
				id: 'carelevel',
				title: 'Livelli di cura',
				type: 'basic',
				icon: 'mat_outline:settings',
				link: '/icp/configuration/carelevels'
			},
			{
				id: 'configuration',
				title: 'Prestazioni',
				type: 'basic',
				icon: 'mat_outline:settings',
				link: '/icp/configuration/services'
			},
			{
				id: 'configuration',
				title: 'Attività',
				type: 'basic',
				icon: 'mat_outline:settings',
				link: '/icp/configuration/activities'
			}
		]
	},
	{
		id: 'pasmenu',
		title: 'Piani Assistenziali Standard',
		roles: [Roles.CSANITARIO],
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/icp/pas',
		children: [
			{
				id: 'pas',
				title: 'Elenco PAS',
				type: 'basic',
				icon: 'mat_outline:library_books',
				link: '/icp/pas',
			},
		]
	},
	
	{
		id: 'paimenu',
		title: 'Piani Assistenziali Individualizzati',
		roles: [Roles.CSANITARIO],
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/icp/pai',
		children: [
			{
				id: 'pai',
				title: 'Elenco PAI',
				type: 'basic',
				icon: 'mat_outline:library_books',
				link: '/icp/pai',
			}
		]
	},

	{
		id: 'glossarymenu',
		title: 'Glossario',
		roles: [Roles.CONFIGURATOR],
		type: 'group',
		icon: 'mat_outline:settings',
		link: '/icp/configuration/glossary',
		children: [
			{
				id: 'glossary',
				title: 'Glossario',
				type: 'basic',
				icon: 'mat_outline:library_books',
				link: '/icp/configuration/glossary',
			},
		]
	},
	
];
