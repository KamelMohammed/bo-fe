import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Field, Position } from '../field.model';

@Component({
  selector: 'app-combobox-field',
  templateUrl: './combobox-field.component.html',
  styleUrls: ['./combobox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboboxFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  @Input() form?: FormGroup;
  optionPosition = Position;

  get formControl() {
    const fc = this.form.controls[this.field.id];
    if (!fc) {
      this.form.addControl(this.field.id, new FormControl());
    }

    return this.form.controls[this.field.id];
  }

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && this.field) {
      if (this.field.comboBox) {
        this.formControl.reset();
        if (this.field.comboBox.readonly) {
          this.formControl.disable();
        } else {
          this.formControl.enable();
        }
        if (this.field.comboBox.options) {
          if (this.field.comboBox.values) {
            this.formControl.patchValue(this.field.comboBox.values);
          } else {
            const defaultValue = this.field.comboBox.options.find(o => o.hasDefaultValue);
            if (defaultValue) {
              this.formControl.patchValue(defaultValue.value);
            }
          }
        }
        this.formControl.setValidators(this.field.required ? [Validators.required] : []);
      }
    }
  }

  getFxLayout(position?: Position) {
    if (position) {
      switch (position) {
        case Position.UP:
          return 'column';
        case Position.RIGHT:
          return 'row-reverse';
        case Position.DOWN:
          return 'column-reverse';
        default:
          return 'row';
      }
    }

    return 'row';
  }
}
