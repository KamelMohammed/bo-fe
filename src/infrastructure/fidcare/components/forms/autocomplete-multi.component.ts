import { Component, Input, Optional, Host, SkipSelf, EventEmitter, Inject, OnDestroy, Output, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputComponent } from './base-input.component';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from './forms';
import { MatChipItem, SelectListitem } from 'infrastructure/fidcare/models/common.models';
import { AutocompleteActionItem } from './autocomplete.component';

@Component({
    selector: 'autocomplete-multi',
    templateUrl: './autocomplete-multi.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutocompleteMultiComponent),
        multi: true,
    }],
    styleUrls: ["./autocomplete.component.scss"]
})

export class AutocompleteMultiComponent extends BaseInputComponent<any[], any[]> implements OnDestroy {
    @Input() public loader: (value: string) => Observable<any[]>;
    @Input() public itemKey: string = "id";
    @Input() public itemLabel: string = "label";
    @Input() public minChars: number = 3;
    @Input() public actionItems: AutocompleteActionItem[] = [];
    @Input() public resetOnItemSelected: boolean = false;
    @Input() public set initialItems(value: any[]) {
        if (value != null) {
            this.items = value.map(m => new MatChipItem(new SelectListitem(m[this.itemKey], m[this.itemLabel])));
        }
    }

    public items: MatChipItem[] = [];


    constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer, translateService: TranslateService, @Inject(FORM_COMPONENTS_TOKEN) configuration: IFormComponents) {
        super(controlContainer, translateService, configuration);
    }
    ngOnDestroy(): void {
    }

    protected toInternalFormat(value: any[]): any[] {
        return value ? value : [];
    }

    protected toExternalFormat(value: any[]): any[] {
        return value ? value : [];
    }

    public onSelectedItem = (item: any): void => {
        if (this.value.indexOf(item[this.itemKey]) < 0) {
            this.items = [...this.items, new MatChipItem(new SelectListitem(item[this.itemKey], item[this.itemLabel]))];
            this.value = this.items.map(m => m.data[this.itemKey]);
        }
    }

    public onRemoveItem = (item: any): void => {
        this.items = [...this.items.filter(f => f.data[this.itemKey] != item[this.itemKey])];
        this.value = this.items.map(m => m.data[this.itemKey]);
    }
}
