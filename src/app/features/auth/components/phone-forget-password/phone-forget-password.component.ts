import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { AuthserviceService } from '../../service/authservice.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Router } from '@angular/router';
import { PhoneViewModel } from '../../interfaces/authviewmodel';

@Component({
  selector: 'app-phone-forget-password',
  templateUrl: './phone-forget-password.component.html',
  styleUrls: ['./phone-forget-password.component.css']
})
export class PhoneForgetPasswordComponent implements OnInit{
  phoneForgetPasswordForm: FormGroup;
  controlType = ControlType;
  constructor(
    private authService: AuthserviceService,
    private _sharedService: SharedService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(): void {
    this.phoneForgetPasswordForm = this._sharedService.formBuilder.group({
      mobile: ['', [Validators.required,Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      
    });
  }
  onSubmit(): void {
    if (!this.phoneForgetPasswordForm.valid) return;
    const Phone: PhoneViewModel = this.phoneForgetPasswordForm.value;
    this.authService.setPhone(Phone).subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        localStorage.setItem('rToken', response.data.otPtoken);
        this._router.navigate(['/auth/otp'], {
          queryParams: { source: 'forgetpassword'},
        });
      },
      error: (error) => {
        this._sharedService.showToastr(error);
       
      },
    });
  }
  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }
}
