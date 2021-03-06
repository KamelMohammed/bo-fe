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
import { DepartmentDto } from './departmentDto';
import { TemplateTypeResponseDto } from './templateTypeResponseDto';


export interface TemplateResponseDto { 
    creationDate?: Date;
    department?: DepartmentDto;
    lastModificationDate?: Date;
    name?: string;
    schema?: string;
    templateType?: TemplateTypeResponseDto;
    user?: string;
    uuid?: string;
    uuidOperativeUnit?: string;
}
