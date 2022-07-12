import { EditGlossaryPageComponent } from './glossary/edit-glossary-page/edit-glossary-page.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { PipesAndDirectiveModule } from '../../../../infrastructure/fidcare/modules/pipes-directives.module';
import { CreateActivityFormComponent } from './activities/create-activity-form/create-activity-form.component';
import { ActivitiesComponent } from './activities/activities.component';
import { CreateServiceFormComponent } from './services/create-service-form/create-service-form.component';
import { CreateCareLevelFormComponent } from './care-levels/create-care-level-form/create-care-level-form.component';
import { CareLevelsComponent } from './care-levels/care-levels.component';
import { ConfigurationComponent } from './configuration.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesComponent } from './services/services.component';
import { ProfessionalListComponent } from './care-levels/create-care-level-form/professionals-list.component';
import { CreateProfessionalPage } from './care-levels/create-professional-page/create-professional.page';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { CMPConfigurationRoutingModule } from './icp-configuration-routing.module'

@NgModule({
	declarations: [
		ConfigurationComponent,
		CareLevelsComponent,
		CreateCareLevelFormComponent,
		ServicesComponent,
		ProfessionalListComponent,
		CreateProfessionalPage,
		CreateServiceFormComponent,
		ServicesComponent,
		ActivitiesComponent,
		CreateActivityFormComponent,
		GlossaryComponent,
		EditGlossaryPageComponent

	],
	imports: [
		CommonModule,
		TranslateModule,
		PipesAndDirectiveModule,
		SharedModule,
		CMPConfigurationRoutingModule
	],
	providers: [
	]
})
export class CMPConfigurationModule { }
