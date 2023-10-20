import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskFormComponent } from './modal-task-form.component';

describe('ModalTaskFormComponent', () => {
  let component: ModalTaskFormComponent;
  let fixture: ComponentFixture<ModalTaskFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTaskFormComponent]
    });
    fixture = TestBed.createComponent(ModalTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
