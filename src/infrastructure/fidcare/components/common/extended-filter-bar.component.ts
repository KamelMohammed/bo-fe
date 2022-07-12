import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableFilterFieldDef } from 'infrastructure/fidcare/models/common.models';


@Component({
    selector: 'extended-filter-bar',
    templateUrl: './extended-filter-bar.component.html'
})
export class ExtendedFilterBar implements OnInit {
	@Input() filterValue: any;
	@Input() filterFielsDescription: TableFilterFieldDef[] = [];
	@Output() requestFilterUpdate: EventEmitter<any> = new EventEmitter();
    
	form: FormGroup = null;
	filterShown: boolean = false;

	constructor(private _fb: FormBuilder) {
	}
	ngOnInit() {
		let group: any = {};
		this.filterFielsDescription.forEach((filter) => {
			group[""+filter.fieldName] = [null, filter.validators];
		});
		this.form = this._fb.group(group);
		if (this.filterValue) {
			this.form.patchValue(this.filterValue);
		}
	}
	
	requestUpdate = () => {
		this.requestFilterUpdate.emit(this.form.value);
	}

	requestReset = () => {
		this.form.reset();
		this.requestFilterUpdate.emit(this.form.value);
	}

	showHideFilters = () => {
		this.filterShown = !this.filterShown;
		if (!this.filterShown) this.requestReset();
	}

	public get filterButtonTooltip(): string {
		if (this.filterShown) return "common.hideFilterButtonLabel";
		return "common.showFilterButtonLabel";
	}
}