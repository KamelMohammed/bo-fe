import { HttpClient } from '@angular/common/http';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { of } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AgendaSubmissionsService, AgendaTemplateService, Submission } from '../../services';
import { DisplayGrid, GridsterConfig, GridType } from '../../../shared/gridster/gridster-config.interface';
import { Field, FieldType, Position, ServiceMethodEnum, ServiceResponse } from '../../components/components.model';
import { AgendaFormTO } from '../../models/age.model';


import { environment } from 'environments/environment';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaFormComponent implements OnInit, AfterContentInit {

  private profile: Profile = null;

  formTO?: AgendaFormTO;
  form = new FormGroup({});
  options: GridsterConfig = {
    gridType: GridType.Fixed,
    maxCols: 10000,
    maxRows: 10000,
    fixedColWidth: 20,
    fixedRowHeight: 15,
    displayGrid: DisplayGrid.OnDragAndResize,
    pushItems: false,
    margin: 0,
  };
  submission: Submission;
  badge?: Field;
  button?: Field;
  apiReferenceFileds: Field[] = [];
  sectionField1: Field = {
    id: 'sectionField1',
    name: 'sectionField1',
    label: { label: this.translateService.instant('FORM_CONFIGURATION.EVENT_DETAIL'), hidden: false },
    type: FieldType.SECTION,
    required: true,
    x: 0, y: 0, cols: 0, rows: 0,
  };
  datetimepickerField: Field = {
    id: 'datetimepickerField',
    name: 'datetimepickerField',
    label: { label: this.translateService.instant('DATE_TIME'), hidden: false },
    type: FieldType.DATETIMEPICKER,
    required: true,
    datetimepicker: { readonly: false, value: '' },
    x: 0, y: 0, cols: 0, rows: 0,
  };
  textTitle: Field = {
    id: 'textTitle',
    name: 'textTitle',
    label: { label: this.translateService.instant('TITLE'), hidden: false },
    type: FieldType.TEXT,
    required: true,
    text: { readonly: false, hasDefaultValue: false, value: '' },
    x: 0, y: 0, cols: 0, rows: 0,
  };
  textDescription1: Field = {
    id: 'descriptionTitle1',
    name: 'descriptionTitle1',
    label: { label: `${this.translateService.instant('DESCRIPTION')} 1`, hidden: false },
    type: FieldType.TEXT,
    required: false,
    text: { readonly: false, hasDefaultValue: false, value: '' },
    x: 0, y: 0, cols: 0, rows: 0,
  };
  textDescription2: Field = {
    id: 'descriptionTitle2',
    name: 'descriptionTitle2',
    label: { label: `${this.translateService.instant('DESCRIPTION')} 2`, hidden: false },
    type: FieldType.TEXT,
    required: false,
    text: { readonly: false, hasDefaultValue: false, value: '' },
    x: 0, y: 0, cols: 0, rows: 0,
  };
  textDescription3: Field = {
    id: 'descriptionTitle3',
    name: 'descriptionTitle3',
    label: { label: `${this.translateService.instant('DESCRIPTION')} 3`, hidden: false },
    type: FieldType.TEXT,
    required: false,
    text: { readonly: false, hasDefaultValue: false, value: '' },
    x: 0, y: 0, cols: 0, rows: 0,
  };
  sectionField2: Field = {
    id: 'sectionField2',
    name: 'sectionField2',
    label: { label: this.translateService.instant('FORM_CONFIGURATION.EVENT'), hidden: false },
    type: FieldType.SECTION,
    required: true,
    x: 0, y: 0, cols: 0, rows: 0,
  };
  get datetimepicker() {
    return this.form.controls[this.datetimepickerField.id];
  }
  get title() {
    return this.form.controls[this.textTitle.id];
  }
  get description1() {
    return this.form.controls[this.textDescription1.id];
  }
  get description2() {
    return this.form.controls[this.textDescription2.id];
  }
  get description3() {
    return this.form.controls[this.textDescription3.id];
  }

  constructor(
    public readonly dialog: MatDialogRef<AgendaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { submission: Submission },
    private readonly profileService: ProfileService,
    private readonly agendaSubmissionsService: AgendaSubmissionsService,
    private readonly agendaTemplateService: AgendaTemplateService,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService,
    private readonly http: HttpClient,
    private readonly cd: ChangeDetectorRef
  ) {
    this.submission = data.submission;
    this.profileService.profile$.subscribe(result => {
      this.profile = result;
    }).unsubscribe();
  }

  ngOnInit() {
    if (!this.submission.id) {
      this.agendaTemplateService.findAllAgendaTemplateById(this.submission.template.id)
        .subscribe(template => {
          const fields: Field[] = JSON.parse(template.schema);
          this.formTO = {
            fields,
          };
          this.cd.markForCheck();
        });
    } else {
      const fields: Field[] = JSON.parse(this.submission.schema);
      this.formTO = {
        ...this.submission,
        fields,
      };
    }
    this.badge = this.formTO?.fields.find(f => f.type === FieldType.BADGE);
    this.button = this.formTO?.fields.find(f => f.type === FieldType.BUTTON);
  }

  ngAfterContentInit() {
    if (this.formTO) {
      this.form.updateValueAndValidity();
      const badge = this.formTO.fields.find(f => f.type === FieldType.BADGE);
      const { badge: {
        title = { value: '' },
        description1 = { value: '' },
        description2 = { value: '' },
        description3 = { value: '' },
      } = {} } = badge || {};
      setTimeout(() => {
        this.datetimepicker.patchValue(this.submission.submissionDateTime);
        this.title.patchValue(title && title.value);
        if (this.description1) {
          this.description1.patchValue(description1 && description1.value);
        }
        if (this.description2) {
          this.description2.patchValue(description2 && description1.value);
        }
        if (this.description3) {
          this.description3.patchValue(description3 && description2.value);
        }
      });
    }
  }

  getFields(fields: Field[]) {
    return fields.filter(f => f.type !== FieldType.BADGE && f.type !== FieldType.BUTTON);
  }

  submitButton(element: Field) {
    this.formUpdateValueAndValidity();
    if (this.form.valid && this.formTO) {
      this.setFieldValue();
      const { button } = element;
      const basePath = button.basePath ? button.basePath : environment.services.api.serviceBasePath;
      const url = `${basePath}${button.path}`;
      const params: { [propName: string]: string | string[] } = {};
      this.apiReferenceFileds.forEach(field => {
        const control = this.form.controls[field.id];
        if (control) {
          switch (field.type) {
            case FieldType.TEXT:
              params[field.text.apiReference.fieldName] = control.value;
              break;
            case FieldType.TEXTAREA:
              params[field.textarea.apiReference.fieldName] = control.value;
              break;
            case FieldType.DATEPICKER:
              params[field.datepicker.apiReference.fieldName] = control.value;
              break;
            case FieldType.DATETIMEPICKER:
              params[field.datetimepicker.apiReference.fieldName] = control.value;
              break;
            case FieldType.RADIO:
              params[field.radio.apiReference.fieldName] = control.value;
              break;
            case FieldType.NUMERIC:
              params[field.numeric.apiReference.fieldName] = control.value;
              break;
            case FieldType.COMBOBOX:
              params[field.comboBox.apiReference.fieldName] = control.value;
              break;
            case FieldType.SELECTBOX: {
              if (field.selectBox.options) {
                const values: string[] = control.value;
                field.selectBox.options.forEach(option => {
                  params[option.apiReference.fieldName] = values.find(v => v === option.value);
                });
              }
              break;
            }
            case FieldType.SWITCHBUTTON:
              params[field.switchButton.apiReference.fieldName] = control.value;
              break;
            case FieldType.CHECKBOX:
              params[field.checkbox.apiReference.fieldName] = control.value;
              break;
            case FieldType.AUTOCOMPLETE: {
              if (field.autocomplete.service) {
                const values: ServiceResponse[] = control.value;
                Object.values(field.autocomplete.service.serviceResponseReference).forEach(r => {
                  params[r.apiReference.fieldName] = values.map(v => v[r.key]);
                });
              }
              break;
            }
            default:
          }
        }
      });
      const request$ = button.method === ServiceMethodEnum.POST
        ? this.http.post(url, { params })
        : button.method === ServiceMethodEnum.PUT
          ? this.http.put(url, { params })
          : button.method === ServiceMethodEnum.DELETE
            ? this.http.delete(url, { params })
            : of();
      request$.subscribe(response => {
        this.dialog.close(response);
        this.snackBarService.success(this.translateService.instant('FORM_CONFIGURATION.SUBMISSION_SUCCESS'));
        // this.snackBar.open(this.translateService.instant('FORM_CONFIGURATION.SUBMISSION_SUCCESS'), '', { duration: 1000 });
      });
    }
  }

  close() {
    this.dialog.close();
  }

  submit() {
    this.formUpdateValueAndValidity();
    if (this.form.valid && this.formTO) {
      this.setFieldValue();
      const submission: Submission = {
        ...this.submission,
        creationDate: moment().toISOString(),
        submissionDateTime: this.datetimepicker.value.toISOString(),
        destinationUser: this.profile.userId,
        status: 'NEW',
        schema: JSON.stringify(this.formTO.fields),
      };
      const request$ = this.submission.id
        ? this.agendaSubmissionsService.updateAgendaSubmission(submission)
        : this.agendaSubmissionsService.createAgendaItem(submission);

      request$.subscribe(submissionResponse => {
        this.dialog.close(submissionResponse);
        this.snackBarService.success(this.translateService.instant('FORM_CONFIGURATION.SUBMISSION_SUCCESS'));
		// this.snackBar.open(this.translateService.instant('FORM_CONFIGURATION.SUBMISSION_SUCCESS'), '', { duration: 1000 });
      });
    }
  }

  formUpdateValueAndValidity() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsTouched();
      this.form.controls[key].updateValueAndValidity();
    });
    this.form.updateValueAndValidity();
  }

  setFieldValue() {
    this.apiReferenceFileds = [];
    let badgeField: Field;
    this.formTO.fields.forEach(field => {
      const control = this.form.controls[field.id];
      const value = control && control.value;
      switch (field.type) {
        case FieldType.TEXT:
          field.text.value = value;
          if (field.text.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.BADGE:
          if (field.badge) {
            badgeField = field;
            field.badge.title = { ...field.badge.title, value: this.title.value };
            if (field.badge.description1 && this.description1) {
              field.badge.description1 = { ...field.badge.description1, value: this.description1.value };
            }
            if (field.badge.description2 && this.description2) {
              field.badge.description2 = { ...field.badge.description1, value: this.description2.value };
            }
            if (field.badge.description3 && this.description3) {
              field.badge.description3 = { ...field.badge.description1, value: this.description3.value };
            }
          }
          break;
        case FieldType.TEXTAREA:
          field.textarea.value = value;
          if (field.textarea.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.DATEPICKER:
          field.datepicker.value = value;
          if (field.datepicker.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.DATETIMEPICKER:
          field.datetimepicker.value = value;
          if (field.datetimepicker.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.RADIO:
          field.radio.values = value;
          if (field.radio.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.NUMERIC:
          field.numeric.value = value;
          if (field.numeric.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.COMBOBOX:
          field.comboBox.values = value;
          if (field.comboBox.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.SELECTBOX:
          field.selectBox.values = value;
          if (field.selectBox.options && field.selectBox.options.some(o => o.apiReference)) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.SWITCHBUTTON:
          field.switchButton.value = value;
          if (field.switchButton.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.CHECKBOX:
          field.checkbox.value = value;
          if (field.checkbox.apiReference) {
            this.apiReferenceFileds.push(field);
          }
          break;
        case FieldType.AUTOCOMPLETE:
          field.autocomplete.values = value;
          if (
            field.autocomplete.service &&
            Object.values(field.autocomplete.service.serviceResponseReference).some(r => r.apiReference)
          ) {
            this.apiReferenceFileds.push(field);
          }
          break;
        default:
      }
    });
    this.buildBadge(badgeField);
  }

  buildBadge(badgeField?: Field) {
    if (!badgeField) {
      const id = uuid();
      this.formTO.fields.push({
        id,
        name: id,
        label: { position: Position.LEFT, hidden: true },
        type: FieldType.BADGE,
        badge: {
          title: { color: '#000000', value: this.title.value },
          backgroundColor: '#FFFFFF'
        },
        required: true,
        hidden: true,
        cols: 0, rows: 0, y: 0, x: 0,
      });
    }
  }
}
