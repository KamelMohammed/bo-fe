import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Field, Position } from '../field.model';

@Component({
  selector: 'app-numeric-field',
  templateUrl: './numeric-field.component.html',
  styleUrls: ['./numeric-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericFieldComponent implements OnInit, OnChanges {
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
      if (this.field.numeric) {
        if (this.field.numeric.readonly) {
          this.formControl.disable();
        } else {
          this.formControl.enable();
        }
        if (this.field.numeric.value) {
          this.formControl.patchValue(this.field.numeric.value);
        } else if (this.field.numeric.hasDefaultValue) {
          const defaultValue = this.field.numeric.defaultValue;
          this.formControl.patchValue(defaultValue);
        }
      }
      this.formControl.setValidators(this.field.required ? [Validators.required] : []);
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
