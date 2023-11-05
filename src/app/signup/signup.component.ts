import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { addDoc } from '@angular/fire/firestore';
import { ValidationService } from '../services/validation/validation.service';
import { User } from '../interfaces/user.interface';
import { DataServices } from '../services/data-services/data.services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupFormular: FormGroup = new FormGroup({});
  nameField: any;
  emailField: any;
  passwordField: any;
  confirmPasswordField: any;
  checkboxField: any;

  signupWarningText: string = '';
  nameWarningText: string = '';
  emailWarningText: string = '';
  passwordWarningText: string = '';
  confirmPasswordWarningText: string = '';

  isSignupInvalid: boolean = false;
  isEmailInvalid: boolean = false;
  isNameInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isConfirmPasswordInvalid: boolean = false;
  resultInfoContainer: any;
  formResult: any;

  passwordDiplayedInfo: any = {
    isDisplayed: false,
    type: 'password'
  }

  confirmPasswordDiplayedInfo: any = {
    isDisplayed: false,
    type: 'password'
  }

  @ViewChild('signupContent', { static: true }) signupSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('nameField', { static: true }) nameFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('passwordField', { static: true }) passwordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('confirmPasswordField', { static: true }) confirmPasswordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('checkboxField', { static: true }) checkboxFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('sendResultInfo') sendResultInfo!: ElementRef;
  @ViewChild('formResultInfo') formResultInfo!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private usersListServices: UsersListServices,
    private validation: ValidationService,
    private renderer: Renderer2,
    private data: DataServices
  ) {

  }

  ngOnInit() {
    this.signupFormular = this.formBuilder.group({
      nameField: ['', [Validators.required]],
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required],
      confirmPasswordField: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.initializeFields();
    this.resultInfoContainer = this.sendResultInfo.nativeElement;
    this.formResult = this.formResultInfo.nativeElement;
  }

  initializeFields() {
    this.nameField = this.nameFieldRef.nativeElement;
    this.emailField = this.emailFieldRef.nativeElement;
    this.passwordField = this.passwordFieldRef.nativeElement;
    this.confirmPasswordField = this.confirmPasswordFieldRef.nativeElement;
    this.checkboxField = this.checkboxFieldRef.nativeElement;
  }

  reloadPage() {
    window.location.reload();
  }

  signUp() {
    if (this.isFieldsValid()) {
      this.onSubmit();
      this.signupFormular.reset();
    }
  }

  async onSubmit() {
    this.disableFormElements(true);
    await this.addUser();
    this.disableFormElements(false);
  }

  async addUser() {
    try {
      const user:User = this.data.createUser(this.nameField.value, this.emailField.value, this.confirmPasswordField.value);
      this.showLoadingAnimation();
      const fh = await addDoc(this.usersListServices.getUsersRef(), user);
      if (fh) {
        this.showSuccessSymbolAndMessage();
      } else {
        this.showErrorMessageBox('Error while submitting the form.');
      }
    } catch (error) {
      this.showErrorMessageBox(error);
    } finally {
      this.hideLoadingAnimation();
    }
  }

  toggleAcceptPrivacyPolicy() {

  }

  isFieldsValid() {
    let isValid = true;
    this.isNameInvalid = false;
    this.nameWarningText = '';
    this.isEmailInvalid = false;
    this.emailWarningText = '';
    this.isPasswordInvalid = false;
    this.passwordWarningText = '';
    this.isConfirmPasswordInvalid = false;
    this.confirmPasswordWarningText = '';

    if (this.validation.isFieldEmpty(this.signupFormular, 'nameField', this.nameField.value)) {
      this.nameWarningText = 'This field is required';
      isValid = false;
      this.isNameInvalid = !isValid;
    }

    if (this.validation.isFieldEmpty(this.signupFormular, 'emailField', this.emailField.value)) {
      this.emailWarningText = 'This field is required';
      isValid = false;
      this.isEmailInvalid = !isValid;
    }
    if (this.validation.isInvalidEmail(this.emailField.value)) {
      this.emailWarningText = 'The entered email address is invalid.';
      isValid = false;
      this.isEmailInvalid = !isValid;
    }

    if (this.validation.isFieldEmpty(this.signupFormular, 'passwordField', this.passwordField.value)) {
      this.passwordWarningText = 'This field is required';
      isValid = false;
      this.isPasswordInvalid = !isValid;
    }
    if (!this.validation.isPasswordValid(this.passwordField.value)) {
      this.passwordWarningText = 'The entered password is invalid.';
      isValid = false;
      this.isPasswordInvalid = !isValid;
    }

    if (this.validation.isFieldEmpty(this.signupFormular, 'confirmPasswordField', this.confirmPasswordField.value)) {
      this.confirmPasswordWarningText = 'This field is required';
      isValid = false;
      this.isConfirmPasswordInvalid = !isValid;
    }
    if (this.passwordField.value.length > 0 && this.passwordField.value !== this.confirmPasswordField.value) {
      this.confirmPasswordWarningText = 'Ups! your password don’t match';
      isValid = false;
      this.isConfirmPasswordInvalid = !isValid;
    }

    return isValid;
  }

  disableFormElements(disabledValue: boolean) {
    this.nameField.disabled = disabledValue;
    this.emailField.disabled = disabledValue;
    this.passwordField.disabled = disabledValue;
    this.confirmPasswordField.disabled = disabledValue;
  }
  
  showLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'form-result-info');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-load-animation');
  }

  showSuccessSymbolAndMessage() {
    this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-succes-message');
  }

  showErrorMessageBox(errorMessage: any) {
    this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.formResult, 'form-result-info');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-error-message');
    console.log(errorMessage);

  }

  hideLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'opacity-null');
    setTimeout(() => {
      this.renderer.removeClass(this.formResult, 'form-result-info');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-succes-message');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-error-message');
      this.renderer.removeClass(this.formResult, 'opacity-null');
    }, 2000);
  }
  
  togglePasswordVisibility(passwordInfo:any) {
    passwordInfo.isDisplayed = !passwordInfo.isDisplayed;
    if (passwordInfo.isDisplayed) {
      passwordInfo.type = 'text';
    } else {
      passwordInfo.type = 'password';
    }
  }
}