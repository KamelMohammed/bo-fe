import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { AdministrationDetailsTOResponse } from '../model/administrationDetailsTOResponse';
import { AgendaDto } from '../model/agendaDto';
import { CheckAicRequest } from '../model/checkAicRequest';
import { CheckAicResponse } from '../model/checkAicResponse';
import { DiaryResponseTO } from '../model/diaryResponseTO';
import { UpdateAdministrationRequest } from '../model/updateAdministrationRequest';
import { UpdateAdministrationResponse } from '../model/updateAdministrationResponse';
import { BASE_PATH } from '../variables';
import { AdministrationNoteRequest } from './../model/administrationNoteRequest';
import { AdministrationsByDoctorDto } from './../model/administrationsByDoctorDto';
import { MissedAdministrationRequest } from './../model/missedAdministrationRequest';
import { PTComponentTO } from './../model/pTComponentTO';

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
export class AdministrationService {

    protected basePath = 'https://fidcarefe.dev.kiranet.it/api/atm';
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
       * Mark the given administration as submitted
       *
       * @param administrationId administrationId
       * @param date date
       * @param status status
       * @param time time
       * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
       * @param reportProgress flag to report request and response progress.
       */
    public administerUsingPOST(administrationId: string, date: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', time: string, observe?: 'body', reportProgress?: boolean): Observable<PTComponentTO>;
    public administerUsingPOST(administrationId: string, date: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', time: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PTComponentTO>>;
    public administerUsingPOST(administrationId: string, date: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', time: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PTComponentTO>>;
    public administerUsingPOST(administrationId: string, date: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', time: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (administrationId === null || administrationId === undefined) {
            throw new Error('Required parameter administrationId was null or undefined when calling administerUsingPOST.');
        }

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling administerUsingPOST.');
        }

        if (status === null || status === undefined) {
            throw new Error('Required parameter status was null or undefined when calling administerUsingPOST.');
        }

        if (time === null || time === undefined) {
            throw new Error('Required parameter time was null or undefined when calling administerUsingPOST.');
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

        return this.httpClient.post<PTComponentTO>(`${this.basePath}/administrations/administer/${encodeURIComponent(String(administrationId))}/${encodeURIComponent(String(date))}/${String(time)}/${encodeURIComponent(String(status))}`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
       * Mark the given administration as cancel
       *
       * @param administrationId administrationId
       * @param status status
       * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
       * @param reportProgress flag to report request and response progress.
       */
    public cancelUsingPOST(administrationId: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', observe?: 'body', reportProgress?: boolean): Observable<PTComponentTO>;
    public cancelUsingPOST(administrationId: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PTComponentTO>>;
    public cancelUsingPOST(administrationId: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PTComponentTO>>;
    public cancelUsingPOST(administrationId: string, status: 'TO_READ' | 'READ' | 'NOT_AVAILABLE', observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (administrationId === null || administrationId === undefined) {
            throw new Error('Required parameter administrationId was null or undefined when calling cancelUsingPOST.');
        }

        if (status === null || status === undefined) {
            throw new Error('Required parameter status was null or undefined when calling cancelUsingPOST.');
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

        return this.httpClient.post<PTComponentTO>(`${this.basePath}/administrations/cancel/${encodeURIComponent(String(administrationId))}/${encodeURIComponent(String(status))}`,
            null,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
       * Update the administrations of the selected patient, from the medical record id.
       *
       * @param request request
       * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
       * @param reportProgress flag to report request and response progress.
       */
    public changeCsStateUsingPUT(request: UpdateAdministrationRequest, observe?: 'body', reportProgress?: boolean): Observable<UpdateAdministrationResponse>;
    public changeCsStateUsingPUT(request: UpdateAdministrationRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<UpdateAdministrationResponse>>;
    public changeCsStateUsingPUT(request: UpdateAdministrationRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<UpdateAdministrationResponse>>;
    public changeCsStateUsingPUT(request: UpdateAdministrationRequest, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling changeCsStateUsingPUT.');
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

        return this.httpClient.put<UpdateAdministrationResponse>(`${this.basePath}/administrations/updateAdministrations`,
            request,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * verify drugs
     * Identify drugs in therapy
     * @param request request
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public checkAIC(request: CheckAicRequest, observe?: 'body', reportProgress?: boolean): Observable<CheckAicResponse>;
    public checkAIC(request: CheckAicRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CheckAicResponse>>;
    public checkAIC(request: CheckAicRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CheckAicResponse>>;
    public checkAIC(request: CheckAicRequest, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling checkAIC.');
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

        return this.httpClient.post<CheckAicResponse>(`${this.basePath}/administrations/checkaic`,
            request,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns the list of the daily administrations of the selected patient, from the medical record id.
     *
     * @param date date
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDailyAdminitrationsUsingGET(date: string, observe?: 'body', reportProgress?: boolean): Observable<Array<AgendaDto>>;
    public getDailyAdminitrationsUsingGET(date: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<AgendaDto>>>;
    public getDailyAdminitrationsUsingGET(date: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<AgendaDto>>>;
    public getDailyAdminitrationsUsingGET(date: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling getDailyAdminitrationsUsingGET.');
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

        return this.httpClient.get<Array<AgendaDto>>(`${this.basePath}/administrations/daily/${encodeURIComponent(String(date))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns the list of the daily administrations of the selected patient, given the medical record id.
     *
     * @param date date
     * @param medicalRecordId medicalRecordId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDailyAdminsForPatientUsingGET(date: string, medicalRecordId: string, observe?: 'body', reportProgress?: boolean): Observable<Array<AgendaDto>>;
    public getDailyAdminsForPatientUsingGET(date: string, medicalRecordId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<AgendaDto>>>;
    public getDailyAdminsForPatientUsingGET(date: string, medicalRecordId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<AgendaDto>>>;
    public getDailyAdminsForPatientUsingGET(date: string, medicalRecordId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling getDailyAdminsForPatientUsingGET.');
        }

        if (medicalRecordId === null || medicalRecordId === undefined) {
            throw new Error('Required parameter medicalRecordId was null or undefined when calling getDailyAdminsForPatientUsingGET.');
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

        return this.httpClient.get<Array<AgendaDto>>(`${this.basePath}/administrations/${encodeURIComponent(String(medicalRecordId))}/${encodeURIComponent(String(date))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns the list of the daily administrations for the currently logged doctor.
     *
     * @param date date
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDailyAdminsUsingGET(date: string, observe?: 'body', reportProgress?: boolean): Observable<Array<AgendaDto>>;
    public getDailyAdminsUsingGET(date: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<AgendaDto>>>;
    public getDailyAdminsUsingGET(date: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<AgendaDto>>>;
    public getDailyAdminsUsingGET(date: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling getDailyAdminsUsingGET.');
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

        return this.httpClient.get<Array<AgendaDto>>(`${this.basePath}/administrations/doctor/${encodeURIComponent(String(date))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns the details of a specific administration
     * Retrieve a single administration given from the agenda
     * @param administrationId administrationId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDetails(administrationId: string, observe?: 'body', reportProgress?: boolean): Observable<AdministrationDetailsTOResponse>;
    public getDetails(administrationId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<AdministrationDetailsTOResponse>>;
    public getDetails(administrationId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<AdministrationDetailsTOResponse>>;
    public getDetails(administrationId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (administrationId === null || administrationId === undefined) {
            throw new Error('Required parameter administrationId was null or undefined when calling getDetails.');
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

        return this.httpClient.get<AdministrationDetailsTOResponse>(`${this.basePath}/administrations/${encodeURIComponent(String(administrationId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Returns the list of the daily administrations of the selected patient, from the medical record id.
     *
     * @param from from
     * @param patientId patientId
     * @param to to
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPatientDiaryUsingGET(from: number, patientId: string, to: number, observe?: 'body', reportProgress?: boolean): Observable<DiaryResponseTO>;
    public getPatientDiaryUsingGET(from: number, patientId: string, to: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<DiaryResponseTO>>;
    public getPatientDiaryUsingGET(from: number, patientId: string, to: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<DiaryResponseTO>>;
    public getPatientDiaryUsingGET(from: number, patientId: string, to: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (from === null || from === undefined) {
            throw new Error('Required parameter from was null or undefined when calling getPatientDiaryUsingGET.');
        }

        if (patientId === null || patientId === undefined) {
            throw new Error('Required parameter patientId was null or undefined when calling getPatientDiaryUsingGET.');
        }

        if (to === null || to === undefined) {
            throw new Error('Required parameter to was null or undefined when calling getPatientDiaryUsingGET.');
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

        return this.httpClient.get<DiaryResponseTO>(`${this.basePath}/administrations/diary/${encodeURIComponent(String(patientId))}/${encodeURIComponent(String(from))}/${encodeURIComponent(String(to))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Identify a drug when perparing an administration.
     *
     * @param barcode barcode
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public identifyUsingGET(barcode: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public identifyUsingGET(barcode: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public identifyUsingGET(barcode: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public identifyUsingGET(barcode: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (barcode === null || barcode === undefined) {
            throw new Error('Required parameter barcode was null or undefined when calling identifyUsingGET.');
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

        return this.httpClient.get<any>(`${this.basePath}/administrations/identify/${encodeURIComponent(String(barcode))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
         * Mark the given administration as missed
         *
         * @param administrationId administrationId
         * @param note note
         * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
         * @param reportProgress flag to report request and response progress.
         */
    public missUsingPOST(administrationId: string, note: MissedAdministrationRequest, observe?: 'body', reportProgress?: boolean): Observable<PTComponentTO>;
    public missUsingPOST(administrationId: string, note: MissedAdministrationRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PTComponentTO>>;
    public missUsingPOST(administrationId: string, note: MissedAdministrationRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PTComponentTO>>;
    public missUsingPOST(administrationId: string, note: MissedAdministrationRequest, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (administrationId === null || administrationId === undefined) {
            throw new Error('Required parameter administrationId was null or undefined when calling missUsingPOST.');
        }

        if (note === null || note === undefined) {
            throw new Error('Required parameter note was null or undefined when calling missUsingPOST.');
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

        return this.httpClient.post<PTComponentTO>(`${this.basePath}/administrations/miss/${encodeURIComponent(String(administrationId))}`,
            note,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
   * Returns the list of the daily administrations belonging to the all therapies of the selected patient in a specific date and time.
   *
   * @param date date
   * @param patientId patientId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
    public getAllAdministrationsByPatientAndDateUsingGET(date: Date, patientId: string, observe?: 'body', reportProgress?: boolean): Observable<AdministrationsByDoctorDto>;
    public getAllAdministrationsByPatientAndDateUsingGET(date: Date, patientId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<AdministrationsByDoctorDto>>;
    public getAllAdministrationsByPatientAndDateUsingGET(date: Date, patientId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<AdministrationsByDoctorDto>>;
    public getAllAdministrationsByPatientAndDateUsingGET(date: Date, patientId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (date === null || date === undefined) {
            throw new Error('Required parameter date was null or undefined when calling getAllAdministrationsByPatientAndDateUsingGET.');
        }

        if (patientId === null || patientId === undefined) {
            throw new Error('Required parameter patientId was null or undefined when calling getAllAdministrationsByPatientAndDateUsingGET.');
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

        return this.httpClient.get<AdministrationsByDoctorDto>(`${this.basePath}/administrations/allAdministrations/${encodeURIComponent(String(patientId))}/${encodeURIComponent(String(date.toISOString()))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
       * Mark the given administration as cancel
       *
       * @param request request
       * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
       * @param reportProgress flag to report request and response progress.
       */
    public updateNotesAndReadUsingPOST(request: AdministrationNoteRequest, observe?: 'body', reportProgress?: boolean): Observable<PTComponentTO>;
    public updateNotesAndReadUsingPOST(request: AdministrationNoteRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PTComponentTO>>;
    public updateNotesAndReadUsingPOST(request: AdministrationNoteRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PTComponentTO>>;
    public updateNotesAndReadUsingPOST(request: AdministrationNoteRequest, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (request === null || request === undefined) {
            throw new Error('Required parameter request was null or undefined when calling updateNotesAndReadUsingPOST.');
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

        return this.httpClient.post<PTComponentTO>(`${this.basePath}/administrations/updateNotesAndRead`,
            request,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
}
