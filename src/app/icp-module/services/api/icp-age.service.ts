import { IcpAgeSearchCriteria, IcpAgeTemplate } from './../model/icp-age.model';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class IcpAgeService {

	constructor(private _http: HttpService) { }

	public list = (searchcriteria: IcpAgeSearchCriteria): Observable<IcpAgeTemplate> => {
		let url = `${environment.services.api.icpBasePath}/events`;
		return this._http.get(url, searchcriteria);
	}

}
