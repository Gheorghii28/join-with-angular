import { Component, ElementRef, OnInit, Renderer2, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationService } from '../services/validation/validation.service';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { Validators, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  emailField: any;
  passwordField: any;
  checkboxField: any;
  loginFormular: FormGroup = new FormGroup({});
  userId: any;
  emailWarningText: string = '';
  passwordWarningText: string = '';
  loginWarningText: string = '';
  isEmailInvalid: boolean = false;
  isPasswordInvalid: boolean = false;
  isLoginInvalid: boolean = false;
  rememberMeKey: string = 'rememberMe';
  rememberMe: boolean = false;
  isPrivacyPoliceOpen: boolean = false;
  isLegalNoticeOpen: boolean = false;
  isModalontainerOpen: boolean = false;
  isPaswordDisplayed: boolean = false;
  passwordType: string = 'password';

  @ViewChild('loginContent', { static: true }) loginSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('passwordField', { static: true }) passwordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('checkboxField', { static: true }) checkboxFieldRef!: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2,
    private validation: ValidationService,
    private userListService: UsersListServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loginFormular = this.formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.removeSingleAnimationClass();
    this.initializeFields();
    this.autoLogin();
  }

  initializeFields() {
    this.emailField = this.emailFieldRef.nativeElement;
    this.passwordField = this.passwordFieldRef.nativeElement;
    this.checkboxField = this.checkboxFieldRef.nativeElement;
  }

  removeSingleAnimationClass() {
    const loginSection = this.loginSectionRef.nativeElement;
    setTimeout(() => {
      this.renderer.removeClass(loginSection, 'animate-once');
    }, 2000);
  }

  reloadPage() {
    window.location.reload();
  }

  login() {
    this.setRememberMe(this.rememberMe)
    this.router.navigate(['/summary']);
  }

  guestLogin() {
    localStorage.setItem('id-key', JSON.stringify('slGhq0a60LGsfMkCx8V1'));
  }

  isUserValid(email: string, password: string) {
    let isValid = false;
    this.userListService['userList'].forEach((user: any) => {
      if (email === user['email'] && password === user['password']) {
        this.userId = user['userId'];
        this.userListService['userId'] = user['userId'];
        isValid = true;
      }
    });
    return isValid;
  }

  isFieldEmpty(field: string, value: string) {
    return this.loginFormular.controls[field].errors && value.length == 0;
  }

  isInvalidEmail(emailValue: string) {
    return !this.validation.isEmailValid(emailValue) && emailValue.length > 0;
  }

  isInvalidPassword(passwordValue: string) {
    return !this.validation.isPasswordValid(passwordValue) && passwordValue.length > 0;
  }

  isFieldsValid(emailValue: string, passwordValue: string) {
    let isValid = true;
    this.isEmailInvalid = false;
    this.isPasswordInvalid = false;
    this.emailWarningText = '';
    this.passwordWarningText = '';

    if (this.isFieldEmpty('emailField', emailValue)) {
      this.emailWarningText = 'This field is required';
      isValid = false;
      this.isEmailInvalid = !isValid;
    }
    if (this.isInvalidEmail(emailValue)) {
      this.emailWarningText = 'The entered email address is invalid.';
      isValid = false;
      this.isEmailInvalid = !isValid;
    }
    if (this.isFieldEmpty('passwordField', passwordValue)) {
      this.passwordWarningText = 'This field is required';
      isValid = false;
      this.isPasswordInvalid = !isValid;
    }
    if (this.isInvalidPassword(passwordValue)) {
      this.passwordWarningText = 'The entered password is invalid.'
      isValid = false;
      this.isPasswordInvalid = !isValid;
    }
    return isValid;
  }

  loginFormIsInvalid(emailValue: string, passwordValue: string): boolean {
    return this.loginFormular.invalid || !this.isUserValid(emailValue, passwordValue);
  }


  checkFields(emailValue: string, passwordValue: string) {
    this.isLoginInvalid = false;
    if (this.isFieldsValid(emailValue, passwordValue)) {
      this.loginWarningText = 'Login unsuccessful. Please verify your login information.';
      this.isLoginInvalid = true;
    }
  }

  onSubmit() {
    let emailValue = this.loginFormular.controls['emailField'].value;
    let passwordValue = this.loginFormular.controls['passwordField'].value;
    this.loginWarningText = '';
    if (this.loginFormIsInvalid(emailValue, passwordValue)) {
      this.checkFields(emailValue, passwordValue);
    } else {
      this.login();
      this.loginFormular.reset();
    }
  }

  setRememberMe(value: boolean) {
    localStorage.setItem(this.rememberMeKey, JSON.stringify(value));
    localStorage.setItem('id-key', JSON.stringify(this.userId));
    if (value) {
      localStorage.setItem('email', JSON.stringify(this.loginFormular.controls['emailField'].value));
    } else {
      localStorage.setItem('email', '');
    }
  }

  getRememberMe(): boolean {
    const rememberMe = localStorage.getItem(this.rememberMeKey);
    return rememberMe ? JSON.parse(rememberMe) : false;
  }

  toggleRememberMe() {
    this.rememberMe = !this.rememberMe;
  }

  autoLogin() {
    this.rememberMe = this.getRememberMe();
    const email = localStorage.getItem('email');
    if (this.rememberMe && email) {
      this.loginFormular.controls['emailField'].setValue(JSON.parse(email));
    }
    this.checkboxField.checked = this.rememberMe;
  }

  closeModalContainer() {
    this.isLegalNoticeOpen = false;
    this.isPrivacyPoliceOpen = false;
    this.isModalontainerOpen = false;
  }

  openPrivacyPolice() {
    this.isModalontainerOpen = true;
    this.isPrivacyPoliceOpen = true; 
  }

  openLegalNotice() {
    this.isModalontainerOpen = true;
    this.isLegalNoticeOpen = true; 
  }
  
  togglePasswordVisibility() {
    this.isPaswordDisplayed = !this.isPaswordDisplayed;
    if (this.isPaswordDisplayed) {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }
}