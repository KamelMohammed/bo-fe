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
import { StatusType } from './statusType';
import { URI } from './uRI';


export interface Problem { 
    detail?: string;
    instance?: URI;
    status?: StatusType;
    title?: string;
    type?: URI;
}
