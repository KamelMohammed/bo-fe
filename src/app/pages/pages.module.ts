import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';


const routes: Route[] = [
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    { path: 'errors', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'test-table', loadChildren: () => import('./test-table/test-table.module').then(m => m.TestTableModule) },
    { path: 'test-form', loadChildren: () => import('./test-form/test-form.module').then(m => m.TestFormModule) }
]
@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [
    ],
    exports: [
    ]
})
export class PagesModule {
}
