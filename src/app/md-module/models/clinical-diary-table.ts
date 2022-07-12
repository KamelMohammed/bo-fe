import { ActivityDTO } from '../../services/api/dia';

export interface ClincalNote {
  role?: string;
  user?: string;
  note: string;
}


export interface ClinicalDiaryDataSource {
  date: string;
  data: ActivityDTO[];
}

export enum ActionEnum {
  DETAILS = 'DETAILS',
  EDIT = 'EDIT',
  SEND = 'SEND',
  DELETE = 'DELETE',
  REJECTION_NOTE = 'REJECTION_NOTE',
  PDF = 'PDF'
}

export enum ActionIconEnum {
  DETAILS = 'sticky_note_2',
  EDIT = 'edit',
  SEND = 'send',
  DELETE = 'delete',
  REJECTION_NOTE = 'sticky_note_2',
  PDF = 'picture_as_pdf'
}
