import {Inject, Injectable, Optional} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {numberResponse} from "../model/numberResponse";
import {GetPatologiePazienteResponse} from "../model/getPatologiePazienteResponse";
import {AbitudiniLineChart} from "../model/AbitudiniLineChart";
import {responseClassicTable} from "../model/responseClassicTable";
import {responseTable} from "../model/responseTable";
import {PersistenzaResponse} from "../model/PersistenzaResponse";
import {Configuration} from "../configuration";
import {BASE_PATH} from "../variables";


@Injectable()
export class DashboardPazienteControllerService {
    protected basePath = 'http://localhost:8081';
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
    public getAderenzaUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<numberResponse>;
    public getAderenzaUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<numberResponse>(`${this.basePath}/paziente/getAderenza/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
    public getPatologieUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<GetPatologiePazienteResponse>;
    public getPatologieUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<GetPatologiePazienteResponse[]>(`${this.basePath}/paziente/getPatologie/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
    public getParametriVitaliUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<AbitudiniLineChart>;
    public getParametriVitaliUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<AbitudiniLineChart>(`${this.basePath}/paziente/getParametriVitali/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
    public getAlertUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<responseClassicTable[]>;
    public getAlertUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<responseClassicTable[]>(`${this.basePath}/paziente/getAlert/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
    public getRilevazioneUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<numberResponse>;
    public getRilevazioneUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<numberResponse>(`${this.basePath}/paziente/getRilevazione/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }
    public getTableUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<responseTable>;
    public getTableUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<responseTable>(`${this.basePath}/paziente/getTable/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    public getPersistenzaUsingPost(assistitoId: string, observe?: 'body', reportProgress?: boolean): Observable<PersistenzaResponse[]>;
    public getPersistenzaUsingPost(assistitoId: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
        if (assistitoId === null || assistitoId === undefined) {
            throw new Error('Required parameter request was null or undefined when calling createUsingPUT.');
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

        return this.httpClient.post<PersistenzaResponse[]>(`${this.basePath}/paziente/getPersistenza/`,assistitoId,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }




}