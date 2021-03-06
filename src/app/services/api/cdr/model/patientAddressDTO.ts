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


export interface PatientAddressDTO { 
    /**
     * The patient's domicile address
     */
    addressDomicile: string;
    /**
     * The patient's residence address
     */
    addressResidence: string;
    /**
     * The patient's asl
     */
    aslId?: string;
    /**
     * The post code of the city domicile
     */
    capDomicile: string;
    /**
     * The post code of the city residence
     */
    capResidence: string;
    /**
     * The patient's domicile city
     */
    cityDomicileId: string;
    /**
     * The patient's residence city
     */
    cityResidenceId: string;
    /**
     * The neighborhood of the city residence
     */
    neighborhoodId?: string;
    /**
     * The patient's uuid
     */
    uuid?: string;
}
