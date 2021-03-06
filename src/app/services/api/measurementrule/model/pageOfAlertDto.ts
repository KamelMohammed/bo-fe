/**
 * measurementrule API
 * measurementrule API documentation
 *
 * OpenAPI spec version: 0.0.3
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AlertDto } from './alertDto';
import { Sort } from './sort';


export interface PageOfAlertDto { 
    content?: Array<AlertDto>;
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    size?: number;
    sort?: Sort;
    totalElements?: number;
    totalPages?: number;
}
