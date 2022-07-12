import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from './base.component';

@Component({
    selector: 'add-button-component',
    templateUrl: './add-button.component.html'
})
export class AddButtonComponent extends BaseComponent {
	@Input() tooltip: string = "common.add";
	@Input() disabled: boolean = false;
	@Output() onAddButtonClick: EventEmitter<any> = new EventEmitter();

	emitClick = ($event) => {
		this.onAddButtonClick.emit($event)
	}
}
