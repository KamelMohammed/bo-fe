import { SearchResult } from '../../../../infrastructure/fidcare/models/common.models';
import { PAS, SavePASCommand, PASSearchCriteria, PASListItem } from '../model/pas.model';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PASService {
  constructor(private _http: HttpService) { }

  public list = (searchcriteria: PASSearchCriteria): Observable<SearchResult<PASListItem>> => {
    let url = `${environment.services.api.icpBasePath}/pas`;
    return this._http.get(url, searchcriteria);
  }

  public save = (command: SavePASCommand, id?: string): Observable<PAS> => {
    if (id) {
      const url = `${environment.services.api.icpBasePath}/pas/${id}`;
      return this._http.put(url, command);
    }

    const url = `${environment.services.api.icpBasePath}/pas`;
    return this._http.post(url, command);
  }

  public details = (id: string): Observable<PAS> => {
    const url = `${environment.services.api.icpBasePath}/pas/${id}`;
    return this._http.get(url);
  }

  public delete = (id: string): Observable<string> => {
    const url = `${environment.services.api.icpBasePath}/pas/${id}`;
    return this._http.delete(url);
  }

  public updateState = (id: string, active: boolean): Observable<string> => {
    const url = `${environment.services.api.icpBasePath}/pas/${id}/state`;
    return this._http.put(url, active);
  }


  public duplicate = (id: string): Observable<string> => {
    const url = `${environment.services.api.icpBasePath}/pas/${id}/duplicate`;
    return this._http.post(url, undefined);
  }

}
