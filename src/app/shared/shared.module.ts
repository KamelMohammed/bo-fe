import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { ActionsComponent } from './actions/actions.component';
//import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';
import { DatePickerHeaderFilterComponent } from './date-picker-header-filter/date-picker-header-filter.component';
import { GridsterModule } from './gridster/gridster.module';
import { LegendBottomSheetComponent } from './legend/legend-bottom-sheet/legend-bottom-sheet.component';
import { LegendComponent } from './legend/legend.component';
import { PriorityPipe } from './priority-pipe';
import { TableFilterComponent } from './table-filter/table-filter.component';

@NgModule({
  declarations: [
    ActionsComponent,
    LegendComponent,
    TableFilterComponent,
    LegendBottomSheetComponent,
    PriorityPipe,
    DatePickerHeaderFilterComponent,
  ],
  imports: [
    CommonModule,
    CdkTableModule,
    DragDropModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatListModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatRadioModule,
    NgxMaterialTimepickerModule.setLocale('it-IT'),
    ReactiveFormsModule,
    FormsModule,
    GridsterModule,
    InfiniteScrollModule,
    ColorPickerModule,
  ],
  exports: [
    CdkTableModule,
    DragDropModule,
    MatButtonModule,
    ActionsComponent,
    FlexLayoutModule,
    LegendComponent,
    MatExpansionModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatSortModule,
    MatListModule,
    MatDividerModule,
    MatButtonToggleModule,
    NgxMaterialTimepickerModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    TableFilterComponent,
    TranslateModule,
    LegendBottomSheetComponent,
    PriorityPipe,
    InfiniteScrollModule,
    ColorPickerModule,
  ]
})
export class OldSharedModule { }
