import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { FormPage } from './form.page';
import { TestFormComponent } from './test-form.component';



const routes: Route[] = [
    { path: '', component: FormPage },
    { path: ':id', component: FormPage }
];

@NgModule({
    declarations: [
        TestFormComponent,
		FormPage
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
export class TestFormModule {
}
