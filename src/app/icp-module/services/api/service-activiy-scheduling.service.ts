import { CloseSessionCommand, ProvideNotProvideServiceActivityCommand, Provision, Session, SessionAttachment } from './../model/pai-service-activiy-scheduling.model';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { ScheduleCommand } from '../model/pai-service-activiy-scheduling.model';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { SaveAttachmentCommand } from '../model/patient-diary.model';
import { PAIAttachment } from '../model/pai.model';

@Injectable({
	providedIn: 'root'
})
export class ServiceActiviySchedulingService {

	public save = (paiId: string, activityId: string, command: ScheduleCommand): Observable<Session> => {
		const url = `${environment.services.api.icpBasePath}/sessions?paiId=${paiId}&paiServiceActivityId=${activityId}`;
		return this._http.post(url, command);
	}

	public closeSession = (id:string, command : {code: string, notes?: string}): Observable<Session>=>{
		const url = `${environment.services.api.icpBasePath}/sessions/${id}/close`;
		return this._http.put(url,command);
	}

	public openSession = (id:string, command : {code: string}): Observable<Session>=>{
		const url = `${environment.services.api.icpBasePath}/sessions/${id}/open`;
		return this._http.put(url,command);
	}

	public details = (id: string): Observable<Session> => {
		const url = `${environment.services.api.icpBasePath}/sessions/${id}`;
		return this._http.get(url);
	}

	public getProvisions = (id: string): Observable<Provision[]> => {
		const url = `${environment.services.api.icpBasePath}/sessions/${id}/provisions`;
		return this._http.get(url);
	}

	public provide = (id:string, provide:boolean, command:ProvideNotProvideServiceActivityCommand):Observable<string>=>{
		let url =  `${environment.services.api.icpBasePath}/sessions/${id}/provisions`;
		if(provide){
		url += `/provide`;
		}
		else{
			url += `/notprovide`;
		}
		return this._http.put(url,command);
	}

	public addAttachment = (id: string, command:SaveAttachmentCommand)=>{
		let url =  `${environment.services.api.icpBasePath}/sessions/${id}/attachments`;
		return this._http.post(url,command);
	}

	public listAttachments = (id: string): Observable<SessionAttachment[]>=>{
		let url =  `${environment.services.api.icpBasePath}/sessions/${id}/attachments`;
		return this._http.get(url);
	}

	public deleteAttachment = (id: string, attachmentId:string)=>{
		let url =  `${environment.services.api.icpBasePath}/sessions/${id}/attachments/${attachmentId}`;
		return this._http.delete(url);
	}

	constructor(private _http: HttpService) { }

}
