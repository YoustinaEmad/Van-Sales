import { Component, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import {  profileSettingViewModel } from '../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ApiService } from 'src/app/shared/service/api.service';
import { Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { WebsiteService } from '../../../services/website.service';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent  implements OnInit {
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
  
  constructor(private _router: Router, private _WebsiteService: WebsiteService, private _sharedService: SharedService,
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
      nationalNumber: [
        this.item.nationalNumber,
        [ Validators.pattern(/^\d{14}$/)]
      ],
      age: [this.item.age],
      gender: [this.item.gender],
      userName: [this.item.userName, [Validators.required]],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      phone: [this.item.phone],
      email: [this.item.email, [Validators.email]], 
      clientActivity: [this.item.clientActivity],
    });
    this.page.isPageLoaded = true;
  }

  getEditableItem() {
    this._WebsiteService.getClientById(this.clientId).subscribe({
      next: (res) => {
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
    this._WebsiteService.profileSetting(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/profile']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }
  
   // getClientIdFromToken() {
  //   const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
  //   if (token) {
  //     try {
  //       const decodedToken: any = jwt_decode(token); // Decode the token
  //       this.clientId = decodedToken.clientId; // Extract the clientId (assuming the key is "clientId")
  //     } catch (error) {
  //     }
  //   } else {
  //   }
  // }

  onCancel(): void {
    this._router.navigate(['/profile']);
  }
}


