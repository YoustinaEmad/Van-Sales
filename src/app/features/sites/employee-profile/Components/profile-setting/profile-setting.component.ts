import { Component } from '@angular/core';
import { profileSettingViewModel } from '../../Interface/profile';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { environment } from 'src/environments/environment';
import { Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/shared/service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { EmployeeProfileService } from '../../Service/employee-profile.service';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent {
page: CRUDCreatePage = new CRUDCreatePage();
  item: profileSettingViewModel = new profileSettingViewModel();
  isEqualPassword: boolean = true;
  id:string;
  controlType = ControlType;
  environment = environment;  
  clientId :string;
  customerActivity = [
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ]
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];



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
    this.getEditableItem();
  }
  getClientIdFromToken() {
    const token = localStorage.getItem('eToken'); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        this.clientId = decodedToken.ID; 
      } catch (error) {
      }
    } else {
    }
  }
  
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      userName: [this.item.userName, [Validators.required]],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      jobTitle: [this.item.jobTitle], 

    });
    this.page.isPageLoaded = true;
  }

  getEditableItem() {
    this._employeeProfile.getClientById(this.clientId).subscribe({
      next: (res) => {
        console.log(res)
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;
          this.createForm();
          this.page.isPageLoaded = true;
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isPageLoaded = true;
      }
    });
  }
  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;

    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.id=this.clientId;
    console.log(this.item)
    this._employeeProfile.profileSetting(this.item).subscribe({
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
