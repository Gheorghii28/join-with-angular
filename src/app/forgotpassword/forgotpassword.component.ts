import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation/validation.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent {

  forgotFormular: FormGroup = new FormGroup({});
  emailField: any;
  emailWarningText: string = '';
  loginWarningText: string = '';
  isEmailInvalid: boolean = false;
  isForgotInvalid: boolean = false;
  resultInfoContainer: any;
  formResult: any;

  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('forgotContent', { static: true }) forgotSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('sendResultInfo') sendResultInfo!: ElementRef;
  @ViewChild('formResultInfo') formResultInfo!: ElementRef;
  @ViewChild('myForm') myForm!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private validation: ValidationService,
    private renderer: Renderer2
  ) {

  }

  ngOnInit() {
    this.forgotFormular = this.formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]]
    });
  }

  ngAfterViewInit() {
    this.initializeFields();
    this.resultInfoContainer = this.sendResultInfo.nativeElement;
    this.formResult = this.formResultInfo.nativeElement;
  }

  initializeFields() {
    this.emailField = this.emailFieldRef.nativeElement;
  }

  reloadPage() {
    window.location.reload();
  }

  async sendMail() {
    console.log(this.emailField)
    console.log(this.emailField.value)
    if (this.isFieldsValid(this.emailField.value)) {
      await this.onSubmit(this.emailField);
      this.forgotFormular.reset();
    }
  }

  isFieldsValid(emailValue: string) {
    let isValid = true;
    this.isEmailInvalid = false;
    this.emailWarningText = '';

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
    return isValid;
  }

  isFieldEmpty(field: string, value: string) {
    return this.forgotFormular.controls[field].errors && value.length == 0;
  }

  isInvalidEmail(emailValue: string) {
    return !this.validation.isEmailValid(emailValue) && emailValue.length > 0;
  }

  async onSubmit(emailField: any) {
    this.disableFormElements(emailField, true);
    await this.sendFormData(emailField);
    this.disableFormElements(emailField, false);
  }

  disableFormElements(emailField: any, disabledValue: boolean) {
    emailField.disabled = disabledValue;
  }

  async sendFormData(emailField: any) {
    try {
      this.showLoadingAnimation();
      const response = await fetch('https://gheorghii-popovici.de/join_send_mail/join_send_mail.php', {
        method: 'POST',
        body: this.createFormData(emailField)
      });
      console.log('await fertig');


      if (response.ok) {
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

  createFormData(emailField: any) {
    let fd = new FormData();
    fd.append('email', emailField.value);
    return fd;
  }

  showLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'form-result-info');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.myForm.nativeElement, 'brightness04');
  }

  showSuccessSymbolAndMessage() {
    this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-succes-message');
  }

  showErrorMessageBox(errorMessage: any) {
    this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
    this.renderer.addClass(this.formResult, 'form-result-info');
    this.renderer.addClass(this.resultInfoContainer, 'show-form-error-message');
    this.renderer.addClass(this.myForm.nativeElement, 'brightness04');
    console.log(errorMessage);

  }

  hideLoadingAnimation() {
    this.renderer.addClass(this.formResult, 'opacity-null');
    setTimeout(() => {
      this.renderer.removeClass(this.formResult, 'form-result-info');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-load-animation');
      this.renderer.removeClass(this.myForm.nativeElement, 'brightness04');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-succes-message');
      this.renderer.removeClass(this.resultInfoContainer, 'show-form-error-message');
      this.renderer.removeClass(this.formResult, 'opacity-null');
    }, 2000);
  }
}