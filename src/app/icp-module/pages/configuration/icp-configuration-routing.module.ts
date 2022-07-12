import { EditGlossaryPageComponent } from './glossary/edit-glossary-page/edit-glossary-page.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActivitiesComponent } from "./activities/activities.component";
import { CreateActivityFormComponent } from "./activities/create-activity-form/create-activity-form.component";
import { CareLevelsComponent } from "./care-levels/care-levels.component";
import { CreateCareLevelFormComponent } from "./care-levels/create-care-level-form/create-care-level-form.component";
import { CreateProfessionalPage } from "./care-levels/create-professional-page/create-professional.page";
import { ConfigurationComponent } from "./configuration.component";
import { CreateServiceFormComponent } from "./services/create-service-form/create-service-form.component";
import { ServicesComponent } from "./services/services.component";

const routes: Routes = [
	{ path: '', component: ConfigurationComponent },
	{path: 'configuration', component: ConfigurationComponent},
	
	{ path: 'carelevels', component: CareLevelsComponent },
	{ path: 'carelevels/edit', component: CreateCareLevelFormComponent },
	{ path: 'carelevels/edit/:id', component: CreateCareLevelFormComponent },
	{ path: 'carelevels/:careLevelId/professional', component: CreateProfessionalPage },
	{ path: 'carelevels/:careLevelId/professional/:professionalId', component: CreateProfessionalPage },
	
	
	{ path: 'services', component: ServicesComponent },
	{ path: 'services/edit/:id', component: CreateServiceFormComponent },
	{ path: 'services/edit', component: CreateServiceFormComponent },

	{ path: 'glossary', component: GlossaryComponent },
	{ path: 'glossary/edit/:id', component: EditGlossaryPageComponent },
	{ path: 'glossary/edit', component: EditGlossaryPageComponent },

	{ path: 'activities', component: ActivitiesComponent },
	{ path: 'activities/edit', component: CreateActivityFormComponent },
	{ path: 'activities/edit/:id', component: CreateActivityFormComponent}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CMPConfigurationRoutingModule { }
  