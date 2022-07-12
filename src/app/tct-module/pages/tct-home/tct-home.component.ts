import { Component, Input, OnInit } from '@angular/core';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';

@Component({
	selector: 'app-tct-home',
	templateUrl: './tct-home.component.html',
	styleUrls: ['./tct-home.component.scss']
})
export class TctHomeComponent implements OnInit {

	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() closeMRMode = false;

	public profile: Profile;
	constructor(private readonly _profileService: ProfileService) {

	}

	ngOnInit(): void {
		this._profileService.profile$.subscribe(result => {
			this.profile = result;
		});
	}
}