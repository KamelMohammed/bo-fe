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


export interface AlertDto {
  active?: boolean;
  alertConfigRef?: string;
  alertDate?: Date;
  id?: string;
  measureUnitId?: string;
  measureUnitSymbol?: string;
  measurementCode?: string;
  measurementDescription?: string;
  medicalRecordCode?: string;
  value?: number;
}