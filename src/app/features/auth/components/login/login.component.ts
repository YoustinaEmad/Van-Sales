import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from 'src/app/features/auth/service/authservice.service'; // Adjust the path as necessary
import { LoginViewModel } from 'src/app/features/auth/interfaces/authviewmodel';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
    this.loginForm = this._sharedService.formBuilder.group({
      mobile: ['', [Validators.required , Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      password: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (!this.loginForm.valid) return;
    const loginData: LoginViewModel = this.loginForm.value;
    this.authService.setLogin(loginData).subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        localStorage.setItem('rToken', response.data.otPtoken);
        this._router.navigate(['/auth/otp'], {
          queryParams: { source: 'login'},
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
