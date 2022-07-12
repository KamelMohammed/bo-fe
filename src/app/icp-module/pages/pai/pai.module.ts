import { CreatePasOnTheFlyComponent } from './edit-pai-page/create-pas-on-the-fly/create-pas-on-the-fly.component';
import { PaiAttachmentPageComponent } from './edit-pai-page/pai-attachment-page/pai-attachment-page.component';
import { EditPaiAttachmentPageComponent } from './edit-pai-page/pai-attachment-page/edit-pai-attachment-page/edit-pai-attachment-page.component';
import { EditEvaluationPageComponent } from './edit-pai-page/evaluation-page/edit-evaluation-page/edit-evaluation-page.component';
import { EvaluationPageComponent } from './edit-pai-page/evaluation-page/evaluation-page.component';
import { CommonPASPAIModule } from './../../utils/common-pai-pas.module';

import { ElectCaseManagerPageComponent } from './edit-pai-page/elect-case-manager-page/elect-case-manager-page.component';
import { EditPaiPageComponent } from './edit-pai-page/edit-pai-page.component';
import { CurrentPaiPageComponent } from './pai-page/pai-page.component';
import { SharedModule } from './../../../../infrastructure/fidcare/modules/shared.module';
import { PaiRouting } from './pai-routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaiComponent } from './pai.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import { EditNotePageComponent } from './edit-pai-page/pai-notes-page/edit-note-page/edit-note-page.component';
import { PaiNotesPageComponent } from './edit-pai-page/pai-notes-page/pai-notes-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PaiRouting,
    MatTabsModule,
    CommonPASPAIModule    
  ],
  declarations: [
    PaiComponent,
    CurrentPaiPageComponent,
    EditPaiPageComponent,
    ElectCaseManagerPageComponent,
    EvaluationPageComponent,
    EditEvaluationPageComponent,
    EditPaiAttachmentPageComponent,
    PaiAttachmentPageComponent,
    EditNotePageComponent,
    PaiNotesPageComponent,
    CreatePasOnTheFlyComponent
  ],
  exports:[
    CommonPASPAIModule,
    CurrentPaiPageComponent,
    EditPaiPageComponent,
    ElectCaseManagerPageComponent,
    EvaluationPageComponent,
    EditEvaluationPageComponent,
    EditPaiAttachmentPageComponent,
    PaiAttachmentPageComponent,
    EditNotePageComponent,
    PaiNotesPageComponent,
    CreatePasOnTheFlyComponent


  ]
})
export class PaiModule { }
