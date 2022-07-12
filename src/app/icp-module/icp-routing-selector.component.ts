import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Roles } from "infrastructure/fidcare/models/profile.models";
import { ProfileService } from "infrastructure/fidcare/services/profile.service";

@Component({
    selector: 'path-selector',
    template: '',
})
export class IcpRoutingSelectorComponent implements OnInit {
	
	constructor (private _profileService: ProfileService, private _router: Router) {}
	
	ngOnInit(): void {
		if(this._profileService.isInRole(Roles.CONFIGURATOR)) this._router.navigate(["icp","configuration"]);
		else if(this._profileService.isInRole(Roles.CSANITARIO)) this._router.navigate(["icp","pas"]);
		else this._router.navigate(["/"]);
	}
}