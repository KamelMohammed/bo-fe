/**
 * Vital Measurement API
 * This is a simple API
 *
 * OpenAPI spec version: 1.0.0
 * Contact: you@your-company.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { PageVitalMeasurementResponseTO } from '../model/pageVitalMeasurementResponseTO';
import { VitalMeasurementRequestTO } from '../model/vitalMeasurementRequestTO';
import { VitalMeasurementResponseTO } from '../model/vitalMeasurementResponseTO';
import { BASE_PATH } from '../variables';



@Injectable()
export class VitalMeasurementService {

  protected basePath = 'https://virtserver.swaggerhub.com/gant85/VitalMeasurement/1.0.0';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }


  /**
   * get an vital measurement list by filter
   * Adds an vital measurement to the system
   * @param medicalReportCode
   * @param vitalParameterCode
   * @param vitalParameterValue
   * @param page Page number of the requested page
   * @param size Size of a page
   * @param sort Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getVitalMeasurementList(medicalReportCode: string, vitalParameterCode?: string, vitalParameterValue?: number, page?: number, size?: number, sort?: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<PageVitalMeasurementResponseTO>;
  public getVitalMeasurementList(medicalReportCode: string, vitalParameterCode?: string, vitalParameterValue?: number, page?: number, size?: number, sort?: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PageVitalMeasurementResponseTO>>;
  public getVitalMeasurementList(medicalReportCode: string, vitalParameterCode?: string, vitalParameterValue?: number, page?: number, size?: number, sort?: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PageVitalMeasurementResponseTO>>;
  public getVitalMeasurementList(medicalReportCode: string, vitalParameterCode?: string, vitalParameterValue?: number, page?: number, size?: number, sort?: Array<string>, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (medicalReportCode === null || medicalReportCode === undefined) {
      throw new Error('Required parameter medicalReportCode was null or undefined when calling getVitalMeasurementList.');
    }






    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (medicalReportCode !== undefined && medicalReportCode !== null) {
      queryParameters = queryParameters.set('medicalReportCode', <any>medicalReportCode);
    }
    if (vitalParameterCode !== undefined && vitalParameterCode !== null) {
      queryParameters = queryParameters.set('vitalParameterCode', <any>vitalParameterCode);
    }
    if (vitalParameterValue !== undefined && vitalParameterValue !== null) {
      queryParameters = queryParameters.set('vitalParameterValue', <any>vitalParameterValue);
    }
    if (page !== undefined && page !== null) {
      queryParameters = queryParameters.set('page', <any>page);
    }
    if (size !== undefined && size !== null) {
      queryParameters = queryParameters.set('size', <any>size);
    }
    if (sort) {
      sort.forEach((element) => {
        queryParameters = queryParameters.append('sort', <any>element);
      })
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json'
    ];

    return this.httpClient.get<PageVitalMeasurementResponseTO>(`${this.basePath}/getVitalMeasurementList`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * adds an vital measurement
   * Adds an vital measurement to the system
   * @param vitalMeasurement Vital Measurement to add
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public saveVitalMeasurement(vitalMeasurement?: VitalMeasurementRequestTO, observe?: 'body', reportProgress?: boolean): Observable<VitalMeasurementResponseTO>;
  public saveVitalMeasurement(vitalMeasurement?: VitalMeasurementRequestTO, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<VitalMeasurementResponseTO>>;
  public saveVitalMeasurement(vitalMeasurement?: VitalMeasurementRequestTO, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<VitalMeasurementResponseTO>>;
  public saveVitalMeasurement(vitalMeasurement?: VitalMeasurementRequestTO, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json'
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.post<VitalMeasurementResponseTO>(`${this.basePath}/saveVitalMeasurement`,
      vitalMeasurement,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
