import { GlossaryElement } from './../../../../services/model/glossary-element.model';
import { map } from 'rxjs/operators';
import { CareLevelListItem } from './../../../../services/model/care-level.model';
import { SelectListitem } from './../../../../../../infrastructure/fidcare/models/common.models';
import { GlossaryService } from './../../../../services/api/glossary.service';
import { CareLevelService } from './../../../../services/api/care-level.service';
import { PAI_PAS } from './../../../../services/api/pai-pas-common.service';
import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { PAS, SavePASCommand } from './../../../../services/model/pas.model';
import { EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SaveServiceActivityCommand, ServiceActivityListItem, ServiceActivityDetail, ServiceActivity } from '../../../../services/model/pai-pas-common';
import { PAIPASCommonService } from '../../../../services/api/pai-pas-common.service';
import { PASService } from '../../../../services/api/pas.service';
import { Component, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ArrayValidators } from 'infrastructure/fidcare/components/forms/validators/array.validator';

@Component({
	selector: 'app-create-pas-on-the-fly',
	templateUrl: './create-pas-on-the-fly.component.html',
	styleUrls: ['./create-pas-on-the-fly.component.scss']
})
export class CreatePasOnTheFlyComponent implements OnInit {

	public config: any;
	public careLevelId: string;
	public pathologiesId: string[];
	public paiId: string;
	public creationOnTheFly: boolean = true;
	public currentServiceActivity: ServiceActivityListItem[] = [];
	public careLevelItems: SelectListitem[] = [];
	public pathologiesItems: SelectListitem[] = [];
	public pai_pas: PAI_PAS = PAI_PAS.PAI;
	public createPasOnTheFlyForm: FormGroup;
	constructor(
		private _pasService: PASService,
		private _serviceActivityService: PAIPASCommonService,
		private _dialogRef: MatDialogRef<CreatePasOnTheFlyComponent>,
		private _profileService: ProfileService,
		private _careLevelService: CareLevelService,
		private _glossaryService: GlossaryService,
		private _formBuilder: FormBuilder,
	) {

	}


	back = () => {
		this._dialogRef.close(false);
	}

	save() {
		if (this.createPasOnTheFlyForm.isValid()) {
			let command: SavePASCommand = new SavePASCommand();
			Object.assign(command, this.createPasOnTheFlyForm.getRawValue());
			this._pasService.save(command).subscribe((pas: PAS) => {
				this.activatePas(pas.id);
			});
		}

	}

	activatePas(id: string) {
		let toCall = []
		this.currentServiceActivity.forEach((item) => {
			toCall.push(this._serviceActivityService.serviceActivityDetails(this.paiId, item.id, PAI_PAS.PAI))
		});
		forkJoin(toCall).subscribe((details) => {
			if (details) {
				let callDetails = [];
				details.forEach((detail) => {
					let saveCommand: SaveServiceActivityCommand = new SaveServiceActivityCommand();
					Object.assign(saveCommand, detail);
					callDetails.push(this._serviceActivityService.saveServiceActivity(saveCommand, id, PAI_PAS.PAS));
				});
				forkJoin(callDetails).subscribe({
					next: () => {
						this._pasService.updateState(id, true).subscribe(() => {
							this._pasService.details(id).subscribe((pas: PAS) => {
								this._dialogRef.close(pas.id);
							});
						});
					},
					error: () => {
						this._pasService.delete(id).subscribe((result) => { });
					}
				})
			}

		})
	}



	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isCSanitario) {
				this.careLevelId = this.config.data.careLevelId;
				this.pathologiesId = this.config.data.pathologiesId;
				this.paiId = this.config.data.paiId;
				if (this.paiId && this.paiId != undefined) {
					let servicesToInvoke: any = {
						careLevels: this._careLevelService.listGlobal(),
						pathologies: this._glossaryService.list(GlossaryType.PATHOLOGIES),
						servicesActivities: this._serviceActivityService.listServiceActivity(this.paiId, PAI_PAS.PAI)
					};

					forkJoin(servicesToInvoke).subscribe((result: any) => {
						this.currentServiceActivity = result.servicesActivities;
						// this.careLevelItems = result.careLevels.map((m: CareLevelListItem) => new SelectListitem(m.id, m.name));
						this.careLevelItems = result.careLevels.map((m: CareLevelListItem) => new SelectListitem(m.id, m.levelName + " - " + m.careProfileName));
						this.pathologiesItems = result.pathologies.map((m: GlossaryElement) => new SelectListitem(m.id, m.name));
						let form = this._formBuilder.group({
							id: [null],
							name: [null, Validators.required],
							careLevelId: [this.careLevelId, Validators.required],
							pathologiesId: [this.pathologiesId, Validators.required]
						});

						this.createPasOnTheFlyForm = form;
					});
				}
			}
		});
	}


	public get title(): string {
		return 'icp.pai.createPasOnTheFly.createPageTitle';
	}
}