import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskOpenedComponent } from './modal-task-opened.component';

describe('ModalTaskOpenedComponent', () => {
  let component: ModalTaskOpenedComponent;
  let fixture: ComponentFixture<ModalTaskOpenedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTaskOpenedComponent]
    });
    fixture = TestBed.createComponent(ModalTaskOpenedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
