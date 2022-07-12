import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesitiDiagnosticiComponent } from './quesiti-diagnostici.component';

describe('QuesitiDiagnosticiComponent', () => {
  let component: QuesitiDiagnosticiComponent;
  let fixture: ComponentFixture<QuesitiDiagnosticiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuesitiDiagnosticiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuesitiDiagnosticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
