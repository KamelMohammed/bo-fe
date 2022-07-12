import { Observable } from 'rxjs';
import { HttpService } from './../../../infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { TctParameter } from '../models/alert-tct.model';
import { environment } from 'environments/environment';
import { AlertConfigDto } from 'app/services/api/measurementrule';

@Injectable({
	providedIn: 'root'
})
export class ParametersTctService {

	constructor(private _http: HttpService) { }

	public list(): Observable<TctParameter[]> {
		let url = `${environment.services.api.tctBasePath}/activities/parameters`;
		return this._http.get(url);
	}

	public getAlertsByActivity=(activityId:string, medicalRecordId:string):Observable<AlertConfigDto[]>=>{
		let url = `${environment.services.api.measurementruleBasePath}/api/medicalrecords/${medicalRecordId}/alertconfigs?measurementCode=${activityId}`
		return this._http.get(url);
	}

}
