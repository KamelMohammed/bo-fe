import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelevisitListComponent } from './televisit-list.component';

describe('TelevisitListComponent', () => {
  let component: TelevisitListComponent;
  let fixture: ComponentFixture<TelevisitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelevisitListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelevisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
