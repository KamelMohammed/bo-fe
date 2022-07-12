import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { FuseScrollbarModule } from 'infrastructure/@fuse/directives/scrollbar/scrollbar.module';
import { IconsModule } from 'infrastructure/@fuse/icons/icons.module';
import { CultureService } from 'infrastructure/fidcare/services/culture.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { HttpService } from 'infrastructure/fidcare/services/http.service';
import { InMemoryTranslateHttpLoader } from 'infrastructure/fidcare/services/in-memory-translate-loader';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { SpinnerService } from 'infrastructure/fidcare/services/spinner.service';
import { StorageService } from 'infrastructure/fidcare/services/storage.service';
import { CULTURE_CONFIGURATION_TOKEN, ICultureConfiguration } from 'infrastructure/fidcare/models/common.models';
import { ClipboardService } from 'ngx-clipboard';
import { from, mergeMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TitleService } from '../services/title.service';
import { NavigationItemsService } from '../services/navigation-items.service';
import localeIt from '@angular/common/locales/it';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { ProfileService } from '../services/profile.service';
import { EventBusService } from '../services/event-bus.service';
registerLocaleData(localeIt);
registerLocaleData(localeEn);

export function httpLoaderFactory(http: HttpClient, cultureConfiguration: ICultureConfiguration) {
    return new InMemoryTranslateHttpLoader(http, cultureConfiguration);
}


export function languageLoader(translateService: TranslateService, cultureService: CultureService) {
    return function () {

        return (<InMemoryTranslateHttpLoader>translateService.currentLoader).initialize().pipe((tap(t => {
            cultureService.initialize();
        })))
            .toPromise();
    }
}

export const translateModule = TranslateModule.forRoot({
    loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient, CULTURE_CONFIGURATION_TOKEN]
    }
});





// export function createAuthenticationService(oauthService: OAuthService, httpClient: HttpClient) {
//     return new AuthService(oauthService, httpClient)
// }

export function loadAuthenticationConfiguration(authService: AuthService, profileService: ProfileService) {
    return () => {
        return authService.verifyLogin()
            .pipe(mergeMap(result => {
                if (result) {
                    return profileService.loadUserProfile();
                }
                else {
                    authService.startLogin();
                }

            }))
            .toPromise();
    }
}


@NgModule({
    imports: [
        IconsModule,
        translateModule,
        FuseScrollbarModule,
        OAuthModule.forRoot()
    ]
})
export class StartupModule {
    public static forRoot(cultureConfiguration: ICultureConfiguration): ModuleWithProviders<StartupModule> {
        return {
            ngModule: StartupModule,

            providers: [
                HttpService,
                SpinnerService,
                SnackBarService,
                DialogService,
                CultureService,
                SpinnerService,
                ClipboardService,
                StorageService,
                TitleService,
                AuthService,
                ProfileService,
				EventBusService,
                NavigationItemsService,
                // {
                //     provide: APP_INITIALIZER,
                //     useFactory: initializeKeycloak,
                //     multi: true,
                //     deps: [KeycloakService]
                // },
                {
                    provide: APP_INITIALIZER,
                    useFactory: loadAuthenticationConfiguration,
                    deps: [AuthService, ProfileService],
                    multi: true
                },
                {
                    provide: CULTURE_CONFIGURATION_TOKEN,
                    useValue: cultureConfiguration,
                    multi: false
                },
                {
                    provide: MAT_DATE_LOCALE,
                    useValue: cultureConfiguration.defaultCultureCode
                },
                {
                    provide: DateAdapter,
                    useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]
                },
                {
                    provide: MAT_DATE_FORMATS,
                    useValue: MAT_MOMENT_DATE_FORMATS
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: languageLoader,
                    deps: [TranslateService, CultureService],
                    multi: true
                }
            ]
        };
    }
    constructor(
        @Optional() @SkipSelf() parentModule?: StartupModule
    ) {
        // Do not allow multiple injections
        if (parentModule) {
            throw new Error('StartupModule has already been loaded. Import this module in the AppModule only.');
        }
    }
}
