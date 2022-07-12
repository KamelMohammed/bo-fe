import { GridsterItem } from "app/shared/gridster/gridster-item.interface";

export interface Field extends GridsterItem {
  id?: string;
  name: string;
  label?: Label;
  type: FieldType;
  text?: Text;
  badge?: Badge;
  textarea?: Textarea;
  radio?: Radio;
  datepicker?: Datepicker;
  datetimepicker?: DateTimepicker;
  numeric?: Numeric;
  comboBox?: ComboBox;
  selectBox?: SelectBox;
  switchButton?: SwitchButton;
  checkbox?: Checkbox;
  section?: Section;
  staticText?: StaticText;
  autocomplete?: Autocomplete;
  button?: Button;
  required: boolean;
  hidden?: boolean;
}

export enum FieldType {
  TEXT = 'TEXT',
  BADGE = 'BADGE',
  TEXTAREA = 'TEXTAREA',
  DATEPICKER = 'DATEPICKER',
  DATETIMEPICKER = 'DATETIMEPICKER',
  RADIO = 'RADIO',
  NUMERIC = 'NUMERIC',
  COMBOBOX = 'COMBOBOX',
  SELECTBOX = 'SELECTBOX',
  SWITCHBUTTON = 'SWITCHBUTTON',
  CHECKBOX = 'CHECKBOX',
  SECTION = 'SECTION',
  STATICTEXT = 'STATICTEXT',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  BUTTON = 'BUTTON'
}

export interface Label {
  label?: string;
  hidden: boolean;
  position?: Position;
}

export enum Position {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER'
}

export interface MessageReference {
  fieldName: string;
  fieldValue?: string;
  fieldType: FieldType;
}

export interface ApiReference {
  fieldName: string;
  fieldValue?: string;
  fieldType: FieldType;
}

export interface Text {
  hasDefaultValue: boolean;
  defaultValue?: string;
  readonly: boolean;
  value?: string;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Badge {
  title: {
    value: string;
    color: string;
  };
  description1?: {
    value: string;
    color: string;
    hidden: boolean;
    messageReference?: MessageReference;
  };
  description2?: {
    value: string;
    color: string;
    hidden: boolean;
    messageReference?: MessageReference;
  };
  description3?: {
    value: string;
    color: string;
    hidden: boolean;
    messageReference?: MessageReference;
  };
  backgroundColor: string;
  linkBasePath?: string;
  linkPath?: string;
}

export interface Textarea {
  readonly: boolean;
  value?: string;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Radio {
  options: RadioOption[];
  position: Position;
  readonly: boolean;
  values?: string[];
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface RadioOption {
  label: string;
  value: string;
  hasDefaultValue: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Datepicker {
  readonly: boolean;
  value?: string;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface DateTimepicker {
  readonly: boolean;
  value?: string;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Numeric {
  hasDefaultValue: boolean;
  defaultValue?: string;
  hasUnitOfMeasure: boolean;
  unitOfMeasure?: NumericUnitOfMeasure;
  readonly: boolean;
  value?: number;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export enum NumericUnitOfMeasure {
  KG = 'KG',
  KGLT = 'KGLT',
  MT = 'MT'
}

export interface ComboBox {
  options: ComboBoxOption[];
  position: Position;
  readonly: boolean;
  values?: string[];
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface ComboBoxOption {
  label: string;
  value: string;
  hasDefaultValue: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface SelectBox {
  options: SelectBoxOption[];
  position: Position;
  readonly: boolean;
  values?: string[];
}

export interface SelectBoxOption {
  label: string;
  value: string;
  hasDefaultValue: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface SwitchButton {
  options: SwitchButtonOption[];
  readonly: boolean;
  value?: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface SwitchButtonOption {
  label: string;
  labelHidden: boolean;
  value: string;
  hasDefaultValue: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Checkbox {
  readonly: boolean;
  value?: boolean;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Section {
  readonly: boolean;
}

export interface StaticText {
  value: string;
}

export interface Button {
  basePath?: string;
  path?: string;
  method?: ServiceMethodEnum;
}
export interface Autocomplete {
  readonly: boolean;
  service?: AutocompleteService;
  values?: ServiceResponse[];
}

export interface AutocompleteService {
  basePath?: string;
  path: string;
  method: ServiceMethodEnum;
  searchReference: string;
  searchReferenceParamType: ServiceParamTypeEnum;
  serviceResponseReference: ServiceResponseReference;
}

export enum ServiceMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum ServiceParamTypeEnum {
  QUERY = 'QUERY',
  PATH = 'PATH',
  BODY = 'BODY',
}

export interface ServiceResponse {
  id: string;
  value: string;
  [propName: string]: string;
}

export interface ServiceResponseReference {
  id: ServiceResponseReferenceKey;
  value: ServiceResponseReferenceKey;
  [propName: string]: ServiceResponseReferenceKey;
}

export interface ServiceResponseReferenceKey {
  key: string;
  messageReference?: MessageReference;
  apiReference?: ApiReference;
}

export interface Reference {
  key: string;
  kies: string[];
  serviceResponseReferenceKey: string;
}
export interface ReferenceData {
  key: string;
  serviceResponseReferenceKey: string;
  value: any;
}
