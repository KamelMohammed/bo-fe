import { PaiNotesPageComponent } from './edit-pai-page/pai-notes-page/pai-notes-page.component';
import { PasActivityPageComponent } from './../pas-module/edit-pas/pas-activity-page/pas-activity-page.component';
import { ElectCaseManagerPageComponent } from './edit-pai-page/elect-case-manager-page/elect-case-manager-page.component';
import { EditPaiPageComponent } from './edit-pai-page/edit-pai-page.component';
import { CurrentPaiPageComponent } from './pai-page/pai-page.component';
import { PaiComponent } from './pai.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: '', component: PaiComponent},
	{ path: 'edit', component: EditPaiPageComponent},
	{ path: 'edit/:id',component: EditPaiPageComponent},
	{path: ':id/notes', component: PaiNotesPageComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PaiRouting {
}
