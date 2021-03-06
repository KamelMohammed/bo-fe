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
import { AslDTO } from './aslDTO';
import { CitizenshipDTO } from './citizenshipDTO';
import { CityDTO } from './cityDTO';
import { ContactDTO } from './contactDTO';
import { DistrictDTO } from './districtDTO';
import { NationalityDTO } from './nationalityDTO';
import { NeighborhoodDTO } from './neighborhoodDTO';
import { OtherContactDTO } from './otherContactDTO';
import { StudyDTO } from './studyDTO';


export interface PatientDTO { 
    /**
     * The patient's domicile address
     */
    addressDomicile?: string;
    /**
     * The patient's domicile address number
     */
    addressDomicileNumber?: string;
    /**
     * The patient's residence address
     */
    addressResidence?: string;
    /**
     * The patient's residence address number
     */
    addressResidenceNumber: string;
    /**
     * The patient's asl
     */
    aslId?: AslDTO;
    /**
     * The patient's birth city
     */
    birthCityId?: CityDTO;
    /**
     * The patient's birth date
     */
    birthDate?: Date;
    /**
     * The patient's blood group
     */
    bloodGroup?: string;
    /**
     * The post code of the city domicile
     */
    capDomicile?: string;
    /**
     * The post code of the city residence
     */
    capResidence?: string;
    /**
     * The patient's citizenship
     */
    citizenshipId?: CitizenshipDTO;
    /**
     * The patient's domicile city
     */
    cityDomicileId?: CityDTO;
    /**
     * The patient's residence city
     */
    cityResidenceId?: CityDTO;
    /**
     * The personal contacts
     */
    contacts?: Array<ContactDTO>;
    /**
     * The patient's creation date
     */
    createDate?: Date;
    /**
     * The create user's uuid
     */
    createUserId?: string;
    /**
     * The district of the ASL to which the patient refers
     */
    district?: DistrictDTO;
    /**
     * The patient's health card
     */
    healthCard?: string;
    /**
     * The patient's marital status
     */
    maritalStatus?: number;
    /**
     * The patient's general doctor
     */
    mmg?: string;
    /**
     * The patient's name
     */
    name?: string;
    /**
     * The neighborhood of the city domicile
     */
    neighborhoodDomicileId?: NeighborhoodDTO;
    /**
     * The neighborhood of the city residence
     */
    neighborhoodId?: NeighborhoodDTO;
    /**
     * The contacts associated to the patient
     */
    otherContacts?: Array<OtherContactDTO>;
    /**
     * The patient's obsolete
     */
    patientObsolete?: boolean;
    /**
     * The patient's service type
     */
    serviceType: string;
    /**
     * The patient's sex
     */
    sex?: number;
    /**
     * The patient's nationality
     */
    stateNationalityId?: NationalityDTO;
    /**
     * The patient's study
     */
    study?: StudyDTO;
    /**
     * The patient's surname
     */
    surname?: string;
    /**
     * The patient's typeCode
     */
    typeCode?: string;
    /**
     * The patient's uniqueCode
     */
    uniqueCode: string;
    /**
     * The patient's update date
     */
    updateDate?: Date;
    /**
     * The update user's uuid
     */
    updateUserId?: string;
    /**
     * The patient's uuid
     */
    uuid?: string;
}
