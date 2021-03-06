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
import { MeasureUnitValue } from './measureUnitValue';


export interface UpdateParameterResponse { 
    alternativeText?: string;
    decimalNumber?: number;
    description?: string;
    maxValue?: number;
    measureUnit?: MeasureUnitValue;
    minValue?: number;
    name?: string;
    note?: string;
    type?: UpdateParameterResponse.TypeEnum;
    uuid?: string;
}
export namespace UpdateParameterResponse {
    export type TypeEnum = 'DECIMALE' | 'VALORI_AMMESSI' | 'STRINGA';
    export const TypeEnum = {
        DECIMALE: 'DECIMALE' as TypeEnum,
        VALORIAMMESSI: 'VALORI_AMMESSI' as TypeEnum,
        STRINGA: 'STRINGA' as TypeEnum
    };
}
