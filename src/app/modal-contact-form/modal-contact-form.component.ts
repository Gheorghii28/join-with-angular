import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalsControls } from '../services/modal-controls/modals.controls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataServices } from '../services/data-services/data.services';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { updateDoc } from '@firebase/firestore';
import { Contact, User } from '../interfaces/user.interface';
import { onSnapshot } from '@angular/fire/firestore';
import { ValidationService } from '../services/validation/validation.service';

@Component({
  selector: 'app-modal-contact-form',
  templateUrl: './modal-contact-form.component.html',
  styleUrls: ['./modal-contact-form.component.scss']
})
export class ModalContactFormComponent {

  user!: User;
  userId: any;

  nameWarningText: any;
  emailWarningText: any;
  phoneWarningText: any;
  isNameInvalid: boolean = false;
  isEmailInvalid: boolean = false;
  isPhoneInvalid: boolean = false;

  nameInfo: any = {
    field: undefined,
    warningText: '',
    isInvalid: false
  };
  emailInfo: any = {
    field: undefined,
    warningText: '',
    isInvalid: false
  };
  phoneInfo: any = {
    field: undefined,
    warningText: '',
    isInvalid: false
  };
  formGroup: any = {
    nameField: ['', [Validators.required]],
    emailField: ['', [Validators.required]],
    phoneField: ['', [Validators.required]]
  }
  formGroupEditedContact: any = this.getFormGroupEditedContact();
  contactFormular: FormGroup = new FormGroup({});
  isFormValid: boolean = true;

  unsubUser;

  @ViewChild('nameField') nameFieldRef!: ElementRef;
  @ViewChild('emailField') emailFieldRef!: ElementRef;
  @ViewChild('phoneField') phoneFieldRef!: ElementRef;

  constructor(
    public modalControls: ModalsControls,
    private formBuilder: FormBuilder,
    private dataService: DataServices,
    private userListService: UsersListServices,
    public validation: ValidationService
  ) {
    const storedValue = localStorage.getItem('id-key');
    this.userId = storedValue ? JSON.parse(storedValue) : null;
    this.unsubUser = this.subUserList();
  }

  ngAfterViewInit() {
    this.initializeFields();
  }

  ngOnInit(): void {
    this.getFormGroupEditedContact();
    this.createForm();
  }

  ngOnDestroy() {
    this.unsubUser();
  }

  subUserList() {
    return onSnapshot(this.userListService.getUserDocRef('users', this.userId), (list: any) => {
      this.user = list.data();
    })
  }

  initializeFields() {
    this.nameInfo.field = this.nameFieldRef.nativeElement;
    this.emailInfo.field = this.emailFieldRef.nativeElement;
    this.phoneInfo.field = this.phoneFieldRef.nativeElement;
  }

  createForm() {
    if (this.modalControls.isContactEdit) {
      this.contactFormular = this.formBuilder.group(this.formGroupEditedContact);
    } else {
      this.contactFormular = this.formBuilder.group(this.formGroup);
    }
  }

  submitForm() {
    if (this.checkContactFields()) {
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

  getCreatedNewContact() {
    return {
      id: new Date().getTime(),
      isChecked: false,
      name: this.contactFormular.controls['nameField'].value,
      email: this.contactFormular.controls['emailField'].value,
      phone: this.contactFormular.controls['phoneField'].value,
      color: this.dataService.getRandomRGBColor(),
      initials: this.dataService.getInitials(this.contactFormular.controls['nameField'].value)
    };
  }

  getUpdatedContacts(contact: Contact) {
    let contactsUpdated: any = [];
    this.user.contacts.forEach((contact: any) => {
      if (this.modalControls.displayedContact) {
        if (contact.id !== this.modalControls.displayedContact.id) {
          contactsUpdated.push(contact);
        }
      } else {
        contactsUpdated.push(contact);
      }
    });
    contactsUpdated.push(contact);
    return contactsUpdated;
  }

  showErrorMessageBox(message: any) {
    console.log(message);
  }

  checkContactFields() {
    this.isFormValid = true;
    this.checkField(this.nameInfo, 'nameField');
    this.checkField(this.emailInfo, 'emailField');
    this.checkField(this.phoneInfo, 'phoneField');
    if (this.validation.isInvalidEmail(this.contactFormular.controls['emailField'].value)) {
      this.emailInfo.warningText = 'The entered email address is invalid.';
      this.isFormValid = false;
      this.emailInfo.isInvalid = !this.isFormValid;
    }
    return this.isFormValid;
  }

  checkField(fieldInfo: any, fieldName: string) {
    this.clearRequiredInfo(fieldInfo);
    let value = this.contactFormular.controls[fieldName].value;
    if (this.isFieldEmpty(fieldName, value)) {
      this.showRequiredInfo(fieldInfo);
    }
  }

  clearRequiredInfo(fieldInfo: any) {
    fieldInfo.warningText = '';
    fieldInfo.isInvalid = false;
  }

  isFieldEmpty(field: string, value: string) {
    return this.contactFormular.controls[field].errors && value.length == 0;
  }

  showRequiredInfo(fieldInfo: any) {
    fieldInfo.warningText = 'This field is required';
    this.isFormValid = false;
    fieldInfo.isInvalid = true;
  }

  async addContact() {
    const newContact = this.getCreatedNewContact();
    try {
      this.modalControls.showContactLoadingAnimation();
      await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
        "contacts": this.getUpdatedContacts(newContact)
      });
      this.modalControls.showSuccessContactMessage();
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.modalControls.hideContactLoadingAnimation(newContact);
    }
  }

  async deleteContact(deletedContact: Contact) {
    try {
      this.user.contacts.forEach((contact, index) => {
        if (contact.id == deletedContact.id) {
          this.user.contacts.splice(index, 1);
        }
      });
      this.modalControls.showContactLoadingAnimation();
      await updateDoc(this.userListService.getUserDocRef('users', this.userId), {
        "contacts": this.user.contacts
      });
      this.modalControls.showDeletedContactMessage();
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.modalControls.hideContactLoadingAnimation(undefined);
    }
  }

  clearForm() {
    this.contactFormular = this.formBuilder.group(this.formGroup);
    this.clearRequiredInfo(this.nameInfo);
    this.clearRequiredInfo(this.emailInfo);
    this.clearRequiredInfo(this.phoneInfo);
  }

  sanitizeInput() {
    let value = this.contactFormular.controls['phoneField'].value
    let phoneValue = value.replace(/[^0-9]/g, '');
    this.contactFormular.patchValue({ phoneField: phoneValue });
  }
}
