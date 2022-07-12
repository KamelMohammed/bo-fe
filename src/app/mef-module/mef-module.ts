import { FinalEvaluationTabComponent } from './pages/uvi-member-page/final-evaluation-tab/final-evaluation-tab.component';
import { UviGroupTabComponent } from './pages/uvi-member-page/uvi-group-tab/uvi-group-tab.component';
import { AddProposalDocumentTemplatePageComponent } from './pages/access-proposals-page/access-proposal-details/add-proposal-document-template-page/add-proposal-document-template-page.component';
import { UviMemberPageComponent } from './pages/uvi-member-page/uvi-member-page.component';
import { ActivityLogPageComponent } from './pages/access-proposals-page/list-access-proposals-page/activity-log-page/activity-log-page.component';
import { EditAccessProposalPageComponent } from './pages/access-proposals-page/access-proposal-details/edit-access-proposal-page.component';
import { ListAccessProposalsPageComponent } from './pages/access-proposals-page/list-access-proposals-page/list-access-proposals-page.component';
import { AccessProposalsPageComponent } from './pages/access-proposals-page/access-proposals-page.component';
import { PipesAndDirectiveModule } from '../../infrastructure/fidcare/modules/pipes-directives.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { FuseNavigationItem } from 'infrastructure/@fuse/components/navigation/navigation.types';
import { DocumentsListPageComponent } from './pages/documents-configuration/documents-list-page.component';
import { mefNavigation } from './mef-navigation';
import { MEFRoutingModel } from './mef-routing.module';
import { UploadFileDialogComponent } from './pages/documents-configuration/upload-file-dialog/upload-file-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { MefRoutingSelectorComponent } from './mef-routing-selector.component';
import { EvaluationsFormsPageComponent } from './pages/evaluations-forms-page/evaluations-forms-page.component';
import { FilteredDocumentsListPageComponent } from './pages/documents-configuration/filtered-documents-list/filtered-documents-list.component';
import { DoctorChoiceDialog } from './pages/uvi-member-page/elect-case-manager-page/doctor-choice-dialog.component';


@NgModule({
	declarations: [
		DocumentsListPageComponent,
		UploadFileDialogComponent,
		AccessProposalsPageComponent,
		ListAccessProposalsPageComponent,
		ActivityLogPageComponent,
		EvaluationsFormsPageComponent,
		UviMemberPageComponent,
		AddProposalDocumentTemplatePageComponent,
		UviGroupTabComponent,
		FinalEvaluationTabComponent,
		EditAccessProposalPageComponent,
		MefRoutingSelectorComponent,
		FilteredDocumentsListPageComponent,
		DoctorChoiceDialog
	],
	imports: [
		CommonModule,
		SharedModule,
		TranslateModule,
		PipesAndDirectiveModule,
		MEFRoutingModel,
		MatTabsModule,
		MatCheckboxModule
		
	],
	providers: [
	],
	exports:[
		DocumentsListPageComponent,
		UploadFileDialogComponent,
		AccessProposalsPageComponent,
		ListAccessProposalsPageComponent,
		ActivityLogPageComponent,
		EvaluationsFormsPageComponent,
		UviMemberPageComponent,
		AddProposalDocumentTemplatePageComponent,
		UviGroupTabComponent,
		FinalEvaluationTabComponent,
		EditAccessProposalPageComponent,
		FilteredDocumentsListPageComponent,
		DoctorChoiceDialog
	]
})
export class MEFModule {
	public static getNavigationItems = (): FuseNavigationItem[] => {
		return mefNavigation;
	}
}
