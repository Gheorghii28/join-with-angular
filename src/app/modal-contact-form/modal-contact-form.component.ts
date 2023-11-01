import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-contact-form',
  templateUrl: './modal-contact-form.component.html',
  styleUrls: ['./modal-contact-form.component.scss']
})
export class ModalContactFormComponent {
  nameWarningText: any;
  emailWarningText: any;
  phoneWarningText: any;
  isNameInvalid: any;
  isEmailInvalid: any;
  isPhoneInvalid: any;

  nameInfo: any;
  emailInfo: any;
  phoneInfo: any;
  formGroup: any = {
    nameField: ['', [Validators.required]],
    emailField: ['', [Validators.required]],
    phoneField: ['', [Validators.required]]
  }
  formGroupEditedContact: any = this.getFormGroupEditedContact();
  contactFormular: FormGroup = new FormGroup({});

  @ViewChild('nameField') nameFieldRef!: ElementRef;
  @ViewChild('emailField') emailFieldRef!: ElementRef;
  @ViewChild('phoneField') phoneFieldRef!: ElementRef;

  constructor(
    public modalControls: ModalsControls,
    private formBuilder: FormBuilder
  ) {

  }

  ngAfterViewInit() {
    this.initializeFields();
  }

  ngOnInit(): void {
    this.getFormGroupEditedContact();
    this.createForm();
  }

  initializeFields() {
    this.nameInfo = this.nameFieldRef.nativeElement;
    this.emailInfo = this.emailFieldRef.nativeElement;
    this.phoneInfo = this.phoneFieldRef.nativeElement;
  }

  createForm() {
    if(this.modalControls.isContactEdit) {
      this.contactFormular = this.formBuilder.group(this.formGroupEditedContact);
    } else {
      this.contactFormular = this.formBuilder.group(this.formGroup);
    }
  }

  submitForm() {
    if(this.modalControls.isContactEdit) {
      this.editContact();
    } else {
      this.addContact();
    }
  }

  getFormGroupEditedContact() {
    if (this.modalControls.displayedContact) {
      return {
        nameField: [this.modalControls.displayedContact.name, [Validators.required]],
        emailField: [this.modalControls.displayedContact.email, [Validators.required]],
        phoneField: [this.modalControls.displayedContact.phone, [Validators.required]]
      }
    } else {
      return '';
    }
  }

  editContact() {

  }

  addContact() {
    
  }

  deleteContact() {

  }

  clearForm() {

  }
}
