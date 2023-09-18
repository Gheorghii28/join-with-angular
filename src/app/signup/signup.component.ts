import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  isconfirmPasswordInvalid: boolean = false;

  @ViewChild('signupContent', { static: true }) signupSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('nameField', { static: true }) nameFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('passwordField', { static: true }) passwordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('confirmPasswordField', { static: true }) confirmPasswordFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('checkboxField', { static: true }) checkboxFieldRef!: ElementRef<HTMLElement>;

  constructor(private formBuilder: FormBuilder) {

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

  }

  onSubmit() {

  }

  toggleAcceptPrivacyPolicy() {

  }
}