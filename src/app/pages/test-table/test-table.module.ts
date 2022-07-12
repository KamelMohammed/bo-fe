import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { TestTableComponent } from './test-table.component';



const routes: Route[] = [
    { path: '', component: TestTableComponent }];

@NgModule({
    declarations: [
        TestTableComponent
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        RouterModule.forChild(routes)
    ],
    providers: [
    ],
    exports: [
    ]
})
export class TestTableModule {
}
