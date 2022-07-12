import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '../infrastructure/@fuse/fuse.module';
import { appConfig } from 'infrastructure/@fuse/config/app.config';
import { LayoutModule } from '../infrastructure/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { FuseConfigModule } from '../infrastructure/@fuse/services/config/config.module';
import { environment } from 'environments/environment';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { StartupModule } from 'infrastructure/fidcare/modules/startup.module';

import { BASE_PATH as AED_BASE_PATH } from './services/api/aed';
import { BASE_PATH as AGE_BASE_PATH } from './age-module/services';
import { BASE_PATH as ATM_BASE_PATH } from './services/api/atm';
import { BASE_PATH as CPM_V10_BASE_PATH } from './services/api/cdr';
import { BASE_PATH as CPM_BASE_BASE_PATH } from './services/api/cpmbase';
import { BASE_PATH as DDR_BASE_PATH } from './services/api/ddr';
import { BASE_PATH as DIA_BASE_PATH } from './services/api/dia';
import { BASE_PATH as MEASUREMENTRULE_BASE_PATH } from './services/api/measurementrule';
import { BASE_PATH as MEDICAL_RECORD_BASE_PATH } from './md-module/services/mrc';
import { BASE_PATH as PAS_BASE_PATH } from './services/api/pas';
import { BASE_PATH as VITAL_MEASUREMENT_BASE_PATH } from './services/api/vital-measurement';

import "../infrastructure/fidcare/extensions-methods/array.extensions";
import "../infrastructure/fidcare/extensions-methods/form.extensions";
import "../infrastructure/fidcare/extensions-methods/object.extensions";
import "../infrastructure/fidcare/extensions-methods/router.extensions";
import "../infrastructure/fidcare/extensions-methods/string.extensions";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'infrastructure/fidcare/services/jwt-token-interceptor.service';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ComponentsModule.forRoot(environment.forms),
        RouterModule.forRoot(appRoutes, routerConfig),
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),

        // Core module of your application
        StartupModule.forRoot(environment.culture),

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),


    ],
    bootstrap: [
        AppComponent
    ],
	// providers: [
    //     { provide: CPM_BASE_BASE_PATH, useValue: environment.services.api.icpBasePath },
    //     { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // ]
    providers: [
        { provide: CPM_V10_BASE_PATH, useValue: environment.services.api.cdr },
        { provide: MEASUREMENTRULE_BASE_PATH, useValue: environment.services.api.measurementruleBasePath },
        { provide: VITAL_MEASUREMENT_BASE_PATH, useValue: environment.services.api.vitalMeasurementBasePath },
        { provide: MEDICAL_RECORD_BASE_PATH, useValue: environment.services.api.medicalRecordBasePath },
        { provide: DIA_BASE_PATH, useValue: environment.services.api.diaBasePath },
        { provide: CPM_BASE_BASE_PATH, useValue: environment.services.api.cpmBaseBasePath },
        { provide: ATM_BASE_PATH, useValue: environment.services.api.atmBasePath },
        { provide: AED_BASE_PATH, useValue: environment.services.api.aedBasePath },
        { provide: PAS_BASE_PATH, useValue: environment.services.api.pasBasePath },
        { provide: DDR_BASE_PATH, useValue: environment.services.api.ddrBasePath },
        { provide: AGE_BASE_PATH, useValue: environment.services.api.ageBasePath },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ]
})
export class AppModule {
}
