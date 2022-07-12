import { DialogService } from './../../../../../../infrastructure/fidcare/services/dialog.service';
import { CreateGlossaryElementCommand, GlossaryType } from './../../../../services/model/glossary-element.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-edit-glossary-page',
	templateUrl: './edit-glossary-page.component.html',
	styleUrls: ['./edit-glossary-page.component.scss']
})
export class EditGlossaryPageComponent implements OnInit {

	public glossaryTypes: SelectListitem[] = [];
	public createGlossaryForm: FormGroup;
	public actionTitle: string = '';
	public actionDescription: string = '';
	public edit = false;
	public id;
	constructor(
		private _translateService: TranslateService,
		private _glossarySerivce: GlossaryService,
		private _formBuilder: FormBuilder,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _profileService: ProfileService,
		private _dialogService: DialogService
	) {

	}

	back = () => {
		this._activatedRoute.queryParams.subscribe(qParam => {
			if (qParam.returnUrl)
				this._router.navigateByUrl(qParam.returnUrl)
			else
				this._router.navigate(['/icp/configuration'])

		})
	}
	save() {

		if (this.createGlossaryForm.isValid && !this.edit) {
			let command: CreateGlossaryElementCommand = this.createGlossaryForm.value;
			this._glossarySerivce.save(command).subscribe({
				next: () => {
					this._dialogService.showMessage("icp.saveOperationResult", "icp.glossary.glossarySaved");
					this.edit=true;
					// this._activatedRoute.queryParams.subscribe(qParam => {
					// 	if (qParam.returnUrl)
					// 		this._router.navigateByUrl(qParam.returnUrl)
					// 	else
					// 		this._router.navigate(['/icp/configuration'])

					// })
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

					let form = this._formBuilder.group({
						id: [null],
						name: [null, Validators.required],
						type: [null, Validators.required],
						description: [null, Validators.required],
					});

					let servicesToInvoke :any = {}
					this.glossaryTypes = Object.keys(GlossaryType).map(m => new SelectListitem(m, this._translateService.instant("enums.GlossaryType."+m)));
					if (this.id != undefined || this.id != null) {
						this.edit = true;
						servicesToInvoke.entity = this._glossarySerivce.details(this.id);
						forkJoin(servicesToInvoke).subscribe((result: any) => {
							if (result.entity) {
								form.patchValue(result.entity);
								this.actionTitle = result.entity.name;
								this.actionDescription = "Modifica l'elemento di glossario: " + result.entity.name;
							}
							this.createGlossaryForm = form;
						})
					} else {
						this.edit = false;
						this.actionTitle = "Aggiungi un nuovo elemento di glossario";
						this.createGlossaryForm = form;
					}
				});
			}
		});

	}

}

