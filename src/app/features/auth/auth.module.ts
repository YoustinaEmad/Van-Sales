import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { OtpComponent } from './components/otp/otp.component';
import { SuccessComponent } from './components/success/success.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { PhoneForgetPasswordComponent } from './components/phone-forget-password/phone-forget-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'forgetpassword', component: ForgetpasswordComponent },
  { path: 'phoneforgetpassword', component: PhoneForgetPasswordComponent },


];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    SuccessComponent,
    ForgetpasswordComponent,
    PhoneForgetPasswordComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
