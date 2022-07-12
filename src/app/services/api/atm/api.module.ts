import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AdministrationService } from './api/administration.service';
import { DrugsService } from './api/drugs.service';
import { PathologyService } from './api/pathology.service';
import { ProtocolService } from './api/protocol.service';
import { TherapyService } from './api/therapy.service';

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: [
        AdministrationService,
        DrugsService,
        PathologyService,
        ProtocolService,
        TherapyService]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [{ provide: Configuration, useFactory: configurationFactory }]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: ApiModule,
        @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
                'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
