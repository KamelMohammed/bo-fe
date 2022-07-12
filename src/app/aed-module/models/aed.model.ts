import { TemplateTypeResponseDto } from '../../services/api/aed';
import { Field } from '../fields/field.model';

export interface DepartmentTO {
  uuid: string;
  name: string;
  id: number;
}

export interface WrapperTO {
  uuid: string;
  name: string;
  schema: FormTO;
  type: string;
  department: DepartmentTO;
}

export interface FormTO {
  id: string;
  ward: string;
  type: TemplateTypeResponseDto;
  defaultType?: TemplateTypeResponseDto;
  name: string;
  fields: Field[];
}

export enum ActionEnum {
  EDIT = 'EDIT',
  DUPLICATE = 'DUPLICATE',
  DELETE = 'DELETE',
  PREVIEW = 'PREVIEW'
}

export enum ActionIconEnum {
  EDIT = 'edit',
  DUPLICATE = 'content_copy',
  DELETE = 'delete',
  PREVIEW = 'preview'
}
