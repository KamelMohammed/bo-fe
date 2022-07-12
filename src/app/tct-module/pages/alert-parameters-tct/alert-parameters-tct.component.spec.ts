/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlertParametersTctComponent } from './alert-parameters-tct.component';

describe('AlertParametersTctComponent', () => {
  let component: AlertParametersTctComponent;
  let fixture: ComponentFixture<AlertParametersTctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertParametersTctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertParametersTctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
