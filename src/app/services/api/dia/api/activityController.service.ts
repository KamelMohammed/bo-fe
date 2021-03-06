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
/* tslint:disable:no-unused-variable member-ordering */
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { ActivityDTO } from '../model/activityDTO';
import { BASE_PATH } from '../variables';



@Injectable()
export class ActivityControllerService {

  protected basePath = 'https://fidcare.kiranet.it/api/dia';
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
   * Save new activity
   *
   * @param body Full activity&#39;s information
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createDiaActivityUsingPOST(body: ActivityDTO, observe?: 'body', reportProgress?: boolean): Observable<ActivityDTO>;
  public createDiaActivityUsingPOST(body: ActivityDTO, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ActivityDTO>>;
  public createDiaActivityUsingPOST(body: ActivityDTO, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ActivityDTO>>;
  public createDiaActivityUsingPOST(body: ActivityDTO, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling createDiaActivityUsingPOST.');
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
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.post<ActivityDTO>(`${this.basePath}/diaActivity`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Delete activity by uuid
   *
   * @param operatorId Operator&#39;s uuid
   * @param uuid Activity&#39;s uuid
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteDiaActivityUsingDELETE(operatorId: string, uuid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public deleteDiaActivityUsingDELETE(operatorId: string, uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public deleteDiaActivityUsingDELETE(operatorId: string, uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public deleteDiaActivityUsingDELETE(operatorId: string, uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (operatorId === null || operatorId === undefined) {
      throw new Error('Required parameter operatorId was null or undefined when calling deleteDiaActivityUsingDELETE.');
    }

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling deleteDiaActivityUsingDELETE.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (operatorId !== undefined && operatorId !== null) {
      queryParameters = queryParameters.set('operatorId', <any>operatorId);
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
    ];

    return this.httpClient.delete<any>(`${this.basePath}/diaActivity/${encodeURIComponent(String(uuid))}`,
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
   * Find activities by medical record uuid
   *
   * @param medicalRecordId Medical record&#39;s uuid
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getDiaAllActivityUsingGET(medicalRecordId: string, observe?: 'body', reportProgress?: boolean): Observable<Array<ActivityDTO>>;
  public getDiaAllActivityUsingGET(medicalRecordId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ActivityDTO>>>;
  public getDiaAllActivityUsingGET(medicalRecordId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ActivityDTO>>>;
  public getDiaAllActivityUsingGET(medicalRecordId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (medicalRecordId === null || medicalRecordId === undefined) {
      throw new Error('Required parameter medicalRecordId was null or undefined when calling getDiaAllActivityUsingGET.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (medicalRecordId !== undefined && medicalRecordId !== null) {
      queryParameters = queryParameters.set('medicalRecordId', <any>medicalRecordId);
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
    ];

    return this.httpClient.get<Array<ActivityDTO>>(`${this.basePath}/diaActivity/getAllActivity`,
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
   * Find activity by uuid
   *
   * @param uuid Activity&#39;s uuid
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getDiaDocumentUsingGET(uuid: string, observe?: 'body', reportProgress?: boolean): Observable<ActivityDTO>;
  public getDiaDocumentUsingGET(uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ActivityDTO>>;
  public getDiaDocumentUsingGET(uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ActivityDTO>>;
  public getDiaDocumentUsingGET(uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling getDiaDocumentUsingGET.');
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
    ];

    return this.httpClient.get<ActivityDTO>(`${this.basePath}/diaActivity/${encodeURIComponent(String(uuid))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
