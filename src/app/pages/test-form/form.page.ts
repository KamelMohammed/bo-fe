import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
    selector: 'form-page',
    templateUrl: './form.page.html'
})

export class FormPage {
	
    public form: FormGroup = null;
    public selectItems: SelectListitem[] = [];
    public initialItem: SelectListitem = null;
	public _polygon: any = []

	remove = () => {
		console.log("remove");
	}
	updateContent = () => {
		console.log("updateContent");
		
	}
	editProperties = () => {
		console.log("editProperties");
		
	}

    constructor(private _fb: FormBuilder) {
	    this.form = _fb.group({
			text: [null, Validators.required],
            multiline: [null, Validators.required],
            dateNoUTC: ["2020-12-26T23:00:00.000Z", Validators.required],
            dateUTC: ["2020-12-26T23:00:00.000Z", Validators.required],
            int: [20, Validators.required],
            decimal: [20.2, Validators.required],
            vertical: [true],
            horizontal: [false],
            single: [null, Validators.required],
            multiple: [[], Validators.required],
            autocomplete: [1, Validators.required],
            quill: [null, Validators.required],
            tags: [["1", "2"]],
        });
        
        // this.form.patchValue({
            
        //         // localizedData:[]
        //         localizedData:[{language: "it", value: ""}]
        // })
        this.form.updateValueAndValidity();
        console.log(this.form);
        this.form.valueChanges.subscribe((change) => {
            console.log("change", change);
            
        })
		let data = [{id: 1, name: "Benevento"}, {id: 2, name: "Napoli"}, {id:3, name: "Palermo"}]
		this.selectItems = data.map(m => new SelectListitem(m.id, m.name));
		this.initialItem = this.selectItems[0];

    }

	public getCities = (term: string): Observable<SelectListitem[]> => {
		let data = [{id: 1, name: "Benevento"}, {id: 2, name: "Napoli"}, {id:3, name: "Palermo"}]
		data = data.filter((value) => {
			return value.name.toLowerCase().indexOf(term.toLowerCase()) >= 0;
		})
		return of(data.map(m => new SelectListitem(m.id, m.name)));
    }
    public save() {
        if (this.form.isValid()) {
            alert(JSON.stringify(this.form.getRawValue()));
        }
    }
}
