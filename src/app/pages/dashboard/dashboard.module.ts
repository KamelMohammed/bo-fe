import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



const routes: Route[] = [
    { path: '', component: DashboardComponent }];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        RouterModule.forChild(routes),
		InfiniteScrollModule
    ],
    providers: [
    ],
    exports: [
    ]
})
export class DashboardModule {
}
