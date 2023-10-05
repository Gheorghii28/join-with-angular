import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { LegalnoticeComponent } from './legalnotice/legalnotice.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { SummaryComponent } from './summary/summary.component';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
import { NavMobileComponent } from './nav-mobile/nav-mobile.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PrivacypolicyComponent,
    LegalnoticeComponent,
    ForgotpasswordComponent,
    SummaryComponent,
    NavComponent,
    HeaderComponent,
    NavMobileComponent,
    AddTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
