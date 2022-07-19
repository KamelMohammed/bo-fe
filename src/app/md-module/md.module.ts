import { TctModuleModule } from './../tct-module/tct-module.module';
import { MEFModule } from './../mef-module/mef-module';
import { EditDiaryServiceActivityComponent } from './pages/clinical-diary/pai/unic-diary/edit-diary-service-activity/edit-diary-service-activity.component';
import { UnicDiaryComponent } from './pages/clinical-diary/pai/unic-diary/unic-diary.component';
import { PaiModule } from './../icp-module/pages/pai/pai.module';
import { CMPModule } from './../icp-module/icp-module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'app/shared/gridster/gridster.module';
import { OldSharedModule } from 'app/shared/shared.module';
import { FuseNavigationItem } from 'infrastructure/@fuse/components/navigation/navigation.types';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';

import { mdNavigation } from './md-navigation';
import { MdRoutingModule } from './md-routing.module';
import { CloseMedicalRecordDialogComponent } from './pages/clinical-diary/close-medical-record-dialog/close-medical-record-dialog.component';
import { ClinicalDiariesComponent } from './pages/clinical-diaries/clinical-diaries.component';
import { ClinicalDiaryComponent } from './pages/clinical-diary/clinical-diary.component';
import { PatientComponent } from './pages/clinical-diary/patient/patient.component';
import { MedicalRecordService } from './services/mrc';
import { ApiModule as CdrApiModule, ExperimentationControllerService } from 'app/services/api/cdr';
import { ApiModule } from 'app/services/api/pas';
import { VitalParametersHomeComponent } from './pages/clinical-diary/vital-parameters/vital-parameters-home/vital-parameters-home.component';
import { VitalParametersComponent } from './pages/clinical-diary/vital-parameters/vital-parameters/vital-parameters.component';
import { VitalParametersChartComponent } from './pages/clinical-diary/vital-parameters/vital-parameters-chart/vital-parameters-chart.component';
import { SurveyService, VitalParametersService, OperationService } from 'app/services/api/cpmbase';
import { AddVitalParameterComponent } from './pages/clinical-diary/vital-parameters/add-vital-parameter/add-vital-parameter.component';
import { AlertParametersComponent } from './pages/clinical-diary/vital-parameters/alert-parameters/alert-parameters.component';
import { AddAlertParameterComponent } from './pages/clinical-diary/vital-parameters/add-alert-parameter/add-alert-parameter.component';
import { DiaryComponent } from './pages/clinical-diary/diary/diary.component';
import { ExperimentationComponent } from './pages/clinical-diary/experimentation/experimentation.component';
import { AddDiaryComponent } from './pages/clinical-diary/diary/add-diary/add-diary.component';
import { MedicalRecordAlertConfigResourceService } from 'app/services/api/measurementrule';
import { ActivityControllerService } from 'app/services/api/dia';
import { TherapiesComponent } from './pages/clinical-diary/therapies/therapies.component';
import { TherapiesListComponent } from './pages/clinical-diary/therapies/therapies-list/therapies-list.component';
import { EditTherapyHeaderComponent } from './pages/clinical-diary/therapies/edit-therapy-header/edit-therapy-header.component';
import { PathologyService, TherapyService } from 'app/services/api/atm';
import { TherapyComponent } from './pages/clinical-diary/therapies/therapy/therapy.component';
import { TherapySheetComponent } from './pages/clinical-diary/therapies/therapy-sheet/therapy-sheet.component';
import { AddDrugComponent } from './pages/clinical-diary/therapies/add-drug/add-drug.component';
import { DrugsService } from 'app/services/api/ddr';
import { MdePopoverModule } from '@material-extended/mde';
import { AedModule } from 'app/aed-module/aed.module';
import { PaiComponent } from './pages/clinical-diary/pai/pai.component';
import { UnicDiaryService } from 'app/icp-module/services/api/unic-diary.service';
import { DiaryServiceActivityTableComponent } from './pages/clinical-diary/pai/unic-diary/diary-service-activity-table/diary-service-activity-table.component';
import { AdministrationDetailDialogComponent } from './pages/clinical-diary/therapies/therapy-sheet/administration-detail/administration-detail';
import { AdministrationService } from "app/services/api/atm";
import { ApiModule as MeasurementModule } from 'app/services/api/measurementrule';
import { AlertDashboardComponent } from './pages/alert-dashboard/alert-dashboard.component';
import { AlertDetailsComponent } from './pages/alert-dashboard/alert-details-component/alert-details.component';
import {TelevisitComponent} from "./pages/clinical-diary/televisita/televisit.component";
import {TelevisitListComponent} from "./pages/clinical-diary/televisita/televisit-list/televisit-list.component";
import {AltriPartecipantiComponent} from "./pages/clinical-diary/televisita/televisit-list/altri-partecipanti/altri-partecipanti.component";
import {DurataControllerService, TelevisitaControllerService} from "../services/api/mtc";
import { QuesitiDiagnosticiComponent } from './pages/clinical-diary/televisita/televisit-list/quesiti-diagnostici/quesiti-diagnostici.component';
import {
	TelevisitAddComponent
} from "./pages/clinical-diary/televisita/televisit-list/televisit-add/televisit-add.component";
import { RespingiTelevisitaComponent } from './pages/clinical-diary/televisita/televisit-list/respingi-televisita/respingi-televisita.component';
import { DashboardPazienteComponent } from './pages/clinical-diary/dashboard-paziente/dashboard-paziente.component';
import {NestedTableComponent} from "./pages/clinical-diary/nested-table/nested-table.component";
import {TableModalComponent} from "./pages/clinical-diary/table-modal/table-modal.component";
import {ClassicTableComponent} from "./pages/clinical-diary/classic-table/classic-table.component";
import {RadialChartComponent} from "./pages/clinical-diary/radial-chart/radial-chart.component";
import {LineChartComponent} from "./pages/clinical-diary/line-chart/line-chart.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FlexModule} from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {DashboardPazienteControllerService} from "../services/api/msd/api/dashboardPazienteController.service";
import {NgApexchartsModule} from "ng-apexcharts";

@NgModule({
	declarations: [
		ClinicalDiariesComponent,
		ClinicalDiaryComponent,
		PatientComponent,
		CloseMedicalRecordDialogComponent,
		VitalParametersHomeComponent,
		VitalParametersComponent,
		VitalParametersChartComponent,
		AddVitalParameterComponent,
		AlertParametersComponent,
		AddAlertParameterComponent,
		DiaryComponent,
		AddDiaryComponent,
		ExperimentationComponent,
		TherapiesComponent,
		TherapiesListComponent,
		EditTherapyHeaderComponent,
		TherapyComponent,
		TherapySheetComponent,
		AddDrugComponent,
		PaiComponent,
		UnicDiaryComponent,
		DiaryServiceActivityTableComponent,
		EditDiaryServiceActivityComponent,
		AdministrationDetailDialogComponent,
		AlertDashboardComponent,
        AlertDetailsComponent,
		TelevisitComponent,
		TelevisitListComponent,
		TelevisitAddComponent,
		AltriPartecipantiComponent,
		QuesitiDiagnosticiComponent,
RespingiTelevisitaComponent,
DashboardPazienteComponent,
		NestedTableComponent,
		TableModalComponent,
		ClassicTableComponent,
		RadialChartComponent,
		LineChartComponent

	],
	imports: [
		CommonModule,
		OldSharedModule,
		SharedModule,
		MdRoutingModule,
		GridsterModule,
		ComponentsModule,
		CdrApiModule,
		ApiModule,
		MdePopoverModule,
		AedModule,
		PaiModule,
		MEFModule,
		TctModuleModule,
		MeasurementModule,
		MatGridListModule,
		MatMenuModule,
		NgApexchartsModule,
		MatFormFieldModule,
		FlexModule,
		MatTableModule,
		MatSortModule,
	],
	providers: [
		MedicalRecordService,
		VitalParametersService,
		SurveyService,
		OperationService,
		MedicalRecordAlertConfigResourceService,
		ActivityControllerService,
		ExperimentationControllerService,
		TherapyService,
		PathologyService,
		DrugsService,
		UnicDiaryService,
		AdministrationService,
		TelevisitaControllerService,
		DurataControllerService,
		DashboardPazienteControllerService
	],
})
export class MdModule {
	public static getNavigationItems = (): FuseNavigationItem[] => {
		return mdNavigation;
	}
}
