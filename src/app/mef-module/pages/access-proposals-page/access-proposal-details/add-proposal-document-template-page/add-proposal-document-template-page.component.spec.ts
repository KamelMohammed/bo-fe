/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddProposalDocumentTemplatePageComponent } from './add-proposal-document-template-page.component';

describe('AddProposalDocumentTemplatePageComponent', () => {
  let component: AddProposalDocumentTemplatePageComponent;
  let fixture: ComponentFixture<AddProposalDocumentTemplatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProposalDocumentTemplatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProposalDocumentTemplatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
