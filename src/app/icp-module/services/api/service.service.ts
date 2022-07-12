import { HttpService } from '../../../../infrastructure/fidcare/services/http.service';
import { SearchResult } from '../../../../infrastructure/fidcare/models/common.models';
import { Service, ServiceDetails, CreateServiceCommand, ServiceSearchCriteria, ServiceListItem } from '../model/service.model';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private _http: HttpService) { }

  public list = (searchcriteria: ServiceSearchCriteria): Observable<SearchResult<ServiceListItem>> => {

    let url = `${environment.services.api.icpBasePath}/services`;
    return this._http.get(url, searchcriteria);
  }

  public listGlobal = (): Observable<ServiceListItem[]> => {
    let url = `${environment.services.api.icpBasePath}/services?global=true`;
    return this._http.get(url)
      .pipe(map((searchResult: SearchResult<ServiceListItem>) => searchResult.content));


  }
  public create = (command: CreateServiceCommand): Observable<Service> => {
    const url = `${environment.services.api.icpBasePath}/services`;
    return this._http.post(url, command);
  }

  public details = (id: string): Observable<ServiceDetails> => {
    const url = `${environment.services.api.icpBasePath}/services/${id}`;
    return this._http.get(url);
  }

  public delete = (id: string): Observable<string> => {
    const url = `${environment.services.api.icpBasePath}/services/${id}`;
    return this._http.delete(url);
  }

}
