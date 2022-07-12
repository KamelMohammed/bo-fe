import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { ArrayValidators } from 'infrastructure/fidcare/components/forms/validators/array.validator';
import { SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'home',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends BaseComponent {
    public form: FormGroup;
    public initialItems = [new SelectListitem(1, "testo 1"), new SelectListitem(2, "testo 2")]
    constructor(private _fb: FormBuilder) {
        super();
		// for (let i = 0; i < 100; i++) {
        //     this.loader.push(new SelectListitem(i, "Testo " + i.toString()))
        // }
        

        // this.form = this._fb.group({
        //     items: [null, Validators.nullValidator]
        // })

		// this.form.valueChanges.subscribe((r) => {
		// 	console.log("change ", r);
		// 	console.log("status: " + this.form.valid);
			
		// });
    }

    // public loader = (text: string): Observable<SelectListitem[]> => {
    //     const ret: SelectListitem[] = [];
    //     for (let i = 0; i < 100; i++) {
    //         ret.push(new SelectListitem(i, "Testo " + i.toString()))
    //     }
    //     return of(ret.filter(f => f.label.indexOf(text) >= 0));
    // }
	public loader: SelectListitem[] = [];
	
}
