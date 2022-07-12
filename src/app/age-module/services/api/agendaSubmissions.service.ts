import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { Submission } from '../model/submission';
import { BASE_PATH } from '../variables';

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


@Injectable()
export class AgendaSubmissionsService {

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
     * Create Agenda Item
     *
     * @param submission submission
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createAgendaItem(submission: Submission, observe?: 'body', reportProgress?: boolean): Observable<Submission>;
    public createAgendaItem(submission: Submission, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Submission>>;
    public createAgendaItem(submission: Submission, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Submission>>;
    public createAgendaItem(submission: Submission, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (submission === null || submission === undefined) {
            throw new Error('Required parameter submission was null or undefined when calling createAgendaItem.');
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

        return this.httpClient.post<Submission>(`${this.basePath}/agenda/agesubmission`,
            submission,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete Agenda Submission Item
     *
     * @param submissionId submissionId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteAgendaSubmission(submissionId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public deleteAgendaSubmission(submissionId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public deleteAgendaSubmission(submissionId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public deleteAgendaSubmission(submissionId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (submissionId === null || submissionId === undefined) {
            throw new Error('Required parameter submissionId was null or undefined when calling deleteAgendaSubmission.');
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

        return this.httpClient.delete<string>(`${this.basePath}/agenda/agesubmission/${encodeURIComponent(String(submissionId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find Agenda Submission Item
     *
     * @param submissionId submissionId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAgendaSubmission(submissionId: string, observe?: 'body', reportProgress?: boolean): Observable<Submission>;
    public findAgendaSubmission(submissionId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Submission>>;
    public findAgendaSubmission(submissionId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Submission>>;
    public findAgendaSubmission(submissionId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (submissionId === null || submissionId === undefined) {
            throw new Error('Required parameter submissionId was null or undefined when calling findAgendaSubmission.');
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

        return this.httpClient.get<Submission>(`${this.basePath}/agenda/agesubmission/${encodeURIComponent(String(submissionId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Find Agenda Submission Item
     *
     * @param date date
     * @param userId userId
     * @param pageNumber Results page you want to retrieve (0..N)
     * @param pageSize Number of records per page.
     * @param sort Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAgendaSubmissionsByUserAndDate(date: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<Submission>>;
    public findAgendaSubmissionsByUserAndDate(date: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Submission>>>;
    public findAgendaSubmissionsByUserAndDate(date: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Submission>>>;
    public findAgendaSubmissionsByUserAndDate(date: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling findAgendaSubmissionsByUserAndDate.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling findAgendaSubmissionsByUserAndDate.');
        }




        let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
        if (pageNumber !== undefined && pageNumber !== null) {
            queryParameters = queryParameters.set('pageNumber', <any>pageNumber);
        }
        if (pageSize !== undefined && pageSize !== null) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (sort) {
            sort.forEach((element) => {
                queryParameters = queryParameters.append('sort', <any>element);
            })
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

        return this.httpClient.get<Array<Submission>>(`${this.basePath}/agenda/agesubmission/user/${encodeURIComponent(String(userId))}/date/${encodeURIComponent(String(date))}`,
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
     * Find Agenda Submission Item
     *
     * @param date date
     * @param templateId templateId
     * @param userId userId
     * @param pageNumber Results page you want to retrieve (0..N)
     * @param pageSize Number of records per page.
     * @param sort Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public findAgendaSubmissionsByUserAndDate1(date: string, templateId: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'body', reportProgress?: boolean): Observable<Array<Submission>>;
    public findAgendaSubmissionsByUserAndDate1(date: string, templateId: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<Submission>>>;
    public findAgendaSubmissionsByUserAndDate1(date: string, templateId: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<Submission>>>;
    public findAgendaSubmissionsByUserAndDate1(date: string, templateId: string, userId: string, pageNumber?: number, pageSize?: number, sort?: Array<string>, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling findAgendaSubmissionsByUserAndDate1.');
        }

        if (templateId === null || templateId === undefined) {
            throw new Error('Required parameter templateId was null or undefined when calling findAgendaSubmissionsByUserAndDate1.');
        }

        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling findAgendaSubmissionsByUserAndDate1.');
        }




        let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
        if (pageNumber !== undefined && pageNumber !== null) {
            queryParameters = queryParameters.set('pageNumber', <any>pageNumber);
        }
        if (pageSize !== undefined && pageSize !== null) {
            queryParameters = queryParameters.set('pageSize', <any>pageSize);
        }
        if (sort) {
            sort.forEach((element) => {
                queryParameters = queryParameters.append('sort', <any>element);
            })
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

        return this.httpClient.get<Array<Submission>>(`${this.basePath}/agenda/agesubmission/user/${encodeURIComponent(String(userId))}/date/${encodeURIComponent(String(date))}/template/${encodeURIComponent(String(templateId))}`,
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
     * Update Agenda Submission
     *
     * @param submission submission
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateAgendaSubmission(submission: Submission, observe?: 'body', reportProgress?: boolean): Observable<Submission>;
    public updateAgendaSubmission(submission: Submission, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Submission>>;
    public updateAgendaSubmission(submission: Submission, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Submission>>;
    public updateAgendaSubmission(submission: Submission, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (submission === null || submission === undefined) {
            throw new Error('Required parameter submission was null or undefined when calling updateAgendaSubmission.');
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

        return this.httpClient.put<Submission>(`${this.basePath}/agenda/agesubmission`,
            submission,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
