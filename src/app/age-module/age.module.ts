import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'app/shared/gridster/gridster.module';
import { OldSharedModule } from 'app/shared/shared.module';
import { FuseNavigationItem } from 'infrastructure/@fuse/components/navigation/navigation.types';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';

import { AdministrationService } from '../services/api/atm';
import { ageNavigation } from './age-navigation';

import { AgeRoutingModule } from './age-routing.module';
import { AgendaFormComponent } from './pages/agenda-form/agenda-form.component';
import { TherapySheetComponent } from './pages/therapy-sheet/therapy-sheet.component';
import { TherapyMissingAdministrationComponent } from './pages/therapy-missing-administration/therapy-missing-administration.component';
import { CustomAgendaComponent } from './pages/agenda/agenda.component';
import { CalendarDayViewComponent } from './pages/calendar-day-view/calendar-day-view.component';
import { ComponentsModule } from './components/components.module';
import { AgendaSubmissionsService, AgendaTemplateService } from './services';
import { TherapyAdministerComponent } from './pages/therapy-administer/therapy-administer.component';
import { TherapyShowNoteComponent } from './pages/therapy-show-note/therapy-show-note.component';
import { TherapyAddNoteComponent } from './pages/therapy-add-note/therapy-add-note.component';

@NgModule({
  declarations: [
    CustomAgendaComponent,
    AgendaFormComponent,
    CalendarDayViewComponent,
    TherapySheetComponent,
    TherapyMissingAdministrationComponent,
    TherapyAdministerComponent,
    TherapyShowNoteComponent,
    TherapyAddNoteComponent,

  ],
  imports: [
    CommonModule,
    OldSharedModule,
    SharedModule,
    AgeRoutingModule,
    GridsterModule,
    ComponentsModule,
  ],
  providers: [
    AdministrationService,
    AgendaSubmissionsService,
    AgendaTemplateService,
  ],
})
export class AgeModule {
  public static getNavigationItems = (): FuseNavigationItem[] => {
    return ageNavigation;
  }
}