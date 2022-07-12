import { HttpService } from '../../../../infrastructure/fidcare/services/http.service';
import { SearchResult } from '../../../../infrastructure/fidcare/models/common.models';
import { CareLevel, CareLevelDetails, Professional, CreateCarelevelCommand, CareLevelsSearchCriteria, CareLevelListItem, ProfessionalListItem, ProfessionalsSearchCriteria } from '../model/care-level.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class CareLevelService {
	constructor(private _http: HttpService) { }

	public list = (searchcriteria: CareLevelsSearchCriteria): Observable<SearchResult<CareLevelListItem>> => {
		// let url = `${environment.services.api.icpBasePath}/carelevels?page=${careLevelSearchCriteria.page}&size=${careLevelSearchCriteria.size}`;
		// if (careLevelSearchCriteria.level)
		// 	url += `&level=${careLevelSearchCriteria.level}`;
		let url = `${environment.services.api.icpBasePath}/carelevels`;
		return this._http.get(url,searchcriteria);
	}

	public listGlobal = ():Observable<CareLevelListItem[]>=>{
		let url = `${environment.services.api.icpBasePath}/carelevels?global=true`;
		return this._http.get(url).pipe(map(
			(searchResult: SearchResult<CareLevelListItem>) => searchResult.content,
		));
	}

	public create = (command: CreateCarelevelCommand): Observable<CareLevel> => {
		const url = `${environment.services.api.icpBasePath}/carelevels`;
		return this._http.post(url, command);
	}

	public details = (id: string, global:boolean=false): Observable<CareLevelDetails> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${id}?global=${global}`;
		return this._http.get(url,);
	}

	public delete = (id: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${id}`;
		return this._http.delete(url);
	}

	public createProfessional = (command: Professional, careLevelId: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${careLevelId}/professionals`;
		return this._http.post(url, command);
	}

	public listProfessionals = (careLevelId: string, global:boolean=false): Observable<ProfessionalListItem[]> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${careLevelId}/professionals?global=${global}`;
		return this._http.get(url).pipe(
			map((result) => {
				return result.content;
			})
		);
	}

	public professionalDetails = (careLevelId: string, professionalId: string, global:boolean=false): Observable<Professional> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${careLevelId}/professionals/${professionalId}?global=${global}`;
		return this._http.get(url);
	}

	public deleteProfessional = (careLevelId: string, professionalId: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/carelevels/${careLevelId}/professionals/${professionalId}`;
		return this._http.delete(url);
	}
}
