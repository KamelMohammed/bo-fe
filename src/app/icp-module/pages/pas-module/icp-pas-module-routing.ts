import { EditPasActivityComponent } from './edit-pas-activity/edit-pas-activity.component';
import { EditPasComponent } from './edit-pas/edit-pas.component';
import { PasModuleComponent } from './pas-module.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: '', component: PasModuleComponent },
	{ path: 'edit', component: EditPasComponent },
	{ path: 'edit/:id', component: EditPasComponent},
	{ path: ':pasId/pasActivities', component: EditPasActivityComponent},
	{ path: ':pasId/pasActivities/:pasActivityId', component: EditPasActivityComponent},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ICPPASRouting { }