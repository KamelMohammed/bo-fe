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


export interface TeleconsultoPartecipanteResponse { 
    /**
     * Cognome
     */
    cognome?: string;
    /**
     * Email
     */
    email?: string;
    /**
     * ID partecipante
     */
    id?: string;
    /**
     * Nome
     */
    nome?: string;
    /**
     * Stato
     */
    stato?: TeleconsultoPartecipanteResponse.StatoEnum;
}
export namespace TeleconsultoPartecipanteResponse {
    export type StatoEnum = 'IN_ATTESA' | 'ACCETTATO' | 'RIFIUTATO';
    export const StatoEnum = {
        INATTESA: 'IN_ATTESA' as StatoEnum,
        ACCETTATO: 'ACCETTATO' as StatoEnum,
        RIFIUTATO: 'RIFIUTATO' as StatoEnum
    };
}
