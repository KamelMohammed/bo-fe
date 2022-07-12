import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';

import { LegendExtended } from '../models/legend.model';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent {

  constructor(
    private readonly translateService: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public legends: LegendExtended[]
  ) { }

  getLabel(key: string) {
    return this.translateService.instant(key);
  }
}
