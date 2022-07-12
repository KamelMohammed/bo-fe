import { Observable } from 'rxjs';
import { HttpService } from './../../../infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { UviMembers } from '../model/uvi.model';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UviService {

	constructor(private _http: HttpService) { }

	public getUviMembers= (accessProposalId:string):Observable<UviMembers>=>{
		let url=`${environment.services.api.mefBasePath}/uvi/${accessProposalId}`
		return this._http.get(url);
	}

	public removeUviMember = (accessProposalId:string, uviMemberId:string):Observable<void>=>{
		let url = `${environment.services.api.mefBasePath}/uvi/removemember/${accessProposalId}/${uviMemberId}`
		return this._http.put(url,undefined);
	}

	public addUviMember = (accessProposalId:string, uviMemberId:string):Observable<any>=>{
		let url = `${environment.services.api.mefBasePath}/uvi/addmember/${accessProposalId}/${uviMemberId}`
		return this._http.put(url,undefined);
	}

	public acceptConvocation = (accessProposalId:string, uviMemberId:string):Observable<any>=>{
		let url = `${environment.services.api.mefBasePath}/uvi/acceptconvocation/${accessProposalId}/${uviMemberId}`
		return this._http.put(url,undefined);
	}
	public rejectConvocation = (accessProposalId:string, uviMemberId:string):Observable<any>=>{
		let url = `${environment.services.api.mefBasePath}/uvi/rejectconvocation/${accessProposalId}/${uviMemberId}`
		return this._http.put(url,undefined);
	}
	
}
