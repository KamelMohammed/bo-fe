/**
 * Vital Measurement API
 * This is a simple API
 *
 * OpenAPI spec version: 1.0.0
 * Contact: you@your-company.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface VitalMeasurementResponseTO { 
    medicalReportCode?: string;
    vitalParameterCode?: string;
    doctorCode?: string;
    districtCode?: string;
    patientCode?: string;
    vitalParameterValue?: number;
    vitalParameterMeasurementDate?: Date;
}