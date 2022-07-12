import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFilterComponent implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() filter?: FormControl;
  @Input() displayedColumnsPlaceHolder?: { [key: string]: string };
  @Output() selectedColumnEvent = new EventEmitter<string>();
  @Output() filterClearedEvent = new EventEmitter<void>();

  selectedColumn?: string;

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit() {
    if (this.displayedColumns.length === 1) {
      this.selectedColumn = this.displayedColumns[0];
      this.filter.patchValue('');
      this.selectedColumnEvent.emit(this.selectedColumn);
    }
  }

  getDisplayedColumns() {
    return this.displayedColumns.slice().filter(() => this.selectedColumn === undefined);
  }

  getPlaceHolder() {
    return this.displayedColumnsPlaceHolder && this.displayedColumnsPlaceHolder[this.selectedColumn]
      ? this.translateService.instant(this.displayedColumnsPlaceHolder[this.selectedColumn])
      : '';
  }

  clearFilter() {
    this.selectedColumn = undefined;
    this.filter.patchValue('');
    this.filterClearedEvent.emit();
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.selectedColumn = event.option.value;
    this.filter.patchValue('');
    this.selectedColumnEvent.emit(this.selectedColumn);
  }

  getSelectedColumnDescription() {
    return this.translateService.instant(this.selectedColumn);
  }

  getColumnDescription(column: string) {
    return this.translateService.instant(column);
  }
}
