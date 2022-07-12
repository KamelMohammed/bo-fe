import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AslControllerService } from './api/aslController.service';
import { AslRegionControllerService } from './api/aslRegionController.service';
import { CitizenshipControllerService } from './api/citizenshipController.service';
import { CityControllerService } from './api/cityController.service';
import { DistrictControllerService } from './api/districtController.service';
import { ExperimentationControllerService } from './api/experimentationController.service';
import { GeneralDoctorControllerService } from './api/generalDoctorController.service';
import { NationalityControllerService } from './api/nationalityController.service';
import { NeighborhoodControllerService } from './api/neighborhoodController.service';
import { PatientControllerService } from './api/patientController.service';
import { ProvinceControllerService } from './api/provinceController.service';
import { ReferencePeopleControllerService } from './api/referencePeopleController.service';
import { StudyControllerService } from './api/studyController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AslControllerService,
    AslRegionControllerService,
    CitizenshipControllerService,
    CityControllerService,
    DistrictControllerService,
    ExperimentationControllerService,
    GeneralDoctorControllerService,
    NationalityControllerService,
    NeighborhoodControllerService,
    PatientControllerService,
    ProvinceControllerService,
    ReferencePeopleControllerService,
    StudyControllerService ]
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
