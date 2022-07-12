import { environment } from 'environments/environment';
import { Doctor, Patient } from './../model/user';
import { SearchResult, SearchCriteria } from './../../../../infrastructure/fidcare/models/common.models';
import { HttpService } from './../../../../infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private _http: HttpService) { }

	public getDoctors = (searchCriteria: SearchCriteria): Observable<SearchResult<Doctor>> => {
		const url = `${environment.services.api.serviceBasePath}/api/pas/doctors/getDoctorList`;
		return this._http.get(url, searchCriteria);
	}
	public getDoctor = (id: string): Observable<Doctor> => {
		const url = `${environment.services.api.serviceBasePath}/api/pas/doctors/${id}`;
		return this._http.get(url);
	}

	public getPatient = (code:string):Observable<Patient>=>{
		const url = `${environment.services.api.serviceBasePath}/api/cdr/patients/contact/${code}`;
		return this._http.get(url);
	}
}
