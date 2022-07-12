import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MedicalRecordRequest } from 'app/md-module/services/mrc';
import { CategoryDTO, ExperimentationControllerService, ExperimentationRequest, ExperimentationResponseDTO } from 'app/services/api/cdr';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
	selector: 'app-experimentation',
	templateUrl: './experimentation.component.html'
})
export class ExperimentationComponent extends BaseComponent implements OnInit {
	@Input() medicalRecord: MedicalRecordRequest;
	@Input() closeMRMode = false;
	@Input() readOnly = false;

	public activeItems: SelectListitem[] = [];
	public categories: CategoryDTO[] = []
	public form: FormGroup = null;
	constructor(private readonly _experimentationService: ExperimentationControllerService, private readonly _fb: FormBuilder, private readonly _snackBarService: SnackBarService) {
		super()
	}

	ngOnInit() {
		this.createForm();

		this.activeItems.push(new SelectListitem(true, 'Gruppo attivo'))
		this.activeItems.push(new SelectListitem(false, 'Gruppo di controllo'))
		this._experimentationService.loadCategoriesUsingGET().subscribe(result => {
			this.categories = result;
		});

		this.getData();
	}

	private createForm = (): void => {
		this.form = this._fb.group({
			uuidCategory: [null, CommonValidators.required],
			active: [null, CommonValidators.required],
			homeCare: [false, CommonValidators.required],
			uuidPatient: [this.medicalRecord.patient.id],
			association: [false],
			partNumber: [""],
			serialNumber: [""],

			dispenserNumber: [""],
			dispenserSeralNumber: [""]
		});
		this.on(this.form.controls.uuidCategory.valueChanges.subscribe(newValue => this.categoryChanged(newValue)));
	}

	private categoryChanged = (categoryId: string): void => {
		const currentCategory = this.categories.find(f => f.uuid == categoryId) ?? <CategoryDTO>{};
		// this.form.controls.serialNumber.setValue(currentCategory.partNumber);
		this.form.controls.partNumber.setValue(currentCategory.partNumber);
	}

	private updateForm = (initialData?: ExperimentationResponseDTO): void => {
		initialData = initialData || <ExperimentationResponseDTO>{};
		this.form.controls.uuidCategory.setValue(initialData.category ? initialData.category.uuid : null);
		this.form.controls.active.setValue(initialData.active);
		this.form.controls.homeCare.setValue(initialData.homeCare);
		
		this.form.controls.partNumber.setValue(initialData.category ? initialData.category.partNumber : null);
		this.form.controls.serialNumber.setValue(initialData.serialNumber);
		
		this.form.controls.association.setValue(initialData.association);

		
		//TODO: associare dispenserNumber e dispenserSeralNumber ai campi del modello.
		// attualmente non ci sono campi utili nel model del DTO
		// this.form.controls.dispenserNumber.setValue(initialData.dispenserNumber);
		// this.form.controls.dispenserSeralNumber.setValue(initialData.dispenserSeralNumber);

		this.categoryChanged(this.form.controls.uuidCategory.value);
	}


	private getData = (): void => {
		let obsCategories: Observable<CategoryDTO[]> = of(this.categories);
		if (!this.categories.any()) {
			obsCategories = this._experimentationService.loadCategoriesUsingGET()
		}
		forkJoin([obsCategories, this._experimentationService.readUsingGET(this.medicalRecord.patient.id)]).subscribe(results => {
			this.categories = results[0]
			this.updateForm(results[1]);
		});
	}

	public undo = (): void => {
		this.getData();
	}

	public save = (): void => {
		if (this.form.isValid()) {
			let data: ExperimentationRequest = {
				active: this.form.value.active,
				homeCare: this.form.value.homeCare,
				serialNumber: '',
				uuidCategory: this.form.value.uuidCategory,
				uuidPatient: this.medicalRecord.patient.id
			};
			
			this._experimentationService.saveUsingPOST(data).subscribe({
				next: data => {
					this._snackBarService.operationSuccesfull();
				},
				error: () => {
					this._snackBarService.error('Qualcosa è andato storto.')
				}
			});
		}
	}
}
