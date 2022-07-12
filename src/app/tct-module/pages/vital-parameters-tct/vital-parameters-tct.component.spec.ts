/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VitalParametersTctComponent } from './vital-parameters-tct.component';

describe('VitalParametersTctComponent', () => {
  let component: VitalParametersTctComponent;
  let fixture: ComponentFixture<VitalParametersTctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalParametersTctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalParametersTctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
