import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent {

  forgotFormular: FormGroup = new FormGroup({});
  emailField: any;
  emailWarningText: string = '';
  isEmailInvalid: boolean = false;

  @ViewChild('emailField', { static: true }) emailFieldRef!: ElementRef<HTMLElement>;
  @ViewChild('forgotContent', { static: true }) forgotSectionRef!: ElementRef<HTMLElement>;

  constructor(private formBuilder: FormBuilder) {
    
  }

  ngOnInit() {
    this.forgotFormular = this.formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.initializeFields();
  }

  initializeFields() {
    this.emailField = this.emailFieldRef.nativeElement;
  }

  reloadPage() {
    window.location.reload();
  }

  onSubmit() {

  }
}