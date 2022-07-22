import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicTableComponent } from './classic-table.component';

describe('ClassicTableComponent', () => {
  let component: ClassicTableComponent;
  let fixture: ComponentFixture<ClassicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassicTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
