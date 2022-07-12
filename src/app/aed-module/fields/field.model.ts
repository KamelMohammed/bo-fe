import { GridsterItem } from '../../shared/gridster/gridster-item.interface';

export interface Field extends GridsterItem {
  id?: string;
  name: string;
  label?: Label;
  type: FieldType;
  text?: Text;
  textarea?: Textarea;
  radio?: Radio;
  datepicker?: Datepicker;
  numeric?: Numeric;
  comboBox?: ComboBox;
  selectBox?: SelectBox;
  switchButton?: SwitchButton;
  checkbox?: Checkbox;
  section?: Section;
  staticText?: StaticText;
  height?: Height;
  weight?: Weight;
  diagnosis?: Diagnosis;
  activesubstanceallergies?: ActiveSubstanceAllergies;
  commercialdrugallergies?: CommercialDrugAllergies;
  required: boolean;
  sdo: boolean;
  sda: boolean;
}

export enum FieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  DATEPICKER = 'DATEPICKER',
  RADIO = 'RADIO',
  NUMERIC = 'NUMERIC',
  COMBOBOX = 'COMBOBOX',
  SELECTBOX = 'SELECTBOX',
  SWITCHBUTTON = 'SWITCHBUTTON',
  CHECKBOX = 'CHECKBOX',
  SECTION = 'SECTION',
  STATICTEXT = 'STATICTEXT',
  HEIGHT = 'HEIGHT',
  WEIGHT = 'WEIGHT',
  DIAGNOSIS = 'DIAGNOSIS',
  COMMERCIALDRUGALLERGIES = 'COMMERCIALDRUGALLERGIES',
  ACTIVESUBSTANCEALLERGIES = 'ACTIVESUBSTANCEALLERGIES',
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

export interface Text {
  hasDefaultValue: boolean;
  defaultValue?: string;
  readonly: boolean;
  value?: string;
}

export interface Height {
  uuid?: string;
  readonly: boolean;
  value?: number;
}

export interface Weight {
  uuid?: string;
  readonly: boolean;
  value?: number;
}

export interface ServiceResponse {
  id: string;
  value: string;
}

export interface Diagnosis {
  uuid?: string;
  service?: string;
  readonly: boolean;
  values?: ServiceResponse[];
}

export interface CommercialDrugAllergies {
  uuid?: string;
  service?: string;
  readonly: boolean;
  values?: ServiceResponse[];
}

export interface ActiveSubstanceAllergies {
  uuid?: string;
  service?: string;
  readonly: boolean;
  values?: ServiceResponse[];
}
export interface Textarea {
  readonly: boolean;
  value?: string;
}

export interface Radio {
  options: RadioOption[];
  position: Position;
  readonly: boolean;
  values?: string[];
}

export interface RadioOption {
  label: string;
  value: string;
  hasDefaultValue: boolean;
}

export interface Datepicker {
  readonly: boolean;
  value?: string;
}

export interface Numeric {
  hasDefaultValue: boolean;
  defaultValue?: string;
  hasUnitOfMeasure: boolean;
  unitOfMeasure?: NumericUnitOfMeasure;
  readonly: boolean;
  value?: number;
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
}

export interface ComboBoxOption {
  label: string;
  value: string;
  hasDefaultValue: boolean;
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
}

export interface SwitchButton {
  options: SwitchButtonOption[];
  readonly: boolean;
  value?: boolean;
}

export interface SwitchButtonOption {
  label: string;
  labelHidden: boolean;
  value: string;
  hasDefaultValue: boolean;
}

export interface Checkbox {
  readonly: boolean;
  value?: boolean;
}

export interface Section {
  readonly: boolean;
}

export interface StaticText {
  value: string;
}
