import { DialogService } from './../../../../../infrastructure/fidcare/services/dialog.service';
import { PAI_PAS } from './../../../services/api/pai-pas-common.service';
import { Profile } from './../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../infrastructure/fidcare/services/profile.service';
import { CareLevelService } from './../../../services/api/care-level.service';
import { CareLevel, CareLevelListItem } from './../../../services/model/care-level.model';
import { PAS, SavePASCommand } from '../../../services/model/pas.model';
import { PASService } from '../../../services/api/pas.service';
import { Component, Input, OnInit, Output, EventEmitter, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { ActivatedRoute, Router } from '@angular/router';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { forkJoin, Observable, of } from 'rxjs';
import { ArrayValidators } from 'infrastructure/fidcare/components/forms/validators/array.validator';


@Component({
	selector: 'app-edit-pas',
	templateUrl: './edit-pas.component.html',
	styleUrls: ['./edit-pas.component.scss']
})
export class EditPasComponent implements OnInit {


	careLevelId: string;
	pathologiesId: string[];

	public careLevelItems: SelectListitem[] = [];
	public careProfileItems: SelectListitem[] = [];
	public pathologieItems: SelectListitem[] = [];
	public createPasForm: FormGroup;
	public edit = false;
	private currentPas: PAS;
	private pasActivitiesCounter: number = 0;
	private updateNotSaved: boolean = false;

	get pageTitle(): string {
		return (this.edit)? "icp.pas.editPasTitlePage":"icp.pas.createPasTitlePage";
	}


	public readonly: boolean = false;
	public id;
	public pai_pas: PAI_PAS;

	constructor(
		private _glossarySerivce: GlossaryService,
		private _careLevelService: CareLevelService,
		private _formBuilder: FormBuilder,
		private _pasService: PASService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _profileService: ProfileService,
		private _dialogService: DialogService
	) {

	}

	defaultBackUrl = "/icp/pas";
	back() {
		this._router.navigate([this.defaultBackUrl]);
	}

	public setPasActivitiesCounter = (num) => {
		this.pasActivitiesCounter = num;
	}

	public get canChangeCareLevel() {
		return !this.readonly && (!this.edit || (this.edit && this.pasActivitiesCounter == 0));
	}
	public get canUpdatePasActivities() {
		return !this.readonly && this.edit && !this.updateNotSaved;
	}

	save() {
		if (this.createPasForm.isValid()) {
			let command: SavePASCommand = this.createPasForm.getRawValue();
			if (this.edit) {
				this._pasService.save(command, this.id).subscribe({
					next: (result) => {
						this.currentPas = new PAS();
						Object.assign(this.currentPas, this.createPasForm.value);
						this.updateNotSaved = false;
						this.edit = true;
						this._dialogService.showMessage("icp.updateOperationResult", "icp.pas.pasUpdated");
					},
					error: (message: string) => { console.log(message); },
				});
			} else {
				this._pasService.save(command).subscribe({
					next: (result) => {
						this.id = result.id;
						this.createPasForm.get("id").patchValue(result.id);
						this.currentPas = new PAS();
						Object.assign(this.currentPas, this.createPasForm.value);
						this.edit = true;
						this.updateNotSaved = false;
						this._dialogService.showMessage("icp.saveOperationResult", "icp.pas.pasSaved");
					},
					error: (message: string) => { console.log(message); },
				});
			}
		}
	}
	


	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isCSanitario) {
				let form = this._formBuilder.group({
					id: [null],
					name: [null, Validators.required],
					careLevelId: [null, Validators.required],
					pathologiesId: [[], [Validators.required, ArrayValidators.minLength(1)]]
				});


				this._activatedRoute.params.subscribe(params => {

					this.id = params['id'];
					this.pai_pas = PAI_PAS.PAS;

					form.get("careLevelId").valueChanges.subscribe((r) => {
						if (this.edit && this.currentPas) {
							this.updateNotSaved = (this.currentPas.careLevelId != r);
						}
					});
					
					let servicesToInvoke: any = {
						careLevels: this._careLevelService.listGlobal(),
						pathologhies: this._glossarySerivce.list(GlossaryType.PATHOLOGIES)
					};

					if (this.id && this.id != undefined && this.id != null) {
						this.edit = true;
						console.log("creo il pas");
						servicesToInvoke.entity = this._pasService.details(this.id);
					}else {
						this.edit = false;
					}
					forkJoin(servicesToInvoke).subscribe((result: any) => {
						this.careLevelItems = result.careLevels.map((m: CareLevelListItem) => new SelectListitem(m.id, m.levelName + " - " + m.careProfileName));
						this.pathologieItems = result.pathologhies.map(m => new SelectListitem(m.id, m.name));

						if (result.entity) {
							form.patchValue(result.entity);
							
							this.currentPas = result.entity;
							this.readonly = this.currentPas.active;
						}

						this.createPasForm = form;
					})
				});
			}
		});
	}


}
