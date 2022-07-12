import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Field, Position } from '../components.model';

@Component({
  selector: 'app-datetimepicker-field',
  templateUrl: './datetimepicker-field.component.html',
  styleUrls: ['./datetimepicker-field.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimepickerFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  @Input() form?: FormGroup;

  get formControl() {
    const fc = this.form.controls[this.field.id];
    if (!fc) {
      this.form.addControl(this.field.id, new FormControl());
    }

    return this.form.controls[this.field.id];
  }
  datetimeForm = new FormGroup({
    date: new FormControl(),
    hour: new FormControl('00'),
    minute: new FormControl('00'),
  });
  get date() {
    return this.datetimeForm.controls.date;
  }
  get hour() {
    return this.datetimeForm.controls.hour;
  }
  get minute() {
    return this.datetimeForm.controls.minute;
  }
  hours = new Array(24).fill(0).map((acc, index) => `${index}`.padStart(2, '0'));
  minutes = new Array(60).fill(0).map((acc, index) => `${index}`.padStart(2, '0'));

  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      const datetime = moment(value);
      if (!this.date.value) {
        this.date.patchValue(datetime.format('YYYY-MM-DD'), { emitEvent: false });
        this.hour.patchValue(datetime.format('HH'), { emitEvent: false });
        this.minute.patchValue(datetime.format('mm'), { emitEvent: false });
      }
    });
    this.date.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      const datetime = moment(value).hour(this.hour.value).minute(this.minute.value);
      this.formControl.patchValue(datetime);
    });
    this.hour.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      if (this.date.value) {
        const datetime = moment(this.date.value).hour(value).minute(this.minute.value);
        this.formControl.patchValue(datetime);
      }
    });
    this.minute.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      if (this.date.value) {
        const datetime = moment(this.date.value).hour(this.hour.value).minute(value);
        this.formControl.patchValue(datetime);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && this.field) {
      this.formControl.reset();
      if (this.field.datetimepicker.value) {
        const value = moment(this.field.datetimepicker.value);
        this.formControl.patchValue(value);
        this.date.patchValue(value.format('YYYY-MM-DD'));
        this.hour.patchValue(value.format('HH'));
        this.minute.patchValue(value.format('MM'));
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
