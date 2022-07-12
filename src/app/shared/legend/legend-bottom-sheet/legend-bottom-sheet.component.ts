import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';

import { Legend } from '../../models/legend.model';
import { LegendComponent } from '../legend.component';

@Component({
  selector: 'app-legend-bottom-sheet',
  templateUrl: './legend-bottom-sheet.component.html',
  styleUrls: ['./legend-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendBottomSheetComponent {
  @Input() legends?: Legend[];

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    private readonly translateService: TranslateService
  ) { }

  openBottomSheet() {
    this.bottomSheet.open(LegendComponent, { data: this.legends, panelClass: 'legend-dialog' });
  }

  getLabel() {
    return this.translateService.instant('LEGEND');
  }
}
