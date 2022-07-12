import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesAndDirectiveModule } from 'infrastructure/fidcare/modules/pipes-directives.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ComponentsModule } from 'infrastructure/fidcare/modules/components.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { CloseScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { SnackBarService } from 'infrastructure/fidcare/services/snackbar.service';
import { DialogService } from 'infrastructure/fidcare/services/dialog.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FuseScrollbarModule } from 'infrastructure/@fuse/directives/scrollbar/scrollbar.module';


export function scrollFactory(overlay: Overlay): () => CloseScrollStrategy {
	return () => overlay.scrollStrategies.close();
}
@NgModule({
	imports: [
		PipesAndDirectiveModule,
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatChipsModule,
		ComponentsModule,
		MatDialogModule,
		MatExpansionModule,
		MatIconModule,
		MatListModule,
		MatSnackBarModule,
		MatTabsModule,
		ReactiveFormsModule,
		RouterModule,
		TranslateModule,
		MatTooltipModule,


	],
	exports: [
		PipesAndDirectiveModule,
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatChipsModule,
		ComponentsModule,
		MatDialogModule,
		MatDatepickerModule,
		FuseScrollbarModule,
		MatExpansionModule,
		MatIconModule,
		MatListModule,
		MatSnackBarModule,
		MatTabsModule,
		ReactiveFormsModule,
		RouterModule,
		TranslateModule,
		MatTooltipModule
	],
	providers: [
		{ provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
		{ provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
		{ provide: DialogService, useClass: DialogService },
		{ provide: SnackBarService, useClass: SnackBarService, }


	]
})
export class SharedModule {
}
