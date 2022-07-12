import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { CommonValidators } from 'infrastructure/fidcare/components/forms/validators/common.validator';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';
import { delay, Observable, of } from 'rxjs';

@Component({
    selector: 'test-form',
    templateUrl: './test-form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TestFormComponent extends BaseComponent implements OnInit {
    public form: FormGroup;
    private _id: number = null;
    constructor(private _fb: FormBuilder, private _activatedRoute: ActivatedRoute, private _spinnerService: SpinnerService, private _snackBarService: SnackBarService) {
        super();
    }
    ngOnInit(): void {
        this.on(this._activatedRoute.params.subscribe(params => {
            if (params["id"]) {
                this._id = +params["id"];
                new FakeService().getById(this._id).subscribe(result => {
                    this.createForm(result);
                })
            }
            else {
                this.createForm();
            }
        }))
    }

    private createForm = (item: ItemToSave = new ItemToSave()): void => {
        this.form = this._fb.group({
            name: [item.name, [CommonValidators.required]],
            description: [item.description, [CommonValidators.required]],
        })
    }

    public save = (): void => {
        if (this.form.isValid()) {
            const formData = this.form.value;
            this._spinnerService.show();
            new FakeService().save(formData, this._id).subscribe(() => {
                this._spinnerService.hide();
                this._snackBarService.success("Inserire mnessaggio");
            });
        }
    }
}

class ItemToSave {

    public name: string;
    public description: string;
}
class Item extends ItemToSave {
    public id: number;
}

class FakeService {
    public getById = (id: number = null): Observable<Item> => {
        return of({
            id: 1,
            description: "Descrizione",
            name: "Nome"
        }).pipe(delay(100));
    }
    public save = (item: ItemToSave, id: number = null): Observable<Item> => {
        let obs: Observable<Item>;
        if (id) {
            //inserire put

            obs = of(<Item>{
                id: id,
                description: item.description,
                name: item.name
            })
        }
        else {

            obs = of(<Item>{
                id: 1,
                description: item.description,
                name: item.name
            })
        }

        return obs.pipe(delay(1000));
    }
}