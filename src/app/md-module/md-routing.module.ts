import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertDashboardComponent } from './pages/alert-dashboard/alert-dashboard.component';
import { ClinicalDiariesComponent } from './pages/clinical-diaries/clinical-diaries.component';
import { ClinicalDiaryComponent } from './pages/clinical-diary/clinical-diary.component';
import { TherapySheetComponent } from './pages/clinical-diary/therapies/therapy-sheet/therapy-sheet.component';
import { TherapyComponent } from './pages/clinical-diary/therapies/therapy/therapy.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'clinical-diaries',
		pathMatch: 'full'
	},
	{
		path: 'clinical-diaries',
		component: ClinicalDiariesComponent,
	},
	{
		path: 'clinical-diary',
		component: ClinicalDiaryComponent
	},
	{
		path: 'therapy',
		component: TherapyComponent
	},
	{
		path: 'unique-therapy-sheet',
		component: TherapySheetComponent
	},
	{
		path: 'alert-dashboard',
		component: AlertDashboardComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MdRoutingModule { }
