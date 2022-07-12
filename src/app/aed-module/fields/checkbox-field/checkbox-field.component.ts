import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Field, Position } from '../field.model';

@Component({
  selector: 'app-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxFieldComponent implements OnInit, OnChanges {
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
      if (this.field.checkbox.readonly) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
      if (this.field.checkbox.value) {
        this.formControl.patchValue(this.field.checkbox.value);
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

  getCheckboxFxLayoutAlign(position?: Position) {
    if (position) {
      switch (position) {
        case Position.UP:
        case Position.DOWN:
          return 'center center';
        case Position.RIGHT:
          return 'start center';
        default:
          return 'end center';
      }
    }

    return 'end center';
  }
}
