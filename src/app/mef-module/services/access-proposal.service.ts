import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { SearchResult } from "infrastructure/fidcare/models/common.models";
import { Roles } from "infrastructure/fidcare/models/profile.models";
import { HttpService } from "infrastructure/fidcare/services/http.service";
import { ProfileService } from "infrastructure/fidcare/services/profile.service";
import moment from "moment";
import { Observable } from "rxjs";
import { AccessProposalEvaluateRequest, AccessProposalMinResponse, AccessProposalPuaRequest, AccessProposalRequest, AccessProposalResponse, AccessProposalSearchCriteria, ActivityLogResponse } from "../model/access-proposal.model";
import { UploadFileCommand } from "../model/template-document.model";

@Injectable({
	providedIn: 'root'
})
export class AccessProposalService {
  
	constructor(private _http: HttpService, private _profileService: ProfileService) { }

	public listCurrent = (searchcriteria: AccessProposalSearchCriteria): Observable<SearchResult<AccessProposalMinResponse>> => {
		let url = `${environment.services.api.mefBasePath}/accessproposal/list`;
		return this._http.get(url,searchcriteria);
	}

	public listHistory = (searchcriteria: AccessProposalSearchCriteria): Observable<SearchResult<AccessProposalMinResponse>> => {
		let url = `${environment.services.api.mefBasePath}/accessproposal/history`;
		return this._http.get(url,searchcriteria);
	}

	public detailsCurrent = (id:string, history: boolean = false): Observable<AccessProposalResponse> => {
		let url;

		if (history) {
			url = `${environment.services.api.mefBasePath}/accessproposal/history/details/${id}`;
		}
		else {
			url = `${environment.services.api.mefBasePath}/accessproposal/details/${id}`;
		}
		return this._http.get(url);
	}

	public detailsHistory = (id:string): Observable<AccessProposalResponse> => {
		let url = `${environment.services.api.mefBasePath}/accessproposal/history/details/${id}`;
		return this._http.get(url);
	}

	public detailsCurrentAccessProposalByPatient = (patientId: string):Observable<AccessProposalMinResponse> =>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/patient/${patientId}`;
		return this._http.get(url);
	}

	public detailsHistoryAccessProposalByPatient = (patientId: string):Observable<AccessProposalMinResponse> =>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/history/patient/${patientId}`;
		return this._http.get(url);
	}

	public delete = (id:string): Observable<void> => {
		let url = `${environment.services.api.mefBasePath}/accessproposal/delete/${id}`;
		return this._http.delete(url);
	}

	public register = (id:string): Observable<SearchResult<ActivityLogResponse>>=>{
		let url = `${environment.services.api.mefBasePath}/activitylog/list/${id}`;
		return this._http.get(url);
	}

	public saveMMGPLS = (command: AccessProposalRequest):Observable<AccessProposalResponse>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/save`;
		return this._http.post(url,command);
	}

	public evaluate = (command:AccessProposalEvaluateRequest):Observable<AccessProposalResponse>=>{
		let url;
		let data: any = {};
		if (this._profileService.isInRole(Roles.CSANITARIO)) {
			data = command;
			data.protocolDate = moment(command.protocolDate).format("YYYY-MM-DD");
			url = `${environment.services.api.mefBasePath}/accessproposal/evaluate`;

		}
		else if (this._profileService.isInRole(Roles.PUA_OPERATOR)) {
			data = {
				id: command.id,
				protocolDate: moment(command.protocolDate).format("YYYY-MM-DD") ,
				protocolNumber: command.protocolNumber
			}
			url = `${environment.services.api.mefBasePath}/accessproposal/evaluatepua`;
			
		}
		
		return this._http.put(url,data);
	}

	public savePUA = (command:AccessProposalPuaRequest):Observable<void>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/evaluatepua`;
		return this._http.put(url,command);

	}

	public send = (command: {accessProposalId: string}):Observable<void>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/send/${command.accessProposalId}`;
		return this._http.post(url,{});
	}


	public detach = (command: {attachId: string, accessProposalId: string}):Observable<any>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/detach?accessProposalId=${command.accessProposalId}&attachId=${command.attachId}`;
		return this._http.post(url,command);
	}
	public download = (command: {id:string, fileName:string}): Observable<any> => {
		let url = `${environment.services.api.mefBasePath}/accessproposal/download/${command.id}/${command.fileName}`;
		return this._http.get(url,null,{},"blob");
	}

	public listTemplateTypes = ():Observable<any[]>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/attachmentType`;
		return this._http.get(url);
	}

	public uploadFile=(command: {file: any, typeAttach: string, accessProposalId?: string, attachId?: string}):Observable<any>=>{
		let query="";
		if (command.accessProposalId) query = `accessProposalId=${command.accessProposalId}&`;
		if (command.attachId) query = `${query}attachId=${command.attachId}&`;

		let url = `${environment.services.api.mefBasePath}/accessproposal/attach?typeAttach=${command.typeAttach}&${query}`;
		
		return this._http.uploadFile<any>(url, command.file)
        // return this._http.post(url,command);

	}

}