import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelevisitComponent } from './televisit.component';

describe('TelevisitComponent', () => {
  let component: TelevisitComponent;
  let fixture: ComponentFixture<TelevisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelevisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelevisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
