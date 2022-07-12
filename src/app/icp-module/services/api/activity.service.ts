import { map } from 'rxjs/operators';
import { SearchResult } from '../../../../infrastructure/fidcare/models/common.models';
import { HttpService } from '../../../../infrastructure/fidcare/services/http.service';
import { Activity, CreateActivityCommand, ActivitySearchCriteria, ActivityListItem } from '../model/activity.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ActivityService {
  

	constructor(private _http: HttpService) { }

	public list = (searchcriteria: ActivitySearchCriteria): Observable<SearchResult<ActivityListItem>> => {

		let url = `${environment.services.api.icpBasePath}/activities`;
		return this._http.get(url,searchcriteria);
	}

	public listGlobal = (): Observable<ActivityListItem[]> =>{
		let url = `${environment.services.api.icpBasePath}/activities?global=true`;
		return this._http.get(url)
		.pipe(map((searchResult: SearchResult<ActivityListItem>) => searchResult.content));


	}

	public create = (command: CreateActivityCommand): Observable<Activity> => {
		const url = `${environment.services.api.icpBasePath}/activities`;
		return this._http.post(url, command);
	}

	public details = (id: string): Observable<Activity> => {
		const url = `${environment.services.api.icpBasePath}/activities/${id}`;
		return this._http.get(url);
	}

	public delete = (id: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/activities/${id}`;
		return this._http.delete(url);
	}
}
