import { Directive, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Directive({
    selector: '[goBack]'
})
export class GoBackDirective {
    constructor(private _router: Router) {

    }

    @Input('goBack') defaultUrl: string;

    @HostListener('click', ['$event'])
    public onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl')
        this._router.navigateByUrl(returnUrl || this.defaultUrl);
    }
}