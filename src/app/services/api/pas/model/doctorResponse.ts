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
import { DistrictResponse } from './districtResponse';


export interface DoctorResponse { 
    districts?: Array<DistrictResponse>;
    doctorCode?: string;
    doctorDescription?: string;
    doctorEmail?: string;
    doctorId?: string;
    doctorName?: string;
    doctorSurname?: string;
    doctorType?: string;
}
