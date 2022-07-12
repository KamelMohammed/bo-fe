import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVitalParameterComponent } from './add-vital-parameter.component';

describe('AddVitalParameterComponent', () => {
  let component: AddVitalParameterComponent;
  let fixture: ComponentFixture<AddVitalParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVitalParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVitalParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
