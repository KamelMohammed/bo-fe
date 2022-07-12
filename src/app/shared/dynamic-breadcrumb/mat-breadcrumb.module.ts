import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { MatBreadcrumbComponent } from './mat-breadcrumb.component';

@NgModule({
  declarations: [MatBreadcrumbComponent],
  imports: [
    RouterModule,
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule
  ],
  exports: [MatBreadcrumbComponent]
})
export class MatBreadcrumbModule { }
