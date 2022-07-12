import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SearchResult } from 'infrastructure/fidcare/models/common.models';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { map, Observable } from 'rxjs';
import { DownloadedTemplateDocument, TemplateDocument, TemplateDocumentSearchCriteria, TemplateType, UploadFileCommand } from '../model/template-document.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateDocumentService {

	constructor(private _http: HttpService) { }

	public list = (searchcriteria: TemplateDocumentSearchCriteria): Observable<SearchResult<TemplateDocument>> => {
		let url = `${environment.services.api.mefBasePath}/templatedocument/list`;
		return this._http.get(url, searchcriteria).pipe(
			map((result: SearchResult<TemplateDocument>) => {
				if (result.totalElements>0) {
					result.content = result.content.map((element) => {
						element.usedForEvaluation = (element.type == 'Svamdi B' || element.type == 'Svama B' || element.type == 'Svama C' || element.type == 'Svama D');
						return element;
					})
				}
				return result;
			})
		)
	}

	public download = (id:string, fileName:string): Observable<any> => {
		let url = `${environment.services.api.mefBasePath}/templatedocument/download/${id}/${fileName}`;
		return this._http.get(url,null,{},"blob");
	}

	public delete = (id:string): Observable<DownloadedTemplateDocument> => {
		let url = `${environment.services.api.mefBasePath}/templatedocument/detach/${id}`;
		return this._http.post(url,{});
	}


	//ma qua il servizio non dovrebbe restituire un array?
	public listTemplateTypes = ():Observable<TemplateType[]>=>{
		let url = `${environment.services.api.mefBasePath}/templatedocument/templateType`;
		return this._http.get(url);
	}

	public uploadFile=(command:UploadFileCommand):Observable<TemplateDocument>=>{
		let url = `${environment.services.api.mefBasePath}/templatedocument/attach?typeAttach=${command.typeAttach}`;
		
		return this._http.uploadFile<TemplateDocument>(url, command.file)
        // return this._http.post(url,command);

	}

}
