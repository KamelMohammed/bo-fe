import { Directive } from '@angular/core';
import { NumberDirective } from './number.directive';

@Directive({
 selector: '[int]'
})
export class IntDirective extends NumberDirective {
    protected additionalCheck(event: KeyboardEvent): boolean {
        return false;
    }
}