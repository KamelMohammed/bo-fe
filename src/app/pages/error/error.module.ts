import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { ErrorPage } from './error.page';



const routes: Route[] = [
    { path: '', component: ErrorPage },
    { path: ':id', component: ErrorPage }
];

@NgModule({
    declarations: [
        ErrorPage
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ErrorModule {
}
