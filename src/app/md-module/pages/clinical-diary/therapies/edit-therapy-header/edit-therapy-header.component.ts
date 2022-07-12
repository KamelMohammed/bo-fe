import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { Profile } from 'infrastructure/fidcare/models/profile.models';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';
import { PathologyService, TherapyDto, TherapyRequest, TherapyService } from 'app/services/api/atm';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { EditTherapyModalData, TherapyStatus } from 'app/md-module/models/md.model';
import { MatChipItem, SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { map, Observable } from 'rxjs';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import moment from 'moment';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';

@Component({
	selector: 'app-edit-therapy-header',
	templateUrl: './edit-therapy-header.component.html'
})
export class EditTherapyHeaderComponent extends BaseComponent implements OnInit {
	public form: FormGroup = null;
	public profile: Profile = null;
	public isNew: boolean = true;
	public pathologies: MatChipItem<SelectListitem>[] = [];
	public recreate: boolean = false;

	constructor(private _fb: FormBuilder, private _dialogService: DialogService, private readonly _dialog: MatDialogRef<EditTherapyHeaderComponent>, private readonly translate: TranslateService, private readonly router: Router, private readonly pathologyService: PathologyService, private readonly _therapyService: TherapyService, private readonly cd: ChangeDetectorRef, private readonly snackBarService: SnackBarService, private readonly profileService: ProfileService, @Inject(MAT_DIALOG_DATA) private _data: EditTherapyModalData) {
		super()
	}

	ngOnInit() {
		this.isNew = this._data.id == null;
		if (this.isNew) {
			this.createForm();
		}
		else {
			this._therapyService.getTherapyDetails(this._data.id).subscribe(result => {
				this.createForm(result.therapyDto);
				this.pathologies = [...result.therapyDto.pathologies.map(m => new MatChipItem(new SelectListitem(m.code, m.description)))];
				this.recreate = result.therapyDto.state == TherapyStatus.ONGOING;
			});
		}
	}

	private createForm = (therapy?: TherapyDto): void => {
		let durationInDays: boolean = (!therapy || therapy.duration != null);
		therapy = therapy || <TherapyDto>{};
		this.form = this._fb.group({
			description: [therapy.description, CommonValidators.required],
			startDate: [therapy.startDate, CommonValidators.required],
			notes: [therapy.notes],
			pathologies: [(therapy.pathologies || []).map(m => m.code)],
			durationInDays: [durationInDays],
			duration: [{ value: therapy.duration, disabled: false }, CommonValidators.required],
			mandatoryOrder: [therapy.mandatoryOrder || false, CommonValidators.required],
			medicalRecordUuid: [this._data.medicalRecord.id, CommonValidators.required],
		});
		this.on(this.form.controls.durationInDays.valueChanges.subscribe(newValue => {
			if (newValue) {
				this.form.controls.duration.enable();
			}
			else {
				this.form.controls.duration.disable();
				this.form.controls.duration.setValue(null);
			}
		}));
	}

	public loadPathologies = (value: string): Observable<SelectListitem[]> => {
		return this.pathologyService.listPathologies(value).pipe(map(m => {
			return m.map(m1 => new SelectListitem(m1.id, m1.value));
		}));
	}

	public onSelectedPathology = (item: SelectListitem): void => {
		let items = this.form.controls.pathologies.value || [];
		items.push(item.id);
		this.form.controls.pathologies.setValue(items);
		this.pathologies = [...this.pathologies, new MatChipItem(item)];
	}
	public onRemovePathology = (item: SelectListitem): void => {
		let items = this.form.controls.pathologies.value || [];
		items = items.filter(f => f != item.id);
		this.form.controls.pathologies.setValue(items);
		this.pathologies = [...this.pathologies.filter(f => f.data.id != item.id)];
	}

	public save = (): void => {
		if (this.form.isValid()) {
			if (this.recreate) {
				this._dialogService.showConfirm("md.recreateTherapyTitle", "md.recreateTherapyMessage", {
					callback: result => {
						if (result) {
							this.internalSave();
						}
					}
				})
			}
			else {
				this.internalSave();
			}
		}
	}

	public close = (): void => {
		this._dialog.close(null);
	}

	private internalSave = (): void => {
		let data: TherapyRequest = {
			description: this.form.value.description,
			startDate: moment(this.form.value.startDate).format("YYYY-MM-DD"),
			pathologies: this.form.value.pathologies,
			patient: this._data.medicalRecord.patient,
			mandatoryOrder: this.form.value.mandatoryOrder,
			notes: this.form.value.notes,
			medicalRecordUuid: this._data.medicalRecord.id
		};

		if (this.form.value.durationInDays) {
			data.duration = this.form.value.duration;
		}

		if (!this.isNew) {
			this._therapyService.updateTherapy(data, this._data.id).subscribe(result => {
				this.snackBarService.info("Update avvenuto con successo.")
				// this.snackBar.open('Update avvenuto con successo.', 'CHIUDI', { duration: 7000 });
				this._dialog.close(result);
			}, () => {
				this.snackBarService.error("Qualcosa è andato storto")
				// this.snackBar.open('Qualcosa è andato storto', 'CHIUDI', { duration: 7000 })
			});
		} else {
			this._therapyService.createTherapy(data).subscribe(result => {
				this.snackBarService.info("Creazione avvenuto con successo.")
				// this.snackBar.open('Creazione avvenuta con successo.', 'CHIUDI', { duration: 7000 });
				this._dialog.close(result);
			}, () => {
				this.snackBarService.error("Qualcosa è andato storto")
				// this.snackBar.open('Qualcosa è andato storto', 'CHIUDI', { duration: 7000 })
			});
		}
	}
}