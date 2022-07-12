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
import { TelevisitaAssistitoResponse } from './televisitaAssistitoResponse';
import { TelevisitaMedicoResponse } from './televisitaMedicoResponse';
import { TelevisitaPartecipanteResponse } from './televisitaPartecipanteResponse';


export interface TelevisitaSezioneAssistitoResponse { 
    /**
     * Altri partecipanti della televisita
     */
    altriPartecipanti?: Array<TelevisitaPartecipanteResponse>;
    /**
     * Assistito
     */
    assistito?: TelevisitaAssistitoResponse;
    /**
     * ID televisita
     */
    id?: string;
    /**
     * Medico
     */
    medico?: TelevisitaMedicoResponse;
    /**
     * Campo motivazione
     */
    motivazione?: string;
    /**
     * Campo note
     */
    note?: string;
    /**
     * Stato
     */
    stato?: TelevisitaSezioneAssistitoResponse.StatoEnum;
}
export namespace TelevisitaSezioneAssistitoResponse {
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