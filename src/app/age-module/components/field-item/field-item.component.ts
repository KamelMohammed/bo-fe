import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field, FieldType } from '../components.model';

@Component({
  selector: 'app-field-item',
  templateUrl: './field-item.component.html',
  styleUrls: ['./field-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldItemComponent implements OnInit {
  FieldType = FieldType;
  @Input() field?: Field;
  @Input() form?: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
