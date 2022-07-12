import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MefRoutingSelectorComponent } from './mef-routing-selector.component';
import { AccessProposalsPageComponent } from './pages/access-proposals-page/access-proposals-page.component';
import { DocumentsListPageComponent } from './pages/documents-configuration/documents-list-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MefRoutingSelectorComponent},
  { path: 'document-list', component: DocumentsListPageComponent},
  { path: 'accessProposals', component: AccessProposalsPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class MEFRoutingModel {

}
