import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { LegalnoticeComponent } from './legalnotice/legalnotice.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'legalnotice', component: LegalnoticeComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'addtask', component: AddTaskComponent },
  { path: 'board', component: BoardComponent },
  { path: 'contacts', component: ContactsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
