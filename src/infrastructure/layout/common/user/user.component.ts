import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from 'environments/environment';
import { BaseComponent } from 'infrastructure/fidcare/components/common/base.component';
import { AuthService } from 'infrastructure/fidcare/services/auth.service';
import { CultureService } from 'infrastructure/fidcare/services/culture.service';
import { ProfileService } from 'infrastructure/fidcare/services/profile.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None
})
export class UserComponent extends BaseComponent implements OnInit {
    public profile: any = null;
    constructor(private _profileService: ProfileService, private _authService: AuthService, private _cultureService: CultureService) {
        super()
    }
    ngOnInit(): void {
        this.on(this._profileService.profile$.subscribe(result => {
            this.profile = result;
        }));
    }

    public signOut = (): void => {
        this._authService.logout();
    }
    public changeCulture = (cultureCode: string): void => {
        if (this._cultureService.getCurrentCulture() != cultureCode) {
            this._cultureService.setCurrentCulture(cultureCode);
        }
    }

    public get cultureCodes(): string[] {
        return environment.culture.cultureCodes;
    }

    public get cultureCode(): string {
        return this._cultureService.getCurrentCulture();
    }

    public get cultureFlag(): string {
        let culture = this._cultureService.getCurrentCulture();
        return `assets/images/flags/${culture}.png`;
    }

}
