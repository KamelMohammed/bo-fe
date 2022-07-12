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
import { NationalityDTO } from '../model/nationalityDTO';
import { BASE_PATH } from '../variables';



@Injectable()
export class NationalityControllerService {

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
   * View single nationality by id
   *
   * @param uuid Id of the nationality
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getNationalityUsingGET(uuid: string, observe?: 'body', reportProgress?: boolean): Observable<NationalityDTO>;
  public getNationalityUsingGET(uuid: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<NationalityDTO>>;
  public getNationalityUsingGET(uuid: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<NationalityDTO>>;
  public getNationalityUsingGET(uuid: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling getNationalityUsingGET.');
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

    return this.httpClient.get<NationalityDTO>(`${this.basePath}/nationalities/${encodeURIComponent(String(uuid))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * View a list of nationalities
   *
   * @param description Nationality description
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public loadNationalitiesByDescriptionUsingGET(description: string, observe?: 'body', reportProgress?: boolean): Observable<Array<NationalityDTO>>;
  public loadNationalitiesByDescriptionUsingGET(description: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<NationalityDTO>>>;
  public loadNationalitiesByDescriptionUsingGET(description: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<NationalityDTO>>>;
  public loadNationalitiesByDescriptionUsingGET(description: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (description === null || description === undefined) {
      throw new Error('Required parameter description was null or undefined when calling loadNationalitiesByDescriptionUsingGET.');
    }

    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (description !== undefined && description !== null) {
      queryParameters = queryParameters.set('description', <any>description);
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

    return this.httpClient.get<Array<NationalityDTO>>(`${this.basePath}/nationalities/description`,
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
   * View a list of nationalities
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public loadNationalitiesUsingGET(observe?: 'body', reportProgress?: boolean): Observable<Array<NationalityDTO>>;
  public loadNationalitiesUsingGET(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<NationalityDTO>>>;
  public loadNationalitiesUsingGET(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<NationalityDTO>>>;
  public loadNationalitiesUsingGET(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

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

    return this.httpClient.get<Array<NationalityDTO>>(`${this.basePath}/nationalities`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
