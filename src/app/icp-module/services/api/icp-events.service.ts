import { AgendaDto } from './../../../services/api/atm/model/agendaDto';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IcpEventsService {

  public save = (date: Date): Observable<AgendaDto> => {
		const url = `${environment.services.api.icpBasePath}/icp/events?date=${date}}`;
		return this._http.get(url);
	}

constructor(private _http:HttpService) { }

}
