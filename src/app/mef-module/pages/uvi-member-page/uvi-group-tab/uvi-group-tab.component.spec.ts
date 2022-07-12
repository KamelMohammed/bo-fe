/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UviGroupTabComponent } from './uvi-group-tab.component';

describe('UviGroupTabComponent', () => {
  let component: UviGroupTabComponent;
  let fixture: ComponentFixture<UviGroupTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UviGroupTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UviGroupTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
