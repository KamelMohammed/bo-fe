import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { BasicErrorControllerService } from './api/basicErrorController.service';
import { DistrictService } from './api/district.service';
import { DoctorService } from './api/doctor.service';
import { OperationHandlerService } from './api/operationHandler.service';
import { OperatorUscaService } from './api/operatorUsca.service';
import { UserService } from './api/user.service';
import { WebMvcLinksHandlerService } from './api/webMvcLinksHandler.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    BasicErrorControllerService,
    DistrictService,
    DoctorService,
    OperationHandlerService,
    OperatorUscaService,
    UserService,
    WebMvcLinksHandlerService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
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
