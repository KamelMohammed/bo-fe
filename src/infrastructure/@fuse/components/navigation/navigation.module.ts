import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseScrollbarModule } from 'infrastructure/@fuse/directives/scrollbar/scrollbar.module';
import { FuseVerticalNavigationAsideItemComponent } from './vertical/components/aside/aside.component';
import { FuseVerticalNavigationBasicItemComponent } from './vertical/components/basic/basic.component';
import { FuseVerticalNavigationCollapsableItemComponent } from './vertical/components/collapsable/collapsable.component';
import { FuseVerticalNavigationDividerItemComponent } from './vertical/components/divider/divider.component';
import { FuseVerticalNavigationGroupItemComponent } from './vertical/components/group/group.component';
import { FuseVerticalNavigationSpacerItemComponent } from './vertical/components/spacer/spacer.component';
import { FuseVerticalNavigationComponent } from './vertical/vertical.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        FuseVerticalNavigationAsideItemComponent,
        FuseVerticalNavigationBasicItemComponent,
        FuseVerticalNavigationCollapsableItemComponent,
        FuseVerticalNavigationDividerItemComponent,
        FuseVerticalNavigationGroupItemComponent,
        FuseVerticalNavigationSpacerItemComponent,
        FuseVerticalNavigationComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        FuseScrollbarModule,
        TranslateModule
    ],
    exports: [
        FuseVerticalNavigationComponent
    ]
})
export class FuseNavigationModule {
}
