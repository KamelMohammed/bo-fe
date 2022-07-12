import { Component, ViewEncapsulation } from '@angular/core';
import { delay } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { fuseAnimations } from 'infrastructure/@fuse/animations/public-api';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';

@Component({
    selector: 'spinner',
    templateUrl: './spinner.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SpinnerComponent {
    public visible$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

    constructor(private _spinnerService: SpinnerService) {
        this._spinnerService.toggle.pipe(delay(0)).subscribe(result => {
            this.visible$.next(result);
        })
    }
}
