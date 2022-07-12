import { Directive, ElementRef, Input } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Directive({
    selector: '[disableByRoles]'
})
export class DisableByRolesDirective {
    private _roles: string[] = [];
    @Input()
    set roles(roles: string[]) {
        this._roles = roles;
        this.setState();
    }
    get roles() {
        return this._roles;
    }

    constructor(private _elementRef: ElementRef, private _profileService: ProfileService) {
    }


    private setState = (): void => {
        this._profileService.profile$.subscribe(result => {
            if (result.roles.innerJoin(this.roles, i => i, i => i, (i, r) => i).any()) {
                (<HTMLElement>this._elementRef.nativeElement).removeAttribute("disabled");
            }
            else {
                (<HTMLElement>this._elementRef.nativeElement).setAttribute("disabled", "disabled");
            }
        })

    }
}