import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Profile, Roles } from '../models/profile.models';
import { ChangePassword, ProfileWrite } from 'app/models/profile.models';
import { HttpService } from './http.service';
import jwtDecode from "jwt-decode";
import { environment } from 'environments/environment';

@Injectable()
export class ProfileService {
	public profile$: ReplaySubject<Profile> = new ReplaySubject<Profile>(1);
	private _profile: Profile;
	private get profile(): Profile {
		return this._profile;
	}
	private set profile(profile: Profile) {
		this._profile = profile;
		this.profile$.next(profile);
	}
	constructor(private _oauthService: OAuthService, protected _http: HttpService) {
	}
	public loadUserProfile = (): Observable<Profile> => {
		return from(this._oauthService.loadUserProfile()).pipe(map((result: any) => {
			var decoded = <any>jwtDecode(this._oauthService.getAccessToken());
			const ret = new Profile();
			ret.email = result.info.email;
			ret.firstName = result.info.given_name;
			ret.lastName = result.info.family_name;
			ret.userId = result.info.sub;
			ret.roles = decoded.realm_access.roles || [];
			return ret;
		})).pipe(tap(result => {
			this.profile = result;
		}));
	}

	public saveProfile = (profile: ProfileWrite): Observable<Profile> => {
		return this.loadUserProfile().pipe(mergeMap((result: Profile) => {
			result.firstName = profile.firstName;
			result.lastName = profile.lastName;
			result.email = profile.email;
			return this._http.put(`${this._oauthService.issuer}/account/profile`, result);
		})).pipe(tap(result => {
			this.profile = result;
		}));
	}

	public changePassword = (changePassword: ChangePassword): Observable<any> => {
		return this._http.put(`${environment.services.api.profileBasePath}/users/passwordchange/${encodeURIComponent(this.profile.userId)}`, {
			currentPassword: changePassword.oldUserPassword,
			newPassword: changePassword.newUserPassword,
			confirmation: changePassword.confirmNewUserPassword
		});
		//return of(changePassword.newUserPassword);
	}

	public isInRole = (role: Roles): boolean => {
		return this._profile.roles.includes(role.toLowerCase());
	}
}

