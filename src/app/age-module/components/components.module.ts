import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';

import { OldSharedModule } from '../../shared/shared.module';

import { AutocompleteFieldComponent } from './autocomplete-field/autocomplete-field.component';
import { BadgeFieldComponent } from './badge-field/badge-field.component';
import { ButtonFieldComponent } from './button-field/button-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { ComboboxFieldComponent } from './combobox-field/combobox-field.component';
import { DatepickerFieldComponent } from './datepicker-field/datepicker-field.component';
import { DateTimepickerFieldComponent } from './datetimepicker-field/datetimepicker-field.component';
import { FieldItemComponent } from './field-item/field-item.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { SectionFieldComponent } from './section-field/section-field.component';
import { SelectboxFieldComponent } from './selectbox-field/selectbox-field.component';
import { StaticTextFieldComponent } from './static-text-field/static-text-field.component';
import { SwitchButtonFieldComponent } from './switch-button-field/switch-button-field.component';
import { TextAreaFieldComponent } from './text-area-field/text-area-field.component';
import { TextFieldComponent } from './text-field/text-field.component';

const fieldComponent = [
  BadgeFieldComponent,
  CheckboxFieldComponent,
  ComboboxFieldComponent,
  DatepickerFieldComponent,
  DateTimepickerFieldComponent,
  FieldItemComponent,
  NumericFieldComponent,
  RadioFieldComponent,
  SectionFieldComponent,
  SelectboxFieldComponent,
  StaticTextFieldComponent,
  SwitchButtonFieldComponent,
  TextAreaFieldComponent,
  TextFieldComponent,
  AutocompleteFieldComponent,
  ButtonFieldComponent,
];

@NgModule({
  declarations: fieldComponent,
  imports: [
    CommonModule,
    OldSharedModule,
    SharedModule
  ],
  exports: fieldComponent,
})
export class ComponentsModule { }
