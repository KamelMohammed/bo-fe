import { ConfigurationTctComponent } from './pages/configuration-tct/configuration-tct.component';
import { AddAlertParameterTctComponent } from './pages/add-alert-parameter-tct/add-alert-parameter-tct.component';
import { AlertParametersTctComponent } from './pages/alert-parameters-tct/alert-parameters-tct.component';
import { TctHomeComponent } from './pages/tct-home/tct-home.component';
import { ComponentsModule } from './../../infrastructure/fidcare/modules/components.module';
import { VitalParametersTctComponent } from './pages/vital-parameters-tct/vital-parameters-tct.component';
import { VitalParametersChartTctComponent } from './pages/vital-parameters-chart-tct/vital-parameters-chart-tct.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OldSharedModule } from 'app/shared/shared.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { GridsterModule } from 'app/shared/gridster/gridster.module';
import { MdePopoverModule } from '@material-extended/mde';

@NgModule({
	imports: [
		CommonModule,
		OldSharedModule,
		SharedModule,
		GridsterModule,
		MdePopoverModule,
		ComponentsModule
	],
	declarations: [
		VitalParametersChartTctComponent,
		VitalParametersTctComponent,
		TctHomeComponent,
		AlertParametersTctComponent,
		AddAlertParameterTctComponent,
		ConfigurationTctComponent
	],
	exports: [
		VitalParametersChartTctComponent,
		VitalParametersTctComponent,
		ConfigurationTctComponent,
		TctHomeComponent
	]
})
export class TctModuleModule { }
