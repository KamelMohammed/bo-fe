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

import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';

import { FindPatologyResponse } from '../model/findPatologyResponse';
import { PathologyDto } from '../model/pathologyDto';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';


@Injectable()
export class PathologyService {

    protected basePath = 'https://fidcaresvil.kiranet.it/api/atm';
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
     * listPathologies
     * List the pathologies filtered by name
     * @param pathologyName Pathology&#39;s name
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listPathologies(pathologyName: string, observe?: 'body', reportProgress?: boolean): Observable<Array<FindPatologyResponse>>;
    public listPathologies(pathologyName: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<FindPatologyResponse>>>;
    public listPathologies(pathologyName: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<FindPatologyResponse>>>;
    public listPathologies(pathologyName: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (pathologyName === null || pathologyName === undefined) {
            throw new Error('Required parameter pathologyName was null or undefined when calling listPathologies.');
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

        return this.httpClient.get<Array<FindPatologyResponse>>(`${this.basePath}/pathologies/${encodeURIComponent(String(pathologyName))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * listPathologies
     * List all the pathologies
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public listPathologies1(observe?: 'body', reportProgress?: boolean): Observable<Array<PathologyDto>>;
    public listPathologies1(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<PathologyDto>>>;
    public listPathologies1(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<PathologyDto>>>;
    public listPathologies1(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

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

        return this.httpClient.get<Array<PathologyDto>>(`${this.basePath}/pathologies`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
