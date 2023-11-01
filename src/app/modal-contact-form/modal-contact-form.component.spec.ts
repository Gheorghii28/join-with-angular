import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContactFormComponent } from './modal-contact-form.component';

describe('ModalContactFormComponent', () => {
  let component: ModalContactFormComponent;
  let fixture: ComponentFixture<ModalContactFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalContactFormComponent]
    });
    fixture = TestBed.createComponent(ModalContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
