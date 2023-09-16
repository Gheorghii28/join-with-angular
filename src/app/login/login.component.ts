import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationService } from '../services/validation/validation.service';
import { UsersListServices } from '../services/firebase-services/users-list.services';
import { Validators, FormBuilder, FormGroup, } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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

  @ViewChild('loginContent', { static: true }) loginSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('passwordField', { static: true }) passwordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('checkboxField', { static: true }) checkboxFieldRef!: ElementRef<HTMLElement>;

  constructor(
    private renderer: Renderer2,
    private validation: ValidationService,
    private usersListRef: UsersListServices,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginFormular = this.formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.removeSingleAnimationClass();
    this.initializeFields();
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
    this.router.navigate(['/summary']);
  }

  isUserValid(email:string, password:string) {
    let isValid = false;
    this.usersListRef['userList'].forEach((user:any) => {
      if(email === user['email'] &&  password === user['password']) {
        this.userId = user['userId'];
        isValid = true;
      }
    });
    return isValid;
  }

  isFieldEmpty(field:string, value:string) {
    return this.loginFormular.controls[field].errors && value.length == 0;
  }

  isInvalidEmail(emailValue:string) {
    return !this.validation.isEmailValid(emailValue) && emailValue.length > 0;
  }

  isInvalidPassword(passwordValue:string) {
    return !this.validation.isPasswordValid(passwordValue) && passwordValue.length > 0;
  }

  isFieldsValid(emailValue:string, passwordValue:string) {
    let isValid = true;
    this.emailWarningText = '';
    this.passwordWarningText = '';
    if (this.isFieldEmpty('emailField', emailValue)) {
      this.emailWarningText = 'This field is required';
      isValid = false;
    }
    if (this.isInvalidEmail(emailValue)) {
      this.emailWarningText = 'The entered email address is invalid.';
      isValid = false;
    }
    if (this.isFieldEmpty('passwordField', passwordValue)) {
      this.passwordWarningText = 'This field is required';
      isValid = false;
    }
    if (this.isInvalidPassword(passwordValue)) {
      this.passwordWarningText = 'The entered password is invalid.'
      isValid = false;
    }
    return isValid;
  }

  loginFormIsInvalid(emailValue: string, passwordValue: string): boolean {
    return this.loginFormular.invalid || !this.isUserValid(emailValue, passwordValue);
  }
  

  checkFields(emailValue:string, passwordValue:string) {
    if(this.isFieldsValid(emailValue, passwordValue)) {
      this.loginWarningText = 'Login unsuccessful. Please verify your login information.';
    }
  }

  onSubmit() {
    let emailValue = this.loginFormular.controls['emailField'].value
    let passwordValue = this.loginFormular.controls['passwordField'].value
    this.loginWarningText = '';
    if (this.loginFormIsInvalid(emailValue, passwordValue)) {
      this.checkFields(emailValue, passwordValue);
    } else {
      this.login();
      this.loginFormular.reset();
    }
  }
}