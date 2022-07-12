/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VitalParametersChartTctComponent } from './vital-parameters-chart-tct.component';

describe('VitalParametersChartTctComponent', () => {
  let component: VitalParametersChartTctComponent;
  let fixture: ComponentFixture<VitalParametersChartTctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalParametersChartTctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalParametersChartTctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
