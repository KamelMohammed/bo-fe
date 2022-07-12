import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Observable } from 'rxjs';
import { ConfigurationNotification } from '../models/configuration-tct.model';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationTctService {

	constructor(private _http: HttpService) { }

	public list = (patientId: string): Observable<ConfigurationNotification> => {
		let url = `${environment.services.api.tctBasePath}/patients/configuration/${patientId}`;
		return this._http.get(url);
	}


}
