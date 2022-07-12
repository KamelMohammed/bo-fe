import { EditPasActivityComponent } from './edit-pas-activity/edit-pas-activity.component';
import { PasActivityPageComponent } from './edit-pas/pas-activity-page/pas-activity-page.component';
import { EditPasComponent } from './edit-pas/edit-pas.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasModuleComponent } from './pas-module.component';
import { PipesAndDirectiveModule } from 'infrastructure/fidcare/modules/pipes-directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { ICPPASRouting } from './icp-pas-module-routing';
import { CommonPASPAIModule } from 'app/icp-module/utils/common-pai-pas.module';

@NgModule({
  imports: [
    CommonModule,
		TranslateModule,
		PipesAndDirectiveModule,
		SharedModule,
    ICPPASRouting,
    CommonPASPAIModule,
  ],
  declarations: [
    PasModuleComponent,
  ],
  exports: [
  ]
})
export class PasModuleModule {
}
