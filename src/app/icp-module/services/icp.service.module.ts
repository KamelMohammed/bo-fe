// import { PASService } from './api/pas.service';
// import { ServiceService } from './api/service.service';
// import { GlossaryService } from './api/glossary.service';
// import { ActivityService } from './api/activity.service';
// import { CareLevelService } from './api/care-level.service';
// import { APP_INITIALIZER, NgModule} from '@angular/core';
// import { HttpService } from 'infrastructure/fidcare/services/http.service';


// function initGlossary(glossaryService: GlossaryService) {
// 	return (): Promise<any> => { 
// 		console.log('initGlossary - started');
// 		return glossaryService.loadConfiguration().then((result) => {
// 			console.log("Glossary initialized");
// 		})	
// 	};
// }

// @NgModule({
// 	imports: [],
// 	declarations: [],
// 	exports: [],
// 	providers: [
// 		HttpService,
// 		CareLevelService,
// 		ActivityService,
// 		GlossaryService,
// 		{
// 			provide: APP_INITIALIZER,
// 			useFactory: initGlossary,
// 			deps: [GlossaryService],
// 			multi: true
// 		},
// 		ServiceService,
// 		PASService
// 	]
// })
// export class CmpServiceModule {

// 	// constructor(@Optional() @SkipSelf() parentModule: CmpServiceModule,
// 	// 	@Optional() http: HttpClient) {
// 	// 	if (parentModule) {
// 	// 		throw new Error('CmpServiceModule is already loaded. Import in your base AppModule only.');
// 	// 	}
// 	// 	if (!http) {
// 	// 		throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
// 	// 			'See also https://github.com/angular/angular/issues/20575');
// 	// 	}
// 	// }
// }

