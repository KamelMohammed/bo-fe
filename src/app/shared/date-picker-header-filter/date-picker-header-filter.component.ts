import { Component } from '@angular/core';

import { DatePickerHeaderFilterService } from './date-picker-header-filter.service';

@Component({
  selector: 'app-date-filter-header',
  template: `
      <mat-calendar-header #header>
        <button mat-button type="button" (click)="reset()">Deseleziona</button>
      </mat-calendar-header>`
})
export class DatePickerHeaderFilterComponent<D> {

  constructor(private datePickerHeaderFilterService: DatePickerHeaderFilterService) { }

  reset() {
    this.datePickerHeaderFilterService.reset$.next(null);
  }
}
