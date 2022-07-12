import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OldSharedModule } from 'app/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import {
  ActiveSubstanceAllergiesFieldComponent,
} from './active-substance-allergies-field/active-substance-allergies-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { ComboboxFieldComponent } from './combobox-field/combobox-field.component';
import {
  CommercialDrugAllergiesFieldComponent,
} from './commercial-drug-allergies-field/commercial-drug-allergies-field.component';
import { DatepickerFieldComponent } from './datepicker-field/datepicker-field.component';
import { DiagnosisFieldComponent } from './diagnosis-field/diagnosis-field.component';
import { FieldItemComponent } from './field-item/field-item.component';
import { HeightFieldComponent } from './height-field/height-field.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { SectionFieldComponent } from './section-field/section-field.component';
import { SelectboxFieldComponent } from './selectbox-field/selectbox-field.component';
import { StaticTextFieldComponent } from './static-text-field/static-text-field.component';
import { SwitchButtonFieldComponent } from './switch-button-field/switch-button-field.component';
import { TextAreaFieldComponent } from './text-area-field/text-area-field.component';
import { TextFieldComponent } from './text-field/text-field.component';
import { WeightFieldComponent } from './weight-field/weight-field.component';
import { GridsterModule } from 'app/shared/gridster/gridster.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesAndDirectiveModule } from 'infrastructure/fidcare/modules/pipes-directives.module';

const fieldComponent = [
  ActiveSubstanceAllergiesFieldComponent,
  CheckboxFieldComponent,
  ComboboxFieldComponent,
  CommercialDrugAllergiesFieldComponent,
  DatepickerFieldComponent,
  DiagnosisFieldComponent,
  FieldItemComponent,
  HeightFieldComponent,
  NumericFieldComponent,
  RadioFieldComponent,
  SectionFieldComponent,
  SelectboxFieldComponent,
  StaticTextFieldComponent,
  SwitchButtonFieldComponent,
  TextAreaFieldComponent,
  TextFieldComponent,
  WeightFieldComponent,
];

@NgModule({
  declarations: fieldComponent,
  imports: [
	SharedModule,
	TranslateModule,
	PipesAndDirectiveModule,

    CommonModule,
    OldSharedModule,
	FormsModule,
		ReactiveFormsModule,
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
		GridsterModule,
		InfiniteScrollModule,
		ColorPickerModule,
  ],
  exports: fieldComponent,
})
export class FieldsModule { }
