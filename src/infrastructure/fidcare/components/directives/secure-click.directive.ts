import { Directive, Input, HostListener } from '@angular/core';
import { Observable } from 'rxjs';


@Directive({
    selector: '[secure-click]'
})
export class SecureClickDirective {

    @Input('secure-click') clickAttachment: Observable<string>;

    @HostListener('click', ['$event'])
    public onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.clickAttachment) {
            this.clickAttachment.subscribe(url => {
                window.open(url, '_blank');
            });
        }
    }
}