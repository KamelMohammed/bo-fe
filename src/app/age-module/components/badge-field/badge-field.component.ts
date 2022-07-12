import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Field } from '../components.model';

@Component({
  selector: 'app-badge-field',
  templateUrl: './badge-field.component.html',
  styleUrls: ['./badge-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeFieldComponent implements OnInit, OnChanges {
  @Input() field?: Field;
  title?: string;
  titleColor?: string;
  description1?: string;
  descriptionColor1?: string;
  description2?: string;
  descriptionColor2?: string;
  description3?: string;
  descriptionColor3?: string;
  backgroundColor?: string;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.field && this.field) {
      if (this.field.badge) {
        if (this.field.badge.title) {
          this.title = this.field.badge.title.value;
          this.titleColor = this.field.badge.title.color || 'black';
        }
        if (this.field.badge.description1) {
          this.description1 = this.field.badge.description1.value;
          this.descriptionColor1 = this.field.badge.description1.color || 'black';
        }
        if (this.field.badge.description2) {
          this.description2 = this.field.badge.description2.value;
          this.descriptionColor2 = this.field.badge.description2.color || 'black';
        }
        if (this.field.badge.description3) {
          this.description3 = this.field.badge.description3.value;
          this.descriptionColor3 = this.field.badge.description3.color || 'black';
        }
        this.backgroundColor = this.field.badge.backgroundColor || 'white';
      }
    }
  }
}
