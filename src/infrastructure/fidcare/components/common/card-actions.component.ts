import { Component, Input } from '@angular/core';
import { DataTableAction } from '../data-table/types';
import { BaseComponent } from './base.component';

@Component({
    selector: 'card-actions',
    templateUrl: './card-actions.component.html'
})
export class CardActionsComponent extends BaseComponent {
	@Input() actions: DataTableAction[] = [];
	@Input() data: any;

	public get firstActions() {
		if (this.actions) return this.actions.slice(0,2);
		return null;
	}

	public get otherActions() {
		if (this.actions && this.actions.length>2) return this.actions.slice(2);
		return null;
	}
}
