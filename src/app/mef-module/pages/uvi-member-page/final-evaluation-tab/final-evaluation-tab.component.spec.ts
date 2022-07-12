/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinalEvaluationTabComponent } from './final-evaluation-tab.component';

describe('FinalEvaluationTabComponent', () => {
  let component: FinalEvaluationTabComponent;
  let fixture: ComponentFixture<FinalEvaluationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalEvaluationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalEvaluationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
