import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'base-page',
    templateUrl: './base-page.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BasePageComponent implements OnInit {
    ngOnInit(): void {
        let a = 1;
    }
    @Input() public title: string = null;;
    @Input() public description: string = null;
}
