import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrivacypolicyComponent } from './modal-privacypolicy.component';

describe('ModalPrivacypolicyComponent', () => {
  let component: ModalPrivacypolicyComponent;
  let fixture: ComponentFixture<ModalPrivacypolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPrivacypolicyComponent]
    });
    fixture = TestBed.createComponent(ModalPrivacypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
