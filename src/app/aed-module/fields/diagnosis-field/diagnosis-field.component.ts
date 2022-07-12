import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, mergeMap, startWith } from 'rxjs/operators';

import { Field, Position, ServiceResponse } from '../field.model';

@Component({
  selector: 'app-diagnosis-field',
  templateUrl: './diagnosis-field.component.html',
  styleUrls: ['./diagnosis-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosisFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  @Input() form?: FormGroup;

  @ViewChild('chipList') chipList: MatChipList;
  @ViewChild('optionInput') optionInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  options$: Observable<ServiceResponse[]>;
  selectedOptions: ServiceResponse[] = [];

  get formControl() {
    const fc = this.form.controls[this.field.id];
    if (!fc) {
      this.form.addControl(this.field.id, new FormControl());
    }

    return this.form.controls[this.field.id];
  }

  constructor(
    private readonly http: HttpClient
  ) { }

  ngOnInit(): void {
    this.options$ = this.formControl.valueChanges
      .pipe(
        filter(value => typeof value === 'string'),
        startWith(),
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap(this.service$),
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && this.field) {
      this.formControl.reset();
      if (this.field.diagnosis) {
        if (this.field.diagnosis.readonly) {
          this.formControl.disable();
        } else {
          this.formControl.enable();
        }
        if (this.field.diagnosis.values) {
          this.selectedOptions = this.field.diagnosis.values.filter(v => v);
          this.formControl.patchValue(this.field.diagnosis.values);
        }
        this.formControl.setValidators(this.field.required ? [this.requiredValidator.bind(this)] : []);
      }
    }
  }

  service$ = (value: string) => {
    if (value.length >= 3) {
      // return this.http.get<ServiceResponse[]>(`https://virtserver.swaggerhub.com/gant85/Test/1.0.0/search/${value}`);
      return this.field && this.field.diagnosis && this.field.diagnosis.service
        ? this.http.get<ServiceResponse[]>(`${environment.services.api.serviceBasePath}${this.field.diagnosis.service}/${value}`)
          .pipe(catchError(() => of([])))
        : of([]);
    } else {
      return of([]);
    }
  }

  requiredValidator = (control: AbstractControl): { [key: string]: any } | null => {
    if (control.touched && (!control.value || !control.value.length)) {
      if (this.chipList) {
        this.chipList.errorState = true;
      }

      return { required: { value: control.value } };
    } else {
      if (this.chipList) {
        this.chipList.errorState = false;
      }

      return null;
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

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      if (event.input) {
        event.input.value = '';
      }

      this.formControl.setValue(null);
    }
  }

  remove(option: ServiceResponse): void {
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.formControl.patchValue(this.selectedOptions);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOptions.push(event.option.value);
    this.formControl.patchValue(this.selectedOptions);
    this.optionInput.nativeElement.value = '';
  }
}
