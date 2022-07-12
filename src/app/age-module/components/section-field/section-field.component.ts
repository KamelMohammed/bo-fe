import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Field, Position } from '../components.model';

@Component({
  selector: 'app-section-field',
  templateUrl: './section-field.component.html',
  styleUrls: ['./section-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionFieldComponent implements OnInit {
  @Input() field?: Field;

  constructor() { }

  ngOnInit(): void {

  }

  getClass(position?: Position) {
    if (position) {
      switch (position) {
        case Position.CENTER:
          return 'text-center';
        case Position.RIGHT:
          return 'text-right';
        default:
          return 'text-left';
      }
    }

    return 'text-left';
  }

}
