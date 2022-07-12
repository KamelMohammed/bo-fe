import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Action } from './actions.model';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent implements OnInit {
  @Input() actions?: Action[];
  @Input() showMatMenu = false;
  @Input() index = 0;
  firstAction?: Action;
  actionList?: Action[];

  constructor(
    private readonly translateService: TranslateService
  ) { }

  ngOnInit() {
    if (this.showMatMenu === undefined) {
      this.showMatMenu = false;
    }
    if (this.actions && this.actions.length && this.showMatMenu) {
      this.firstAction = this.actions[0];
      this.actionList = this.actions.slice().filter(a => a.name !== this.firstAction.name);
    }
  }

  getLabel(key: string) {
    return this.translateService.instant(key);
  }

  trackByMethod(index: number): number {
    return index;
  }
}
