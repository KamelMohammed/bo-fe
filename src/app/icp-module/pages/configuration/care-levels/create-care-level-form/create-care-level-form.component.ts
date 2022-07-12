import { DialogService } from './../../../../../../infrastructure/fidcare/services/dialog.service';
import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CareLevelService } from 'app/icp-module/services/api/care-level.service';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import {  CreateCarelevelCommand } from 'app/icp-module/services/model/care-level.model';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { forkJoin } from 'rxjs';


@Component({
	selector: 'app-create-care-level-form',
	templateUrl: './create-care-level-form.component.html',
	styleUrls: ['./create-care-level-form.component.scss']
})
export class CreateCareLevelFormComponent implements OnInit {
	public careLevelItems: SelectListitem[] = [];
	public careProfileItems: SelectListitem[] = [];
	public createCareLevelForm: FormGroup;
	public actionTitle: string = '';
	public actionDescription: string = '';
	public edit = false;
	public id;
	constructor(
		private _glossarySerivce: GlossaryService,
		private _formBuilder: FormBuilder,
		private _careLevelService: CareLevelService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _profileService: ProfileService,
		private _dialogService: DialogService
	) {

	}

	defaultBackUrl = "/icp/configuration";

	save() {
		if (this.createCareLevelForm.isValid() && !this.edit) {
			let command: CreateCarelevelCommand = this.createCareLevelForm.value;
			this._careLevelService.create(command).subscribe({
				next: (result) => {
					this.id = result.id;
					this.createCareLevelForm.get("id").patchValue(result.id);
					this.edit = true;
					this._dialogService.showMessage("icp.saveOperationResult", "icp.careLevel.careLevelSaved");

				},
				error: (message: string) => { console.log(message); },
			});
		}
	}


	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isConfigurator) {
				this._activatedRoute.params.subscribe(params => {
					this.id = params['id'];
					console.log(params);

					let form = this._formBuilder.group({
						id: [null],
						name: [null, Validators.required],
						levelId: [null, Validators.required],
						careProfileId: [null, Validators.required],
						professionalsId: [[]]
					});


					let servicesToInvoke: any = {
						careProfiles: this._glossarySerivce.list(GlossaryType.CARE_PROFILE),
						careLevels: this._glossarySerivce.list(GlossaryType.CARE_LEVEL),
					};
					if (this.id != undefined || this.id != null) {
						this.edit = true;
						servicesToInvoke.entity = this._careLevelService.details(this.id, false);
					}
					else {
						this.edit = false;
						this.actionTitle = "Aggiungi un nuovo livello di cura";
					}
					forkJoin(servicesToInvoke).subscribe((result: any) => {
						console.log(result);

						this.careProfileItems = result.careProfiles.map(m => new SelectListitem(m.id, m.name));
						this.careLevelItems = result.careLevels.map(m => new SelectListitem(m.id, m.name));

						if (result.entity) {
							form.patchValue(result.entity);
							this.actionTitle = result.entity.name;
							this.actionDescription = "Modifica il livello di cura: " + result.entity.name;
						}

						this.createCareLevelForm = form;
					})

				});
			}
		});
	}
}
