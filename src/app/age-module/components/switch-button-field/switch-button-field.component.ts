import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Field, Position, SwitchButtonOption } from '../components.model';

@Component({
  selector: 'app-switch-button-field',
  templateUrl: './switch-button-field.component.html',
  styleUrls: ['./switch-button-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchButtonFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  @Input() form?: FormGroup;
  firstOption?: SwitchButtonOption;
  secondOption?: SwitchButtonOption;

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
      if (this.field.switchButton.readonly) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
      if (this.field.switchButton.options) {
        this.firstOption = this.field.switchButton.options[0];
        this.secondOption = this.field.switchButton.options[1];
        if (this.field.switchButton.value) {
          this.formControl.patchValue(this.field.switchButton.value);
        } else {
          const defaultValue = this.field.switchButton.options.find(o => o.hasDefaultValue);
          if (defaultValue && defaultValue.value === 'true') {
            this.formControl.patchValue(true);
          } else if (defaultValue && defaultValue.value === 'false') {
            this.formControl.patchValue(false);
          }
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

  getToggleFxLayoutAlign(position?: Position) {
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

  change(event: MatSlideToggleChange) {

  }
}
