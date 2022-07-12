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
import { CategoryDTO } from './categoryDTO';


export interface ExperimentationResponseDTO { 
    /**
     * The boolean active. Its indicates if the user is user controller or not
     */
    active?: boolean;
    /**
     * The boolean association. Its indicates whether the kit is associated with the patient
     */
    association?: boolean;
    /**
     * The category's uuid
     */
    category: CategoryDTO;
    /**
     * The boolean home care. Its indicates whether the kit is associated with the patient
     */
    homeCare?: boolean;
    /**
     * The experimentation's serial number
     */
    serialNumber: string;
    /**
     * The doctor's uuid
     */
    uuidDoctor: string;
    /**
     * The patient's uuid
     */
    uuidPatient: string;
}
