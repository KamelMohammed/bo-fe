import { DialogService } from './../../../../../../infrastructure/fidcare/services/dialog.service';
import { Profile } from './../../../../../../infrastructure/fidcare/models/profile.models';
import { ProfileService } from './../../../../../../infrastructure/fidcare/services/profile.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { GlossaryElement, GlossaryType } from 'app/icp-module/services/model/glossary-element.model';
import { GlossaryService } from 'app/icp-module/services/api/glossary.service';
import { ActivityService } from 'app/icp-module/services/api/activity.service';
import { CreateActivityCommand } from 'app/icp-module/services/model/activity.model';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';

@Component({
	selector: 'app-create-activity-form',
	templateUrl: './create-activity-form.component.html',
	styleUrls: ['./create-activity-form.component.scss']
})
export class CreateActivityFormComponent implements OnInit {

	public serviceTypeItems: SelectListitem[] = [];
	public professionalItems: SelectListitem[] = [];
	public createActivityForm: FormGroup;
	public actionTitle: string = '';
	public edit = false;
	public id;
	constructor(
		private _glossarySerivce: GlossaryService,
		private _formBuilder: FormBuilder,
		private _activityService: ActivityService,
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

		if (this.createActivityForm.isValid() && !this.edit) {
			let command: CreateActivityCommand = this.createActivityForm.value;
			this._activityService.create(command).subscribe({
				next: () => {
					this._dialogService.showMessage("icp.saveOperationResult", "icp.activity.activitySaved");
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
						activity: [null, Validators.required],
						accessCost: [null],
						duration: [null, Validators.required],
						professionalsId: [[]],
						typeId: [null, Validators.required]
					});


					let servicesToInvoke: any = {
						serviceTypes: this._glossarySerivce.list(GlossaryType.SERVICE_TYPES),
						professionals: this._glossarySerivce.list(GlossaryType.PROFESSIONALS),
					};
					if (this.id != undefined || this.id != null) {
						this.edit = true;
						servicesToInvoke.entity = this._activityService.details(this.id);
					}
					else {
						this.edit = false;
						this.actionTitle = "Aggiungi una nuova prestazione";
					}
					forkJoin(servicesToInvoke).subscribe((result: any) => {
						this.serviceTypeItems = result.serviceTypes.map(m => new SelectListitem(m.id, m.name));
						this.professionalItems = result.professionals.map(m => new SelectListitem(m.id, m.name));;
						if (result.entity) {
							form.patchValue(result.entity);
							this.actionTitle = result.entity.name;
						}

						this.createActivityForm = form;
					})

				});
			}
		});
	}

}
