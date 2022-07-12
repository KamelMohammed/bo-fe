import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipItem } from '../../models/common.models';
import { BaseComponent } from '../common/base.component';

@Component({
    selector: 'chips',
    templateUrl: './chips.component.html'
})
export class ChipsComponent extends BaseComponent {
    public isObject: boolean = true;
    @Input() private _items: MatChipItem<any>[] = [];
    @Input()
    public get items(): MatChipItem<any>[] {
        return this._items;
    }
    public set items(value: MatChipItem<any>[]) {
        this._items = [...value];
        if (this._items.any()) {
            this.isObject = typeof this._items.first().data == "object";
        }
        else {
            this.isObject = true;
        }
    }
    @Input() public itemKey: string = "id";
    @Input() public itemLabel: string = "label";
    @Input() public removable: boolean = true;
    @Input() public horizontal: boolean = true;
    @Output() public remove: EventEmitter<any> = new EventEmitter();
    @Output() public click: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
    }
    public onRemove = (item: any): void => {
        this.remove.next(item);
    }
    public onClick = (item: any): void => {
        this.click.next(item);
    }

}
