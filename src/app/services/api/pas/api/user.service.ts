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
import { UserRequest } from '../model/userRequest';
import { BASE_PATH } from '../variables';



@Injectable()
export class UserService {

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
   * Change User Password
   *
   * @param userId userId
   * @param userRequest userRequest
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public changePassword(userId: string, userRequest: UserRequest, observe?: 'body', reportProgress?: boolean): Observable<UserRequest>;
  public changePassword(userId: string, userRequest: UserRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<UserRequest>>;
  public changePassword(userId: string, userRequest: UserRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<UserRequest>>;
  public changePassword(userId: string, userRequest: UserRequest, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    if (userId === null || userId === undefined) {
      throw new Error('Required parameter userId was null or undefined when calling changePassword.');
    }

    if (userRequest === null || userRequest === undefined) {
      throw new Error('Required parameter userRequest was null or undefined when calling changePassword.');
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

    return this.httpClient.put<UserRequest>(`${this.basePath}/users/passwordchange/${encodeURIComponent(String(userId))}`,
      userRequest,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

}
