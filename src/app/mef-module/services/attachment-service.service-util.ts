import { environment } from "environments/environment";
import { HttpService } from "infrastructure/fidcare/services/http.service";
import { Observable } from "rxjs";

export class AttachmentService {

	public uploadFile=(command: {file: any, typeAttach: string, accessProposalId?: string, attachId?: string}):Observable<any>=>{
		let query="";
		if (command.accessProposalId) query = `accessProposalId=${command.accessProposalId}&`;
		if (command.attachId) query =  `${query}attachId=${command.attachId}&`;
		let url = `${environment.services.api.mefBasePath}/accessproposal/${this.attachService}?typeAttach=${command.typeAttach}&${query}`;
		return this._http.uploadFile<any>(url, command.file)
	}
	public listTemplateTypes = ():Observable<any[]>=>{
		let url = `${environment.services.api.mefBasePath}/accessproposal/attachmentType`;
		return this._http.get(url);
	}
	constructor(private _http: HttpService, private attachService: "attachsvamb" | "attachsvamc" | "attachsvamd") { }

}
