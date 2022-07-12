import { NgModule } from '@angular/core';
import { NumberPipe } from '../pipes/number.pipe';
import { IntDirective } from '../directives/int.directive';
import { DecimalDirective } from '../directives/decimal.directive';
import { DatePipe, DateTimePipe, FullDatePipe, SmallTimePipe, TimePipe } from '../pipes/date.pipe';
import { EnumPipe } from '../pipes/enum.pipe';
import { DisableFormControlDirective } from '../directives/disable-form-control.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { SecureClickDirective } from '../directives/secure-click.directive';
import { GoBackDirective } from '../directives/go-back.directive';
import { DataTableCellTemplateDirective } from '../directives/data-table-cell-template.directive';
import { DisableByRolesDirective } from '../directives/disable-by-roles.directive';

@NgModule({
    declarations: [
        DecimalDirective,
        DisableByRolesDirective,
        DisableFormControlDirective,
        IntDirective,
        SecureClickDirective,
        DateTimePipe,
        DatePipe,
        FullDatePipe,
        EnumPipe,
        NumberPipe,
        TimePipe,
        SmallTimePipe,
        GoBackDirective,
        DataTableCellTemplateDirective
    ],
    imports: [
        ReactiveFormsModule
    ],
    exports: [
        DecimalDirective,
        DisableByRolesDirective,
        DisableFormControlDirective,
        IntDirective,
        SecureClickDirective,
        DateTimePipe,
        DatePipe,
        FullDatePipe,
        EnumPipe,
        NumberPipe,
        TimePipe,
        SmallTimePipe,
        GoBackDirective,
        DataTableCellTemplateDirective
    ],
    providers: []
})
export class PipesAndDirectiveModule { }
