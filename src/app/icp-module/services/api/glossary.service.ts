import { HttpService } from '../../../../infrastructure/fidcare/services/http.service';
import { CreateGlossaryElementCommand, DetailedGlossaryElement, GlossaryElement, GlossarySearchCriteria, GlossaryType } from '../model/glossary-element.model';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { SearchResult } from 'infrastructure/fidcare/models/common.models';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GlossaryService {


	constructor(private _http: HttpService) { }

	public list = (type?: GlossaryType): Observable<GlossaryElement[]> => {
		let url = `${environment.services.api.icpBasePath}/glossary/unpaginated`;
		return this._http.get(url, { type: type });
	}

	public listPaginated = (searchCriteria: GlossarySearchCriteria): Observable<SearchResult<DetailedGlossaryElement>> => {
		let url = `${environment.services.api.icpBasePath}/glossary`;
		return this._http.get(url, searchCriteria);
	}
	
	public details = (id: string): Observable<GlossaryElement> => {
		const url = `${environment.services.api.icpBasePath}/glossary/${id}`;
		return this._http.get(url);
	}

	public delete = (id: string): Observable<void> => {
		const url = `${environment.services.api.icpBasePath}/glossary/${id}`;
		return this._http.delete(url);
	}

	public save = (command: CreateGlossaryElementCommand):Observable<GlossaryElement>=>{
		const url = `${environment.services.api.icpBasePath}/glossary`;
		return this._http.post(url,command);
	}
}
