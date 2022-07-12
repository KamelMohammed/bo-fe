import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Field, Position } from '../components.model';

@Component({
  selector: 'app-radio-field',
  templateUrl: './radio-field.component.html',
  styleUrls: ['./radio-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  @Input() form?: FormGroup;

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
      this.formControl.reset();
      if (this.field.radio) {
        if (this.field.radio.readonly) {
          this.formControl.disable();
        } else {
          this.formControl.enable();
        }
        if (this.field.radio.options) {
          if (this.field.radio.values) {
            this.formControl.patchValue(this.field.radio.values);
          } else {
            const defaultValue = this.field.radio.options.find(o => o.hasDefaultValue);
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
