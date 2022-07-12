import { NgModule } from '@angular/core';
import { SharedModule } from 'infrastructure/fidcare/modules/shared.module';
import { EmptyLayoutModule } from 'infrastructure/layout/layouts/empty/empty.module';
import { ClassicLayoutModule } from 'infrastructure/layout/layouts/vertical/classic/classic.module';
import { LayoutComponent } from './layout.component';

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports: [
        SharedModule,
        EmptyLayoutModule,
        ClassicLayoutModule
    ],
    exports: [
        LayoutComponent,
        EmptyLayoutModule,
        ClassicLayoutModule
    ]
})
export class LayoutModule {
}
