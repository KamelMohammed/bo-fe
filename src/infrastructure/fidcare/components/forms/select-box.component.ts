
import { Component, Input, Optional, Host, SkipSelf, Inject, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { KeyValue } from '../../models/common.models';
import { BaseInputComponent } from './base-input.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, of, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
	selector: 'select-box',
	templateUrl: './select-box.component.html',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => SelectBoxComponent),
		multi: true,
	}]
})

export class SelectBoxComponent extends BaseInputComponent<any, any> {
	@Input() public autocomplete: boolean =false;
	@Input() public items: any[] = [];
	@Input() public itemKey: string = "id";
	@Input() public itemLabel: string = "label";
	@Input() public sort: boolean = true
	@Input() public showPlaceHolder: boolean = true;
	@Input() public multiple: boolean = false;
	@Input() public panelClass: string = "";
	@ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	inputItemCtrl: FormControl = new FormControl();
	filteredItems: Observable<any[]>;

	public get sortedItems(): any[] {
		let ret = [...this.items || []];
		if (this.sort && ret.any()) {
			ret = ret.sortAsc(f => f[this.itemLabel]);
		}
		return ret;
	}

	constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
		super(controlContainer, translateService, configuration);
		this.filteredItems = this.inputItemCtrl.valueChanges.pipe(
			startWith(null),
			map((text) => { return this._filter(text); })
		);
	}
	protected initialize = (): void => {
		if (this.autocomplete)
			this.placeHolder = "common.searchInSelectBox"
		else
			this.placeHolder = "common.select";

	}

	protected toInternalFormat(value: any): any {
		return value;
	}

	protected toExternalFormat(value: any): any {
		if (this.control) {
			let values: any[] = [];
			if (!this.multiple) {
				if (value != null) {
					values = [value];
				}
			}
			else {
				if ((value || []).any()) {
					values = [...value || []];
				}
			}
			const keyValues = this.items.innerJoin(values, i => i[this.itemKey], v => v, (i, v) => {
				return new KeyValue(i[this.itemKey], i[this.itemLabel]);
			});
			this.control["keyValues"] = keyValues;
		}
		if (value === "") {
			return null;
		}
		return value;

	}

	public get selectedItems(): any[] {
		let ret = [];
		if (this.multiple) {
			ret = this.items.filter((item) => {
				return (this.value || []).indexOf(item[this.itemKey]) >= 0
			})
		}
		else {
			ret = this.items.filter((item) => {
				return this.value == item[this.itemKey];
			})
		}
		return ret;
	}

	add = (event: MatChipInputEvent): void => {
		this.inputItemCtrl.setValue("");
		event.chipInput!.clear();
	}

	remove = (itemToRemove: any): void => {
		if (this.multiple) {
			if (!this.value) this.value = [];
			else {
				this.value = (<any[]>this.value).filter(v => { return v != itemToRemove });
			}
		}
		else {
			this.value = null;
		}
	}

	selected = (event: MatAutocompleteSelectedEvent): void => {
		if (this.multiple) {
			if (!this.value) this.value = [];
			this.value = [...this.value, event.option.value];
		}
		else {
			this.value = event.option.value;
		}
		this.itemInput.nativeElement.value = '';
		this.inputItemCtrl.setValue("");
	}


	_filter = (value: string): any[] => {
		const filterValue = (value + "").toLowerCase();
		return this.sortedItems.filter(item => {
			if (this.multiple)
				return (item[this.itemLabel] && item[this.itemLabel].toLowerCase().includes(filterValue) && ((this.value || []).indexOf(item[this.itemKey]) < 0));
			return (item[this.itemLabel] && item[this.itemLabel].toLowerCase().includes(filterValue) && this.value != item[this.itemKey]);
		});
	}
}
