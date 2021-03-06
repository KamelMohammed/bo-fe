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
import { DiagnosiRequest } from './diagnosiRequest';
import { PartecipanteRequest } from './partecipanteRequest';


export interface UpdateTelevisitaRequest { 
    /**
     * Altri partecipanti della televisita
     */
    altriPartecipanti: Array<PartecipanteRequest>;
    /**
     * Data (yyyy-MM-dd)
     */
    data: string;
    /**
     * ID durata
     */
    idDurata: string;
    /**
     * Campo note (medico)
     */
    noteMedico: string;
    /**
     * Ora (hh:mm a)
     */
    ora: string;
    /**
     * Quesiti diagnostici
     */
    quesitiDiagnostici: Array<DiagnosiRequest>;
}
