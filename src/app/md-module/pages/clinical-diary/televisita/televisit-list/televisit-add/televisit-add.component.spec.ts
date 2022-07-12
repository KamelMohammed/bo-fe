import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelevisitAddComponent } from './televisit-add.component';

describe('TelevisitAddComponent', () => {
  let component: TelevisitAddComponent;
  let fixture: ComponentFixture<TelevisitAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelevisitAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelevisitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
