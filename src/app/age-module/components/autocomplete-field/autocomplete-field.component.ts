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
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, startWith } from 'rxjs/operators';

import {
  AutocompleteService,
  Field,
  Position,
  Reference,
  ReferenceData,
  ServiceMethodEnum,
  ServiceParamTypeEnum,
  ServiceResponse,
} from '../components.model';

@Component({
  selector: 'app-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFieldComponent implements OnInit, OnChanges {
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

  ngOnInit() {
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
      if (this.field.autocomplete) {
        if (this.field.autocomplete.readonly) {
          this.formControl.disable();
        } else {
          this.formControl.enable();
        }
        if (this.field.autocomplete.values) {
          this.selectedOptions = this.field.autocomplete.values.filter(v => v);
          this.formControl.patchValue(this.selectedOptions);
        }
        this.formControl.setValidators(this.field.required ? [this.requiredValidator.bind(this)] : []);
      }
    }
  }

  service$ = (value: string) => {
    if (value.length >= 3) {
      const { autocomplete: { service } } = this.field || {};
      if (service) {
        const queryParams = service.searchReferenceParamType === ServiceParamTypeEnum.PATH ? `/${value}` : '';
        const basePath = service.basePath ? service.basePath : environment.services.api.serviceBasePath;
        const url = `${basePath}${service.path}${queryParams}`;
        const params: { [propName: string]: string } = {};
        if (service.searchReferenceParamType === ServiceParamTypeEnum.BODY ||
          service.searchReferenceParamType === ServiceParamTypeEnum.QUERY) {
          params[service.searchReference] = value;
        }
        const request$ = service.method === ServiceMethodEnum.GET ? this.http.get(url, { params }) : this.http.post(url, { params });

        return request$.pipe(catchError(() => of()), map(data => this.buildServiceResponse(data, service)));
      }
    }

    return of([]);
  }

  buildServiceResponse(response: any, service: AutocompleteService): ServiceResponse[] {
    const getData = (
      obj: ReferenceData | ReferenceData[], key: string, serviceResponseReferenceKey: string
    ): ReferenceData | ReferenceData[] => {
      return Array.isArray(obj)
        ? obj.map(o => ({ key, serviceResponseReferenceKey, value: o.value[key] }))
        : Array.isArray(obj.value)
          ? obj.value.map(o => ({ key, serviceResponseReferenceKey, value: o[key] }))
          : { key, serviceResponseReferenceKey, value: obj.value[key] };
    };
    const dataResponse = Array.isArray(response) ? response : [response];
    const references: Reference[] = Object.entries(service.serviceResponseReference)
      .map(([key, value]) => ({ key: value.key, kies: value.key.split('.'), serviceResponseReferenceKey: key }));
    const results = dataResponse.map((r: any) => {
      const referencesFound = references.map(reference => {
        let data: ReferenceData | ReferenceData[];

        return reference.kies.map((key, index) => {
          const obj: ReferenceData | ReferenceData[] = index === 0
            ? { key, serviceResponseReferenceKey: reference.serviceResponseReferenceKey, value: r } : data;
          data = getData(obj, key, reference.serviceResponseReferenceKey);

          return data;
        });
      });
      const serviceResponse: ServiceResponse = { id: '', value: '' };
      for (const ref of referencesFound) {
        const referenceData = ref[ref.length - 1];
        if (referenceData) {
          const reference = Array.isArray(referenceData) ? referenceData[referenceData.length - 1] : referenceData;
          if (reference) {
            serviceResponse[reference.serviceResponseReferenceKey] = reference.value;
            serviceResponse[reference.key] = reference.value;
          }
        }
      }

      return serviceResponse;
    });

    return results.filter(r => r.value);
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
