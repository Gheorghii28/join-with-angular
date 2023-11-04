import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLegalnoticeComponent } from './modal-legalnotice.component';

describe('ModalLegalnoticeComponent', () => {
  let component: ModalLegalnoticeComponent;
  let fixture: ComponentFixture<ModalLegalnoticeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLegalnoticeComponent]
    });
    fixture = TestBed.createComponent(ModalLegalnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
