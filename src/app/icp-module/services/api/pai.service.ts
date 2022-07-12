import { PAIDetails } from './../model/pai.model';
import { DefineEvaluationCommand, DisapproveInterruptPAICommand, ElectCaseManagerCommand, Evaluation, EvaluationType, PAI, PAIAttachment, PAIAttachmentCommand, PAIListItem, PAINote, PAIUpdateStateCommand, SavePAICommand, SuspendPAICommand } from '../model/pai.model';
import { Injectable } from '@angular/core';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { PAISearchCriteria } from '../model/pai.model';
import { Observable } from 'rxjs';
import { SearchResult } from 'infrastructure/fidcare/models/common.models';
import { environment } from 'environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PAIService {


	public list = (searchcriteria: PAISearchCriteria): Observable<SearchResult<PAIListItem>> => {
		let url = `${environment.services.api.icpBasePath}/pai`;
		return this._http.get(url, searchcriteria);
	}

	public save = (command: SavePAICommand, id?: string): Observable<PAIDetails> => {
		if (id) {
			const url = `${environment.services.api.icpBasePath}/pai/${id}`;
			return this._http.put(url, command);
		}

		const url = `${environment.services.api.icpBasePath}/pai`;
		return this._http.post(url, command);
	}

	public details = (id: string): Observable<PAIDetails> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}`;
		return this._http.get(url);
	}

	public delete = (id: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}`;
		return this._http.delete(url);
	}

	public suspend = (id: string, suspend: SuspendPAICommand): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/suspend`;
		return this._http.put(url, suspend);
	}

	public interrup = (id: string, interrupt: DisapproveInterruptPAICommand): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/interrupt`;
		return this._http.put(url, interrupt);
	}

	public disapprove = (id: string, disapprove: DisapproveInterruptPAICommand): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/disapprove`;
		return this._http.put(url, disapprove);
	}

	public terminatePAI = (id: string): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/terminate`;
		return this._http.put(url,undefined);
	}

	public approvePAI = (id: string): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/approve`;
		return this._http.put(url,undefined);
	}

	public activatePAI = (id: string): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/activate`;
		return this._http.put(url,undefined);
	}

	public reactivatePAI = (id: string): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/reactivate`;
		return this._http.put(url,undefined);
	}

	public listPAIStateChanges = (id: string): Observable<PAINote[]> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/paistatechanges`;
		return this._http.get(url);
	}

	public paiStateChangeDetail = (id: string, paiStateChangeId: string): Observable<PAINote> => {
		const url = `${environment.services.api.icpBasePath}/pai/${id}/paistatechanges/${paiStateChangeId}`;
		return this._http.get(url);
	}

	public saveCaseManager = (command: ElectCaseManagerCommand, paiId: string): Observable<PAI> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/casemanager`;
		return this._http.post(url, command);
	}


	public savePAIAttachment = (command: PAIAttachmentCommand, paiId: string): Observable<PAIAttachment> => {

		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/paiattachments`;
		return this._http.post(url, command);
	}

	public detailsPAIAttachment = (paiId: string, id: string): Observable<PAIAttachment> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/paiattachments/${id}`;
		return this._http.get(url);
	}

	public listPAIAttachment = (paiId: string): Observable<PAIAttachment[]> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/paiattachments`;
		return this._http.get(url);
	}

	public deletePAIAttachment = (paiId: string, id: string): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/paiattachments/${id}`;
		return this._http.delete(url);
	}


	public defineEvaluation = (command: DefineEvaluationCommand, paiId: string,  evaluationType:EvaluationType, evaluationId?: string): Observable<Evaluation> => {
		if (evaluationId) {
			const url = `${environment.services.api.icpBasePath}/pai/${paiId}/${evaluationType}/${evaluationId}`;
			return this._http.put(url, command);
		}
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/${evaluationType}`;
		return this._http.post(url, command);
	}


	public deleteEvaluation = (paiId: string, id: string, evaluationType:EvaluationType): Observable<string> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/${evaluationType}/${id}`;
		return this._http.delete(url);
	}

	public listEvaluation = (paiId: string, evaluationType:EvaluationType): Observable<Evaluation[]> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/${evaluationType}`;
		return this._http.get(url);
	}


	public getEvaluation = (paiId: string, evaluationId:string,evaluationType:EvaluationType): Observable<Evaluation> => {
		const url = `${environment.services.api.icpBasePath}/pai/${paiId}/${evaluationType}/${evaluationId}`;
		return this._http.get(url);
	}


	constructor(private _http: HttpService) { }

}
