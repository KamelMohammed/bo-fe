import { PAI } from './../model/pai.model';
import { ServiceActivityListItem, SaveServiceActivityCommand, ServiceActivity, ServiceActivityDetail } from '../model/pai-pas-common';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

export enum PAI_PAS {
	PAI, PAS
}


@Injectable({
	providedIn: 'root'
})
export class PAIPASCommonService {


	public listServiceActivity = (id: string, flag: PAI_PAS): Observable<ServiceActivityListItem[]> => {
		let url = `${environment.services.api.icpBasePath}`;
		switch (flag) {
			case PAI_PAS.PAI:
				url += `/pai/${id}/paiservicesactivities`;
				break;
			case PAI_PAS.PAS:
				url += `/pas/${id}/activities`
				break;
		}

		return this._http.get(url).pipe(map(searchResult => searchResult.content));
	}

	public saveServiceActivity = (command: SaveServiceActivityCommand, id: string, flag: PAI_PAS, activityId?: string): Observable<ServiceActivity | PAI> => {
		let url = `${environment.services.api.icpBasePath}`;
		switch (flag) {
			case PAI_PAS.PAI:
				url += `/pai/${id}/paiservicesactivities`;
				break;
			case PAI_PAS.PAS:
				url += `/pas/${id}/activities`
				break;
		}
		if (activityId) {
			url += "/" + activityId;
			return this._http.put(url, command);
		}
		return this._http.post(url, command);
	}

	public serviceActivityDetails = (id: string, activityId: string, flag: PAI_PAS): Observable<ServiceActivityDetail> => {
		let url = `${environment.services.api.icpBasePath}`;
		switch (flag) {
			case PAI_PAS.PAI:
				url += `/pai/${id}/paiservicesactivities/${activityId}`;
				break;
			case PAI_PAS.PAS:
				url += `/pas/${id}/activities/${activityId}`
				break;
		}
		return this._http.get(url);
	}

	public deleteServiceActivity = (id: string, activityId: string, flag: PAI_PAS): Observable<string | PAI> => {
		let url = `${environment.services.api.icpBasePath}`;
		switch (flag) {
			case PAI_PAS.PAI:
				url += `/pai/${id}/paiservicesactivities/${activityId}`;
				break;
			case PAI_PAS.PAS:
				url += `/pas/${id}/activities/${activityId}`
				break;
		}
		return this._http.delete(url);
	}

	constructor(private _http: HttpService) { }

}
