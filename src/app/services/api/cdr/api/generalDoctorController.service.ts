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
import { GeneralDoctorDTO } from '../model/generalDoctorDTO';
import { BASE_PATH } from '../variables';



@Injectable()
export class GeneralDoctorControllerService {

  protected basePath = 'https://fidcare.kiranet.it/api/cdr';
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
   * Create a relation between Patient and Doctor
   *
   * @param generalDoctorUuid Doctor&#39;s id
   * @param patientUuid Patient&#39;s id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public assignPatientUsingPUT(generalDoctorUuid: string, patientUuid: string, observe?: 'body', reportProgress?: boolean): Observable<boolean>;
  public assignPatientUsingPUT(generalDoctorUuid: string, patientUuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<boolean>>;
  public assignPatientUsingPUT(generalDoctorUuid: string, patientUuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<boolean>>;
  public assignPatientUsingPUT(generalDoctorUuid: string, patientUuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (generalDoctorUuid === null || generalDoctorUuid === undefined) {
      throw new Error('Required parameter generalDoctorUuid was null or undefined when calling assignPatientUsingPUT.');
    }

    if (patientUuid === null || patientUuid === undefined) {
      throw new Error('Required parameter patientUuid was null or undefined when calling assignPatientUsingPUT.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (generalDoctorUuid !== undefined && generalDoctorUuid !== null) {
      queryParameters = queryParameters.set('generalDoctorUuid', <any>generalDoctorUuid);
    }
    if (patientUuid !== undefined && patientUuid !== null) {
      queryParameters = queryParameters.set('patientUuid', <any>patientUuid);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
      'application/json'
    ];

    return this.httpClient.put<boolean>(`${this.basePath}/generalDoctors`,
      null,
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
   * Delete existing doctor by id
   *
   * @param uuid Doctor&#39;s id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteGeneralDoctorUsingDELETE(uuid: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public deleteGeneralDoctorUsingDELETE(uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public deleteGeneralDoctorUsingDELETE(uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public deleteGeneralDoctorUsingDELETE(uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling deleteGeneralDoctorUsingDELETE.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.delete<any>(`${this.basePath}/generalDoctors/${encodeURIComponent(String(uuid))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * View doctor by id
   *
   * @param uuid Id of the doctor
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getGeneralDoctorUsingGET(uuid: string, observe?: 'body', reportProgress?: boolean): Observable<GeneralDoctorDTO>;
  public getGeneralDoctorUsingGET(uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GeneralDoctorDTO>>;
  public getGeneralDoctorUsingGET(uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GeneralDoctorDTO>>;
  public getGeneralDoctorUsingGET(uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling getGeneralDoctorUsingGET.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];

    return this.httpClient.get<GeneralDoctorDTO>(`${this.basePath}/generalDoctors/${encodeURIComponent(String(uuid))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Save new doctor
   *
   * @param generalDoctor Full doctor&#39;s information
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public saveNewGeneralDoctorUsingPOST(generalDoctor: GeneralDoctorDTO, observe?: 'body', reportProgress?: boolean): Observable<string>;
  public saveNewGeneralDoctorUsingPOST(generalDoctor: GeneralDoctorDTO, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
  public saveNewGeneralDoctorUsingPOST(generalDoctor: GeneralDoctorDTO, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
  public saveNewGeneralDoctorUsingPOST(generalDoctor: GeneralDoctorDTO, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (generalDoctor === null || generalDoctor === undefined) {
      throw new Error('Required parameter generalDoctor was null or undefined when calling saveNewGeneralDoctorUsingPOST.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
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

    return this.httpClient.post<string>(`${this.basePath}/generalDoctors`,
      generalDoctor,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * Update existing doctor by id
   *
   * @param generalDoctor Doctor&#39;s information
   * @param uuid Doctor&#39;s id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateGeneralDoctorUsingPUT(generalDoctor: GeneralDoctorDTO, uuid: string, observe?: 'body', reportProgress?: boolean): Observable<GeneralDoctorDTO>;
  public updateGeneralDoctorUsingPUT(generalDoctor: GeneralDoctorDTO, uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<GeneralDoctorDTO>>;
  public updateGeneralDoctorUsingPUT(generalDoctor: GeneralDoctorDTO, uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<GeneralDoctorDTO>>;
  public updateGeneralDoctorUsingPUT(generalDoctor: GeneralDoctorDTO, uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (generalDoctor === null || generalDoctor === undefined) {
      throw new Error('Required parameter generalDoctor was null or undefined when calling updateGeneralDoctorUsingPUT.');
    }

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling updateGeneralDoctorUsingPUT.');
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
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

    return this.httpClient.put<GeneralDoctorDTO>(`${this.basePath}/generalDoctors/${encodeURIComponent(String(uuid))}`,
      generalDoctor,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
