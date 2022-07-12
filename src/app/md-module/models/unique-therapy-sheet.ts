export interface UniqueTherapySheet {
    [key: string]: any;
  }
  
  export interface SomminitrationTime {
    time: string;
    type: string;
  }
  
  export enum StatusEnum {
    TEMPORAL_WINDOW = 'UNIQUE_THERAPY_SHEET.TEMPORAL_WINDOW',
    TO_ADMINISTER = 'UNIQUE_THERAPY_SHEET.TO_ADMINISTER',
    ADMINISTRATED = 'UNIQUE_THERAPY_SHEET.ADMINISTRATED',
    NO_ADMINISTRATION = 'UNIQUE_THERAPY_SHEET.NO_ADMINISTRATION'
  }
  
  export enum StatusIconEnum {
    TEMPORAL_WINDOW = 'stop_circle',
    TO_ADMINISTER = 'stop_circle',
    ADMINISTRATED = 'stop_circle',
    NO_ADMINISTRATION = 'close'
  }
  