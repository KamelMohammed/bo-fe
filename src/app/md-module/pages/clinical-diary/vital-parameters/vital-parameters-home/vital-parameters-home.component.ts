import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MedicalRecord } from 'app/md-module/models/md.model';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';



@Component({
	selector: 'app-vital-parameters-home',
	templateUrl: './vital-parameters-home.component.html',
	styleUrls: ['./vital-parameters-home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VitalParametersHomeComponent implements OnInit {

	@Input() medicalRecord?: MedicalRecord;
	@Input() readOnly = false;
	@Input() closeMRMode = false;

	public profile: Profile;
	constructor(private readonly _profileService: ProfileService) {

	}

	ngOnInit(): void {
		this._profileService.profile$.subscribe(result => {
			this.profile = result;
		})
	}

}
