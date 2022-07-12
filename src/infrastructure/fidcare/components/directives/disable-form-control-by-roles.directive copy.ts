import { FormControl, NgControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';

@Directive({
    selector: '[disableByRoles]'
})
export class DisableFormControlByRolesDirective {
    private _roles: string[] = [];
    @Input()
    set roles(roles: string[]) {
        this._roles = roles;
        this.setState();
    }
    get roles() {
        return this._roles;
    }

    constructor(private _control: FormControl, private _profileService: ProfileService) {
    }


    private setState = (): void => {
        this._profileService.profile$.subscribe(result => {
            if (!this.roles.innerJoin(result.roles, i => i, i => i, (r, p) => r).any()) {
                if (!this._control.disabled)
                    this._control.disable();
            }
        }).unsubscribe();
    }
}