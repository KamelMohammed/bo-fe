import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridsterItemComponent } from './gridster-item.component';
import { GridsterPreviewComponent } from './gridster-preview.component';
import { GridsterComponent } from './gridster.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GridsterComponent, GridsterItemComponent],
  providers: [],
  bootstrap: [],
  entryComponents: [GridsterComponent, GridsterItemComponent]
})
export class GridsterModule {
}
