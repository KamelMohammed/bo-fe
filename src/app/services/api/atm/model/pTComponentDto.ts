/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { DrugDto } from './drugDto';


export interface PTComponentDto { 
    administrationRoute?: string;
    componentId?: string;
    drug?: DrugDto;
    drugUUID?: string;
    name?: string;
    note?: string;
    posology?: PTComponentDto.PosologyEnum;
    posologyParam?: Array<number>;
    quantity?: number;
    reason?: string;
    recoverAdministration?: boolean;
    replaceable?: boolean;
    timeWindows?: number;
    timing?: PTComponentDto.TimingEnum;
    timingParam?: Array<number>;
}
export namespace PTComponentDto {
    export type PosologyEnum = 'DAILY' | 'DAYS_OF_WEEK' | 'DAYS_OF_MONTH' | 'EXACT_DAYS_OF_MONTH' | 'EXACT_DAYS_OF_WEEK';
    export const PosologyEnum = {
        DAILY: 'DAILY' as PosologyEnum,
        DAYSOFWEEK: 'DAYS_OF_WEEK' as PosologyEnum,
        DAYSOFMONTH: 'DAYS_OF_MONTH' as PosologyEnum,
        EXACTDAYSOFMONTH: 'EXACT_DAYS_OF_MONTH' as PosologyEnum,
        EXACTDAYSOFWEEK: 'EXACT_DAYS_OF_WEEK' as PosologyEnum
    };
    export type TimingEnum = 'EVERY_HOURS' | 'SPECIFIC_HOUR';
    export const TimingEnum = {
        EVERYHOURS: 'EVERY_HOURS' as TimingEnum,
        SPECIFICHOUR: 'SPECIFIC_HOUR' as TimingEnum
    };
}
