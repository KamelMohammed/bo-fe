import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Roles } from "infrastructure/fidcare/models/profile.models";
import { ProfileService } from "infrastructure/fidcare/services/profile.service";

@Component({
    selector: 'mef-path-selector',
    template: '',
})
export class MefRoutingSelectorComponent implements OnInit {
	
	constructor (private _profileService: ProfileService, private _router: Router) {}
	
	ngOnInit(): void {
		if(this._profileService.isInRole(Roles.CONFIGURATOR)) this._router.navigate(["mef","document-list"]);
		else this._router.navigate(["mef","accessProposals"]);
	}
}