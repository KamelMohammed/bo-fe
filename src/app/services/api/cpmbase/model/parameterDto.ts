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
import { MeasureUnitDto } from './measureUnitDto';


export interface ParameterDto { 
    alternativeText?: string;
    decimalNumber?: number;
    description?: string;
    maxValue?: number;
    measureUnit?: MeasureUnitDto;
    minValue?: number;
    name?: string;
    note?: string;
    type?: ParameterDto.TypeEnum;
    uuid?: string;
}
export namespace ParameterDto {
    export type TypeEnum = 'DECIMALE' | 'VALORI_AMMESSI' | 'STRINGA';
    export const TypeEnum = {
        DECIMALE: 'DECIMALE' as TypeEnum,
        VALORIAMMESSI: 'VALORI_AMMESSI' as TypeEnum,
        STRINGA: 'STRINGA' as TypeEnum
    };
}
