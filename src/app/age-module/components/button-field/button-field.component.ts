import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Field } from '../components.model';

@Component({
  selector: 'app-button-field',
  templateUrl: './button-field.component.html',
  styleUrls: ['./button-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonFieldComponent implements OnInit {
  @Input() field?: Field;

  constructor() { }

  ngOnInit(): void {
  }
}
