import { ScheduleServiceActivityPageComponent } from './../pages/pai/schedule-service-activity-page/schedule-service-activity-page.component';
import { EditPasComponent } from './../pages/pas-module/edit-pas/edit-pas.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { PipesAndDirectiveModule } from "infrastructure/fidcare/modules/pipes-directives.module";
import { SharedModule } from "infrastructure/fidcare/modules/shared.module";
import { EditPasActivityComponent } from "../pages/pas-module/edit-pas-activity/edit-pas-activity.component";
import { PasActivityPageComponent } from "../pages/pas-module/edit-pas/pas-activity-page/pas-activity-page.component";

@NgModule({
  declarations: [
    EditPasActivityComponent,
    PasActivityPageComponent,
    EditPasComponent,
    ScheduleServiceActivityPageComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PipesAndDirectiveModule,
    SharedModule,
  ],

  exports: [
    EditPasActivityComponent,
    PasActivityPageComponent,
    EditPasComponent,
    ScheduleServiceActivityPageComponent
  ]
})
export class CommonPASPAIModule {

}