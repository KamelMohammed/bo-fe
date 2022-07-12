import { FuseNavigationItem } from "infrastructure/@fuse/components/navigation/navigation.types";

export const mdNavigation: FuseNavigationItem[] = [
	{
		id: 'Dossier sanitari',
		title: 'Dossier sanitari',
		type: 'basic',
		icon: 'heroicons_solid:calendar',
		link: '/md'
	},
	{
		id: 'icp',
		title: 'Assistenza domiciliare',
		type: 'basic',
		icon: 'heroicons_solid:calendar',
		link: '/icp'
	}
];
