import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';

import { ModalConfirmationComponent } from './modal-confirmation.component';



@NgModule({
  declarations: [ModalConfirmationComponent],
  imports: [
    CommonModule, SharedModule
  ]
})
export class ModalConfirmationModule { }
