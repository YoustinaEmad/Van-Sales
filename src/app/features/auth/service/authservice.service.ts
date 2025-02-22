import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import {
  ForgetpasswordViewModel,
  LoginViewModel,
  OtpViewModel,
  PhoneViewModel,
  RegisterViewModel,
  ResendOtpViewModel,
} from '../interfaces/authviewmodel';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private _apiService: ApiService, private _router: Router) {}
  userData: any;

  logOut(): void {
    localStorage.removeItem('eToken');
    this._router.navigate(['/login']);
  }

  saveUserData() {
    if (localStorage.getItem('eToken') != null) {
      let encodeToken: any = localStorage.getItem('eToken');
      // let decodeToken = jwtDecode(encodeToken);
      // this.userData = decodeToken;
    }
  }
  saveRegisterUserData() {
    if (localStorage.getItem('rToken') != null) {
      let encodeToken: any = localStorage.getItem('rToken');
      // let decodeToken = jwtDecode(encodeToken);
      // this.userData = decodeToken;
    }
  }
  setRegister(userData: RegisterViewModel) {
    return this._apiService.post(`/ClientRegisterEndPoint/Post`, userData);
  }

  verifyOtp(body: OtpViewModel) {
    return this._apiService.post(`/VerifyOTPEndPoint/Post`, body);
  }
  verifyLoginOtp(body: OtpViewModel) {
    return this._apiService.post(`/LoginEndPoint/Post`, body);
  }
  verifyForgetPasswordOtp(body: OtpViewModel) {
    console.log(body);
    return this._apiService.get(`/CheckOTPValidationEndpoint/CheckOTPValidation?Token=${body.token}&OTP=${body.otp}`);
  }
  resendOtp(body: ResendOtpViewModel) {
    return this._apiService.post(`/ResendOTPEndPoint/Post`, body);
  }
  setLogin(userData: LoginViewModel) {
    return this._apiService.post(`/OTPLoginEndPoint/Post`, userData);
  }
  setPhone(phone:PhoneViewModel){
    return this._apiService.post(`/ResetPasswordOTPEndPoint/ResetPasswordOTP?Mobile=${phone.mobile}`);
  }
  setForgetPassword(forgetPassword:ForgetpasswordViewModel){
    return this._apiService.update(`/ResetPasswordEndpoint/ResetPassword`,forgetPassword);
  }
  uploadImage(formData: FormData) {
    return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  }
}
