import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespingiTelevisitaComponent } from './respingi-televisita.component';

describe('RespingiTelevisitaComponent', () => {
  let component: RespingiTelevisitaComponent;
  let fixture: ComponentFixture<RespingiTelevisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespingiTelevisitaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespingiTelevisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
