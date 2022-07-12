import { FuseNavigationItem } from "infrastructure/@fuse/components/navigation/navigation.types";

export const mainNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'dashboard',
    //     title: 'Dashboard',
    //     type: 'basic',
    //     icon: 'heroicons_solid:home',
    //     link: '/'
    // },
    // {
    //     id: 'test-table',
    //     title: 'Test Table',
    //     type: 'basic',
    //     icon: 'heroicons_solid:home',
    //     link: '/test-table'
    // },
    // {
    //     id: 'test-form',
    //     title: 'Test Form',
    //     type: 'basic',
    //     icon: 'heroicons_solid:home',
    //     link: '/test-form'
    // },
    {
        id: 'icp',
        title: 'Assistenza domiciliare',
        type: 'basic',
        icon: 'heroicons_solid:home',
        link: '/icp'
    },
    {
        id: 'md',
        title: 'mainMenu.md',
        type: 'basic',
        icon: 'heroicons_solid:calendar',
        link: '/md'
    },
	{
        id: 'mef',
        title: 'MEF',
        type: 'basic',
        icon: 'heroicons_solid:calendar',
        link: '/mef'
    }
];

export const navigation = new Map<string, FuseNavigationItem[]>();
navigation.set("main", mainNavigation);