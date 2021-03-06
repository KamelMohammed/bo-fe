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
import { TelevisitaDiagnosiResponse } from './televisitaDiagnosiResponse';
import { TelevisitaDurataResponse } from './televisitaDurataResponse';
import { TelevisitaPartecipanteResponse } from './televisitaPartecipanteResponse';


export interface UpdateTelevisitaResponse { 
    /**
     * Altri partecipanti della televisita
     */
    altriPartecipanti?: Array<TelevisitaPartecipanteResponse>;
    /**
     * Data (yyyy-MM-dd)
     */
    data?: string;
    /**
     * Durata
     */
    durata?: TelevisitaDurataResponse;
    /**
     * Campo note (medico)
     */
    noteMedico?: string;
    /**
     * Ora (hh:mm a)
     */
    ora?: string;
    /**
     * Quesiti diagnostici
     */
    quesitiDiagnostici?: Array<TelevisitaDiagnosiResponse>;
    /**
     * Stato
     */
    stato?: UpdateTelevisitaResponse.StatoEnum;
}
export namespace UpdateTelevisitaResponse {
    export type StatoEnum = 'PRESENTATA' | 'RITIRATA' | 'RESPINTA' | 'PRESA_IN_CARICO' | 'RIFIUTATA' | 'ACCETTATA' | 'SCADUTA' | 'IN_CORSO' | 'EFFETTUATA' | 'INTERROTTA';
    export const StatoEnum = {
        PRESENTATA: 'PRESENTATA' as StatoEnum,
        RITIRATA: 'RITIRATA' as StatoEnum,
        RESPINTA: 'RESPINTA' as StatoEnum,
        PRESAINCARICO: 'PRESA_IN_CARICO' as StatoEnum,
        RIFIUTATA: 'RIFIUTATA' as StatoEnum,
        ACCETTATA: 'ACCETTATA' as StatoEnum,
        SCADUTA: 'SCADUTA' as StatoEnum,
        INCORSO: 'IN_CORSO' as StatoEnum,
        EFFETTUATA: 'EFFETTUATA' as StatoEnum,
        INTERROTTA: 'INTERROTTA' as StatoEnum
    };
}
