import { Observable } from 'rxjs';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { IcpAgeTemplate } from '../model/icp-age.model';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {

	public getEvents=(date:string):Observable<IcpAgeTemplate[]>=>{
		let url = `${environment.services.api.icpBasePath}/icp/events?date=${date}`;
		return this._http.get(url);
	}


constructor(private _http:HttpService) { }

}
