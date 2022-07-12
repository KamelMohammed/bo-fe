import { DiaryServiceActivity, DiaryServiceActivityListItem, PatientiDiary, SaveAttachmentCommand, SaveDiaryServiceActivityCommand } from './../model/patient-diary.model';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UnicDiaryService {

	public getPatientDiary = (patientId: string): Observable<PatientiDiary> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries?patientFiscalCode=${patientId}`;
		return this._http.get(url);
	}

	public addDiaryServiceActivity = (patientDiaryId: string, command: SaveDiaryServiceActivityCommand): Observable<DiaryServiceActivityListItem> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries/${patientDiaryId}/diaryservicesactivities`;
		if(command.id){
			url+="/"+command.id;
			return this._http.put(url, command);

		}
		return this._http.post(url, command);
	}

	public getDiaryServiceActivity = (patientDiaryId: string, diaryServiceActivityId: string): Observable<DiaryServiceActivity> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries/${patientDiaryId}/diaryservicesactivities/${diaryServiceActivityId}`;
		return this._http.get(url);
	}

	public deleteDiaryServiceActivity = (patientDiaryId: string, diaryServiceActivityId: string): Observable<DiaryServiceActivity> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries/${patientDiaryId}/diaryservicesactivities/${diaryServiceActivityId}`;
		return this._http.delete(url);
	}

	public addAttachment = (patientDiaryId: string, diaryServiceActivityId: string, command: SaveAttachmentCommand): Observable<any> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries/${patientDiaryId}/diaryservicesactivities/${diaryServiceActivityId}/attachments`;
		return this._http.post(url, command);
	}

	public deleteAttachment = (patientDiaryId: string, diaryServiceActivityId: string, attachmentId: string): Observable<any> => {
		let url = `${environment.services.api.icpBasePath}/patientdiaries/${patientDiaryId}/diaryservicesactivities/${diaryServiceActivityId}/attachment/${attachmentId}`;
		return this._http.delete(url);
	}


	constructor(private _http: HttpService) { }

}
