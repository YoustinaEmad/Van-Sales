import { Component } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { changePasswordViewModel } from '../../Interface/profile';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeProfileService } from '../../Service/employee-profile.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ApiService } from 'src/app/shared/service/api.service';
import { Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: changePasswordViewModel = new changePasswordViewModel();
  isEqualPassword: boolean = true;
  id:string;
  controlType = ControlType;
  clientId :string;

  
  constructor(private _router: Router, private _employeeProfile: EmployeeProfileService, private _sharedService: SharedService,
    private _apiService: ApiService, private _activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {

    this.getClientIdFromToken();
    this.page.isPageLoaded = false;

    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id'); // Assign clientId from route or other source
      } else {
        console.error('Client ID is not available.');
      }
    });
  
    this.page.form = this._sharedService.formBuilder.group({
      password: [
        this.item.password,
        [Validators.required, Validators.minLength(8), Validators.maxLength(100)]
      ],
      confirmPassword: [
        this.item.confirmPassword,
        [Validators.required]
      ],
    });
  
    this.page.isPageLoaded = true;
  }
  
  getClientIdFromToken() {
    const token = localStorage.getItem('eToken'); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        this.clientId = decodedToken.ID; // Extract the client ID using the correct key
      } catch (error) {
      }
    } else {
    }
  }
  confirmPassword(): void {
    const password = this.page.form.get('password')?.value;
    const confirmPassword = this.page.form.get('confirmPassword')?.value;
    this.isEqualPassword = password === confirmPassword;
  }

  changePassword(): void {
    if (this.page.isSaving || this.page.form.invalid || !this.isEqualPassword) return;
  
    
  
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
  
    this._employeeProfile.changePassword(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/employeeProfile']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }
  

  onCancel(): void {
    this._router.navigate(['/sites/employeeProfile']);
  }
}
