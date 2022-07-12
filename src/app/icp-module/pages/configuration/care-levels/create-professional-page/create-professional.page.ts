import { DialogService } from './../../../../../../infrastructure/fidcare/services/dialog.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { SelectListitem } from './../../../../../../infrastructure/fidcare/models/common.models';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CareLevelService } from 'app/icp-module/services/api/care-level.service';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { forkJoin } from 'rxjs';
import { NumberValidators } from 'infrastructure/fidcare/components/forms/validators/number.validator';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-create-professional-page',
	templateUrl: './create-professional.page.html'
})
export class CreateProfessionalPage implements OnInit {

	public professionalItems: SelectListitem[] = [];
	public frequencyItems = ["Giornaliera", "Settimanale", "Mensile"].map(m => new SelectListitem(m, m));
	public createProfessionalForm: FormGroup;
	public actionTitle: string = '';
	public actionDescription: string = '';
	private careLevelId;
	private professionalId;
	public readonly:boolean=false;

	public config: any;

	constructor(
		private _glossarySerivce: GlossaryService,
		private _formBuilder: FormBuilder,
		private _careLevelService: CareLevelService,
		private _dialogRef: MatDialogRef<CreateProfessionalPage>,
		private _profileService: ProfileService,
		private _dialogService: DialogService
	) {

	}

	save() {
		if (this.createProfessionalForm.isValid) {
			let command = this.createProfessionalForm.value;
			this._careLevelService.createProfessional(command, this.careLevelId).subscribe({
				next: () => {
					this._dialogService.showMessage("Esito operazione di salvataggio", "Professionista salvato correttamente");
					this._dialogRef.close(true);
				},
				error: (message: string) => { console.log(message); },
			});
		}
	}

	back = () => {
		this._dialogRef.close(false)
	}

	maxAccessGTMinAccess = (): ValidatorFn => {
		return (control: AbstractControl) => {
			if (this.createProfessionalForm && control.value != null && control.value < this.createProfessionalForm.value.minAccessNumber) {
				return {
					"icp.pas.validation.maxGtMin": [control.value]
				}
			}
			return null;
		};
	}

	ngOnInit() {
		this._profileService.loadUserProfile().subscribe((user: Profile) => {
			if (user.isConfigurator) {
				if (this.config && this.config.data) {
					this.careLevelId = this.config.data.careLevelId;
					this.professionalId = this.config.data.professionalId;
				}

				let form = this._formBuilder.group({
					id: [null],
					professionalId: [null, Validators.required],
					frequency: [null, Validators.required],
					minAccessNumber: [null, [Validators.required, NumberValidators.minimum(1)]],
					maxAccessNumber: [null, [Validators.required, this.maxAccessGTMinAccess()]],
					duration: [null, Validators.required]
				});
				form.get("minAccessNumber").valueChanges.subscribe(
					(success) => {
						form.updateValueAndValidity();
						form.get("maxAccessNumber").patchValue(form.get("maxAccessNumber").value)
					}
				);

				let servicesToInvoke: any = {
					professionalsLabels: this._glossarySerivce.list(GlossaryType.PROFESSIONALS)
				};
				if (this.professionalId != undefined || this.professionalId != null) {
					servicesToInvoke.entity = this._careLevelService.professionalDetails(this.careLevelId, this.professionalId);
					this.readonly=true;
				}
				forkJoin(servicesToInvoke).subscribe((result: any) => {
					this.professionalItems = result.professionalsLabels.map(m => new SelectListitem(m.id, m.name));
					if (result.entity) {
						form.patchValue(result.entity);
					}
					this.createProfessionalForm = form;
				})
			}
		});
	}

	public get title() {
		if (this.createProfessionalForm) {
			return (this.createProfessionalForm.value.id) ? "icp.careLevel.createProfessional.pageDetailTitle" : "icp.careLevel.createProfessional.pageTitle";
		}
		return "";
	}
	public get formValid() {
		if (this.createProfessionalForm) return this.createProfessionalForm.valid;
		return false;
	}
}
