import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Field, Position } from '../field.model';

@Component({
  selector: 'app-static-text-field',
  templateUrl: './static-text-field.component.html',
  styleUrls: ['./static-text-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaticTextFieldComponent implements OnInit {
  @Input() field?: Field;

  constructor() { }

  ngOnInit(): void {
  }

  getFxLayout(position?: Position) {
    if (position) {
      switch (position) {
        case Position.UP:
          return 'column';
        case Position.RIGHT:
          return 'row-reverse';
        case Position.DOWN:
          return 'column-reverse';
        default:
          return 'row';
      }
    }

    return 'row';
  }
}
