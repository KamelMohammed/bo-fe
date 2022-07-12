import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { FuseLoadingBarModule } from 'infrastructure/@fuse/components/loading-bar/loading-bar.module';
import { EmptyLayoutComponent } from './empty.component';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports: [
        RouterModule,
        SharedModule,
        FuseLoadingBarModule
    ],
    exports: [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule {
}
