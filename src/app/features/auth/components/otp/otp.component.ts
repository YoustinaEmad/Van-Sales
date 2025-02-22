import { Component } from '@angular/core';
import { AuthserviceService } from 'src/app/features/auth/service/authservice.service';
import {
  OtpViewModel,
  ResendOtpViewModel,
} from 'src/app/features/auth/interfaces/authviewmodel';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],

})
export class OtpComponent {
  isSubmitting = false;
  resendTimer = 60; 
  timerInterval: any;
  source: string = '';
  mobile: string = '';
  otp: string;

  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: '',
  };
  userId:string='';
  Role = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Company' },
    { id: 4, name: 'Client' },


  ];
  
  constructor(
    private authService: AuthserviceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) {}



  ngOnInit(): void {
    this.startResendTimer();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.source = params['source']; 
      
    });
  }
  getRoleFromToken() {
    const token = localStorage.getItem('eToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const roleId = decodedToken.RoleID; // Extract RoleID from token
        const userRole = this.Role.find((role) => role.id.toString() === roleId); // Match RoleID
        if (userRole) {
          console.log('User Role:', userRole.name);
        } else {
          console.error('Role not found.');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Token is missing in local storage.');
    }
  }
  
  onOtpChange(otp: string) {
    this.otp = otp;
  }

  // Handle form submission
  onSubmit() {
    if (this.isSubmitting || this.otp.length < this.config.length) return;
    this.isSubmitting = true;
    const storedToken = localStorage.getItem('rToken');
    if (!storedToken) {
      this.isSubmitting = false;
      this._router.navigate(['/auth/register']);
    }

    const body: OtpViewModel = {
      token: storedToken,
      otp: this.otp,
    };

    const handleResponse = (response: any) => {
      this._sharedService.showToastr(response);
      this.isSubmitting = false;
      if (this.source === 'register') {
        setTimeout(() => {
          this._router.navigate(['/auth/success']); 
        }, 2000);
      } else if (this.source === 'login') {
        localStorage.setItem('eToken', response.data.token);
        const roleId = response.data.roleId; 
        
        if (roleId === 4) { 
          this._router.navigate(['/home']);
          
        }else{
          this._router.navigate(['/salesflow/customers']);
        }

      }
      else if (this.source === 'forgetpassword') {
        this.userId=response.data.userID;
        this._router.navigate(['/auth/forgetpassword'], {
          queryParams: { userId: this.userId },
        });
        
       
      }
    };

    const handleError = (error: any) => {
      this._sharedService.showToastr(error);
      this.isSubmitting = false;
    };

    if (this.source === 'register') {
      this.authService.verifyOtp(body).subscribe({
        next: handleResponse,
        error: handleError,
      });
    } else if (this.source === 'login') {
      this.authService.verifyLoginOtp(body).subscribe({
        next: handleResponse,
        error: handleError,
      });
    }else if (this.source === 'forgetpassword') {
      this.authService.verifyForgetPasswordOtp(body).subscribe({
        next: handleResponse,
        error: handleError,
      });
    } 
    
    
    else {
      console.error('Invalid source for OTP verification.');
      this.isSubmitting = false;
    }
  }

  // Start countdown for resend OTP
  startResendTimer() {
    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  // Resend OTP logic
  resendOtp() {
    if (this.isSubmitting) return;
    const storedToken = localStorage.getItem('rToken');

    if (!storedToken) {
      console.error('No token found. Please try again.');
      this._router.navigate(['/auth/register']);
    }

    const body: ResendOtpViewModel = {
      token: storedToken,
      
    };

    this.authService.resendOtp(body).subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        localStorage.setItem('rToken', response.data.otPtoken);
        this.resendTimer = 60; // Reset timer to 60 seconds
        this.startResendTimer(); // Reset and start timer
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      },
    });
  }
}
