import { ModuleWithProviders, NgModule } from '@angular/core';
import { BaseComponent } from '../components/common/base.component';
import { DataTableCellTemplateComponent, DataTableIconCellTemplateComponent, DataTableIconNoPropertyCellTemplateComponent, DataTableBooleanCellTemplateComponent, DataTableClickCellTemplateComponent, DataTableCurrencyCellTemplateComponent, DataTableDateCellTemplateComponent, DataTableDateTimeCellTemplateComponent, DataTableEnumCellTemplateComponent, DataTableIntCellTemplateComponent, DataTableNumberCellTemplateComponent, DataTableStringCellTemplateComponent, DataTableTimeCellTemplateComponent, DataTableArrayCellTemplateComponent } from '../components/data-table/data-table-cell-template.component';
import { DataTableComponent } from '../components/data-table/data-table.component';
import { ListTableComponent } from '../components/data-table/list-table.component';
import { AutocompleteComponent } from '../components/forms/autocomplete.component';
import { InputDateComponent } from '../components/forms/input-date.component';
import { InputDateTimeComponent } from '../components/forms/input-datetime.component';
import { InputDecimalComponent } from '../components/forms/input-decimal.component';
import { InputErrorComponent } from '../components/forms/input-error.component';
import { InputFileComponent } from '../components/forms/input-file.component';
import { InputFilesComponent } from '../components/forms/input-files.component';
import { InputIntComponent } from '../components/forms/input-int.component';
import { InputPasswordComponent } from '../components/forms/input-password.component';
import { InputSlideComponent } from '../components/forms/input-slide.component';
import { InputStringComponent } from '../components/forms/input-string.component';
import { InputTimeComponent } from '../components/forms/input-time.component';
import { SelectBoxComponent } from '../components/forms/select-box.component';
import { TagDateComponent } from '../components/forms/tag-date.component';
import { TagDateTimeComponent } from '../components/forms/tag-datetime.component';
import { TagDecimalComponent } from '../components/forms/tag-decimal.component';
import { TagIntComponent } from '../components/forms/tag-int.component';
import { TagStringComponent } from '../components/forms/tag-string.component';
import { TagTimeComponent } from '../components/forms/tag-time.component';
import { TablePageComponent } from '../components/pages/table-page.component';
import { ErrorsDialogComponent } from '../components/forms/errors-dialog.component';
import { TagTimeItemComponent } from '../components/forms/tag-time-item.component';
import { TagDateTimeItemComponent } from '../components/forms/tag-datetime-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { PipesAndDirectiveModule } from './pipes-directives.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageContentComponent } from '../components/pages/page-content.component';
import { FORM_COMPONENTS_TOKEN, IFormComponents } from '../components/forms/forms';
import { ChipsComponent } from '../components/common/chips.component';
import { FieldViewerComponent } from '../components/common/field-viewer.component';
import { ConfirmDialogComponent } from '../components/common/confirm-dialog.component';
import { FilterBarComponent } from '../components/common/filter-bar.component';
import { SpinnerComponent } from '../components/common/spinner.component';
import { UploadFileComponent } from '../components/common/upload-file.component';
import { FuseScrollbarModule } from 'infrastructure/@fuse/directives/scrollbar/scrollbar.module';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { CardItemTableDirective } from '../components/data-table/card-item-table.directive';
import { ExtendedFilterBar } from '../components/common/extended-filter-bar.component';
import { CardActionsComponent } from '../components/common/card-actions.component';
import { AddButtonComponent } from '../components/common/add-button.component';
import { MessageDialogComponent } from '../components/common/message-dialog.component';
import { AutocompleteMultiComponent } from '../components/forms/autocomplete-multi.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRcodeScannerComponent } from '../components/common/qrcode-scanner.component';
import { ModalQRcodeScannerComponent } from '../components/common/modal-qrcode-scanner.component';
import { MapPreviewComponent } from '../components/geo/map-preview/map-preview.component';


@NgModule({
	declarations: [
		AutocompleteComponent,
		AutocompleteMultiComponent,
		BaseComponent,
		ChipsComponent,
		ConfirmDialogComponent,
		MessageDialogComponent,
		FilterBarComponent,
		SpinnerComponent,
		UploadFileComponent,
		DataTableStringCellTemplateComponent,
		DataTableDateCellTemplateComponent,
		DataTableDateTimeCellTemplateComponent,
		DataTableTimeCellTemplateComponent,
		DataTableBooleanCellTemplateComponent,
		DataTableIntCellTemplateComponent,
		DataTableNumberCellTemplateComponent,
		DataTableCurrencyCellTemplateComponent,
		DataTableEnumCellTemplateComponent,
		DataTableClickCellTemplateComponent,
		DataTableIconCellTemplateComponent,
		DataTableIconNoPropertyCellTemplateComponent,
		DataTableArrayCellTemplateComponent,
		DataTableCellTemplateComponent,
		DataTableComponent,
		ErrorsDialogComponent,
		FieldViewerComponent,
		InputDateComponent,
		InputDateTimeComponent,
		InputDecimalComponent,
		InputErrorComponent,
		InputFileComponent,
		InputFilesComponent,
		InputIntComponent,
		InputPasswordComponent,
		InputSlideComponent,
		InputStringComponent,
		InputTimeComponent,
		ListTableComponent,
		NotificationsComponent,
		PageContentComponent,
		SelectBoxComponent,
		TablePageComponent,
		TagDateComponent,
		TagDateTimeComponent,
		TagDateTimeItemComponent,
		TagDecimalComponent,
		TagIntComponent,
		TagStringComponent,
		TagTimeComponent,
		TagTimeItemComponent,
		CardItemTableDirective,
		ExtendedFilterBar,
		CardActionsComponent,
		AddButtonComponent,
		QRcodeScannerComponent,
		ModalQRcodeScannerComponent,
		MapPreviewComponent
	],
	imports: [
		PipesAndDirectiveModule,
		CommonModule,
		FormsModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatCardModule,
		MatDatepickerModule,
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatMomentDateModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatSortModule,
		MatTableModule,
		ReactiveFormsModule,
		TranslateModule,
		MatChipsModule,
		MatTooltipModule,
		FuseScrollbarModule,
		ZXingScannerModule
	],
	exports: [
		AutocompleteComponent,
		AutocompleteMultiComponent,
		BaseComponent,
		ChipsComponent,
		ConfirmDialogComponent,
		MessageDialogComponent,
		FilterBarComponent,
		SpinnerComponent,
		UploadFileComponent,
		DataTableStringCellTemplateComponent,
		DataTableDateCellTemplateComponent,
		DataTableDateTimeCellTemplateComponent,
		DataTableTimeCellTemplateComponent,
		DataTableBooleanCellTemplateComponent,
		DataTableIntCellTemplateComponent,
		DataTableNumberCellTemplateComponent,
		DataTableCurrencyCellTemplateComponent,
		DataTableEnumCellTemplateComponent,
		DataTableClickCellTemplateComponent,
		DataTableIconCellTemplateComponent,
		DataTableIconNoPropertyCellTemplateComponent,
		DataTableArrayCellTemplateComponent,
		DataTableCellTemplateComponent,
		DataTableComponent,
		ErrorsDialogComponent,
		FieldViewerComponent,
		InputDateComponent,
		InputDateTimeComponent,
		InputDecimalComponent,
		InputErrorComponent,
		InputFileComponent,
		InputFilesComponent,
		InputIntComponent,
		InputPasswordComponent,
		InputSlideComponent,
		InputStringComponent,
		InputTimeComponent,
		ListTableComponent,
		NotificationsComponent,
		PageContentComponent,
		SelectBoxComponent,
		TablePageComponent,
		TagDateComponent,
		TagDateTimeComponent,
		TagDateTimeItemComponent,
		TagDecimalComponent,
		TagIntComponent,
		TagStringComponent,
		TagTimeComponent,
		TagTimeItemComponent,
		CardItemTableDirective,
		ExtendedFilterBar,
		CardActionsComponent,
		AddButtonComponent,
		QRcodeScannerComponent,
		ModalQRcodeScannerComponent,
		MapPreviewComponent
	],
	providers: []
})
export class ComponentsModule {
	static forRoot(formComponents: IFormComponents): ModuleWithProviders<ComponentsModule> {
		return {
			ngModule: ComponentsModule,
			providers: [
				{ provide: FORM_COMPONENTS_TOKEN, useValue: formComponents }
			]
		};
	}
}
