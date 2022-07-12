import { SessionAttachmentsTableComponent } from './edit-session/session-attachments-table/session-attachments-table.component';
import { SessionRouting } from './session-routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSessionComponent } from './edit-session/edit-session.component';
import { ProvisionsTableComponent } from './edit-session/provisions-table/provisions-table.component';
import { EditProvisionComponent } from './edit-session/provisions-table/edit-provision/edit-provision.component';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SessionRouting,
  ],
  declarations: [
    EditSessionComponent,
    ProvisionsTableComponent,
    EditProvisionComponent,
    SessionAttachmentsTableComponent
  ]
})
export class SessionModule { }
