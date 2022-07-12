import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IcpRoutingSelectorComponent } from './icp-routing-selector.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: IcpRoutingSelectorComponent},
  { path: 'configuration', loadChildren: () => import('./pages/configuration/icp-configuration.module').then(m => m.CMPConfigurationModule) },
  { path: 'pas', loadChildren:() => import('./pages/pas-module/pas-module.module').then(m=>m.PasModuleModule)},
  {path: 'pai', loadChildren:()=> import('./pages/pai/pai.module').then(m=>m.PaiModule)},
  {path: 'sessions', loadChildren:()=> import('./pages/session/session.module').then(m=>m.SessionModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class CMPRoutingModule {

}
