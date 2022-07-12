import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AssistitoControllerService } from './api/assistitoController.service';
import { ContattoControllerService } from './api/contattoController.service';
import { DiagnosiControllerService } from './api/diagnosiController.service';
import { DurataControllerService } from './api/durataController.service';
import { EventoControllerService } from './api/eventoController.service';
import { TeleconsultoControllerService } from './api/teleconsultoController.service';
import { TelevisitaControllerService } from './api/televisitaController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AssistitoControllerService,
    ContattoControllerService,
    DiagnosiControllerService,
    DurataControllerService,
    EventoControllerService,
    TeleconsultoControllerService,
    TelevisitaControllerService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders <ApiModule> {
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
