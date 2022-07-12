import { DialogService } from './../../../../../../infrastructure/fidcare/services/dialog.service';
import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { SelectListitem } from './../../../../../../infrastructure/fidcare/models/common.models';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { ServiceService } from 'app/icp-module/services/api/service.service';
import { GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { CreateServiceCommand } from 'app/icp-module/services/model/service.model';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-create-service-form',
	templateUrl: './create-service-form.component.html',
	styleUrls: ['./create-service-form.component.scss']
})
export class CreateServiceFormComponent implements OnInit {

	public serviceTypeItems: SelectListitem[] = [];
	public professionalItems: SelectListitem[] = [];
	public createServiceForm: FormGroup;
	public actionTitle: string = '';
	public actionDescription: string = '';
	public edit = false;
	public id;
	constructor(
		private _glossarySerivce: GlossaryService,
		private _formBuilder: FormBuilder,
		private _serviceService: ServiceService,
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

		if (this.createServiceForm.isValid() && !this.edit) {
			let command: CreateServiceCommand = this.createServiceForm.value;
			this._serviceService.create(command).subscribe({
				next: () => {
					this._dialogService.showMessage("icp.saveOperationResult", "icp.service.serviceSaved");
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
						service: [null, Validators.required],
						accessCost: [null],
						duration: [null],
						professionalsId: [[],Validators.required],
						typeId: [null, Validators.required]
					});


					let servicesToInvoke: any = {
						serviceTypes: this._glossarySerivce.list(GlossaryType.SERVICE_TYPES),
						professionals: this._glossarySerivce.list(GlossaryType.PROFESSIONALS),
					};
					if (this.id != undefined || this.id != null) {
						this.edit = true;
						servicesToInvoke.entity = this._serviceService.details(this.id);
					}
					else {
						this.edit = false;
						this.actionTitle = "Aggiungi una nuova prestazione";
					}
					forkJoin(servicesToInvoke).subscribe((result: any) => {
						this.serviceTypeItems = result.serviceTypes.map(m => new SelectListitem(m.id, m.name));
						this.professionalItems = result.professionals.map(m => new SelectListitem(m.id, m.name));
						if (result.entity) {
							form.patchValue(result.entity);
							this.actionTitle = result.entity.name;
							this.actionDescription = "Modifica la prestazione: " + result.entity.name;
						}
						this.createServiceForm = form;
					})
				});
			}
		});

	}

}
