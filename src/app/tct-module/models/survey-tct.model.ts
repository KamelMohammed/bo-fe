import { MedicalRecord } from './../../md-module/models/md.model';
export class Activities {
    public activities: CurrentSurveyResponse[];
}

export class ChartInfo {
    public constructor(
        public medicalRecord: MedicalRecord,
        public activityId: string,
        public activityName:string) {

    }
}


export class CurrentSurveyResponse {
    public activity: Activity;
    public surveys: Survey[];
}

export class SurveyChart {
    public activityId: string;
    public surveys: Survey[];
    public symbol: string;
    public name: string;
}

export class Survey {
    public measurementDate: Date;
    public value: number;
}

export class Activity {
    public id: string;
    public measurementUnit: MeasurementUnit;
    public name: string;
}

export class MeasurementUnit {
    public id: string;
    public name: string;
    public symbol: string;
}
