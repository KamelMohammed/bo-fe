import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ClassicLayoutComponent } from './classic.component';
import { FuseLoadingBarModule } from 'infrastructure/@fuse/components/loading-bar/loading-bar.module';
import { FuseNavigationModule } from 'infrastructure/@fuse/components/navigation/navigation.module';
import { ShortcutsModule } from 'infrastructure/layout/common/shortcuts/shortcuts.module';
import { UserModule } from 'infrastructure/layout/common/user/user.module';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { FuseFullscreenModule } from 'infrastructure/@fuse/components/fullscreen/fullscreen.module';

@NgModule({
    declarations: [
        ClassicLayoutComponent
    ],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseNavigationModule,
        FuseLoadingBarModule,
        FuseFullscreenModule,
        ShortcutsModule,
        UserModule,
        SharedModule
    ],
    exports: [
        ClassicLayoutComponent
    ]
})
export class ClassicLayoutModule {
}
