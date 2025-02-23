import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from '../../service/authservice.service';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetpasswordViewModel } from '../../interfaces/authviewmodel';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  controlType = ControlType;
  isEqualPassword: boolean = true;
  userId: string = '';
  isSubmitting = false;

  constructor(
    private authService: AuthserviceService,
    private _sharedService: SharedService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.userId = params['userId'] || ''; // Default to an empty string if not provided
    });
  }
  initializeForm(): void {
    this.forgetPasswordForm = this._sharedService.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword:['',Validators.required]
    });
  }
  confirmPassword(): void {
    const password = this.forgetPasswordForm.get('password')?.value;
    const confirmPassword = this.forgetPasswordForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.isEqualPassword = false;
    } else {
      this.isEqualPassword = true;
    }
  }
  onSubmit(): void {
    if (!this.forgetPasswordForm.valid || this.isSubmitting) return;
    this.isSubmitting = true; // Disable the button immediately

    const PasswordData: ForgetpasswordViewModel = {
      ...this.forgetPasswordForm.value, // Include password and confirmPassword
      userId: this.userId, // Add userId
    };
    this.authService.setForgetPassword(PasswordData).subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        localStorage.setItem('eToken', response.data.token);
        this._router.navigate(['/auth/login']);
        // this._router.navigate(['/auth/otp'], {
        //   queryParams: { source: 'forgetpassword'},
        // });
      },
      error: (error) => {
        this._sharedService.showToastr(error);
        this.isSubmitting = false; // Re-enable button after failure

      },
    });
  }

  
}
