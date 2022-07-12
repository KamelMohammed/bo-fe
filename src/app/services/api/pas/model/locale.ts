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
import { Character } from './character';


export interface Locale { 
    country?: string;
    displayCountry?: string;
    displayLanguage?: string;
    displayName?: string;
    displayScript?: string;
    displayVariant?: string;
    extensionKeys?: Array<Character>;
    iso3Country?: string;
    iso3Language?: string;
    language?: string;
    script?: string;
    unicodeLocaleAttributes?: Array<string>;
    unicodeLocaleKeys?: Array<string>;
    variant?: string;
}