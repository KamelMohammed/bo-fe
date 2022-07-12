import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltriPartecipantiComponent } from './altri-partecipanti.component';

describe('AltriPartecipantiComponent', () => {
  let component: AltriPartecipantiComponent;
  let fixture: ComponentFixture<AltriPartecipantiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltriPartecipantiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltriPartecipantiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
