import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'field-viewer',
    templateUrl: './field-viewer.component.html',
    encapsulation: ViewEncapsulation.None
})

export class FieldViewerComponent {
    public viewerModes = ViewerModes;
    @Input() public label: string = null;
    @Input() public mode: ViewerModes = ViewerModes.CENTERED;
}

export enum ViewerModes {
    DEFAULT = "Default",
    LEFT = "Left",
    CENTERED = "Centered"
}
