import { Route } from '@angular/router';
import { LayoutComponent } from 'infrastructure/layout/layout.component';
import { navigation } from './navigation';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: '', component: LayoutComponent, data: { name: "main" }, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
    { path: 'icp', component: LayoutComponent, data: { name: "icp" }, loadChildren: () => import('./icp-module/icp-module').then(m => m.CMPModule).then(module => { navigation.set("icp", module.getNavigationItems()); return module }) },
    { path: 'age', component: LayoutComponent, data: { name: "age" }, loadChildren: () => import('./age-module/age.module').then(m => m.AgeModule).then(module => { navigation.set("age", module.getNavigationItems()); return module }) },
    { path: 'md', component: LayoutComponent, data: { name: "md" }, loadChildren: () => import('./md-module/md.module').then(m => m.MdModule).then(module => { navigation.set("md", module.getNavigationItems()); return module }) },
    { path: "mef", component: LayoutComponent, data: {name: "mef"}, loadChildren: ()=> import('./mef-module/mef-module').then(m=>m.MEFModule).then(module=> {navigation.set("mef", module.getNavigationItems()); return module })}
];
