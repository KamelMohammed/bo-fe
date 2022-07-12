import { Component, Input } from '@angular/core';
import { BaseComponent } from './base.component';

@Component({
    selector: 'filter-bar',
    templateUrl: './filter-bar.component.html'
})
export class FilterBarComponent extends BaseComponent {
    @Input() public expanded: boolean = true;
    @Input() public expandable: boolean = false;
    @Input() public bordered: boolean = true;
}
