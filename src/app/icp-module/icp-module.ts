import { PipesAndDirectiveModule } from './../../infrastructure/fidcare/modules/pipes-directives.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BasePageComponent } from './pages/base-page.component';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { CareLevelService } from './services/api/care-level.service';
import { ActivityService } from './services/api/activity.service';
import { GlossaryService } from './services/api/glossary.service';
import { ServiceService } from './services/api/service.service';
import { PASService } from './services/api/pas.service';
import { CMPRoutingModule } from './icp-routing.module';
import { FuseNavigationItem } from 'infrastructure/@fuse/components/navigation/navigation.types';
import { icpNavigation } from './icp-navigation';
import { IcpRoutingSelectorComponent } from './icp-routing-selector.component';
import { ModalAgendaSessionPreviewComponent } from './pages/session/agenda-session-preview/agenda-session-preview.component';


@NgModule({
	declarations: [
		BasePageComponent,
		IcpRoutingSelectorComponent,
		ModalAgendaSessionPreviewComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		TranslateModule,
		PipesAndDirectiveModule,
		CMPRoutingModule
	],
	providers: [
		GlossaryService,
		CareLevelService,
		ActivityService,
		ServiceService,
		PASService
	],
	exports: [
		ModalAgendaSessionPreviewComponent
	]
})
export class CMPModule {
	public static getNavigationItems = (): FuseNavigationItem[] => {
		return icpNavigation;
	}
}
