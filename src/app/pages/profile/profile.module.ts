import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { ChangePasswordComponent } from './change-password.component';
import { EditProfileComponent } from './edit-profile.component';
import { ProfilePage } from './profile.page';



const routes: Route[] = [
    { path: '', component: ProfilePage }
];

@NgModule({
    declarations: [
        ProfilePage,
        EditProfileComponent,
        ChangePasswordComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ProfileModule {
}
