import {dataLinePersistenza} from "./dataLinePersistenza";

export interface PersistenzaResponse{
    name:string;
    fineTerapia:string;
    data:dataLinePersistenza[];
}