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
import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';




@Injectable()
export class OperationHandlerService {

  protected basePath = 'https://fidcaresvil.kiranet.it';
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
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/health/**`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET1(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET1(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET1(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET1(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/health`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET2(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET2(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET2(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET2(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/octet-stream'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/heapdump`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET3(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET3(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET3(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET3(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/info`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET4(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET4(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET4(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET4(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/loggers/${encodeURIComponent(String(name))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET5(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET5(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET5(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET5(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/loggers`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET6(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET6(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET6(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET6(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/metrics/${encodeURIComponent(String(requiredMetricName))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET7(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET7(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET7(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET7(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/metrics`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingGET8(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingGET8(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingGET8(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingGET8(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'text/plain;charset=UTF-8',
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.get<any>(`${this.basePath}/actuator/threaddump`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * handle
   *
   * @param body body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public handleUsingPOST(body?: any, observe?: 'body', reportProgress?: boolean): Observable<any>;
  public handleUsingPOST(body?: any, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
  public handleUsingPOST(body?: any, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
  public handleUsingPOST(body?: any, observe: any = 'body', reportProgress: boolean = false): Observable<any> {


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
      'application/vnd.spring-boot.actuator.v3+json',
      'application/json',
      'application/vnd.spring-boot.actuator.v2+json'
    ];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.post<any>(`${this.basePath}/actuator/loggers/${encodeURIComponent(String(name))}`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
function requiredMetricName(requiredMetricName: any): string | number | boolean {
  throw new Error('Function not implemented.');
}
