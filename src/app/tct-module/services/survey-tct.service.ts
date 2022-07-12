import { Moment} from 'moment';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Observable } from 'rxjs';
import { Activities, CurrentSurveyResponse } from '../models/survey-tct.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyTctService {

  constructor(private _http: HttpService) { }

	public list = (patientId:string): Observable<Activities> => {

		let url = `${environment.services.api.tctBasePath}/surveys/current/${patientId}`;
		return this._http.get(url);
	}

	public listHistory = (patientId:string, activityId:string, from:Moment, to:Moment): Observable<Activities> => {

		let url = `${environment.services.api.tctBasePath}/surveys/historical/${patientId}/${activityId}?from=${from.format("yyyy-MM-DD")}&to=${to.format("yyyy-MM-DD")}`;
		return this._http.get(url);
	}



}