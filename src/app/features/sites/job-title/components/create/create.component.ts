import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { employeeCreateViewModel } from '../../interfaces/job-title-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { EmployeeService } from '../../service/job-title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: employeeCreateViewModel = new employeeCreateViewModel();
  id: string;
  isEqualPassword: boolean = true;
  controlType = ControlType;
  environment = environment;
  constructor(
    private _sharedService: SharedService,
    private _employeeService: EmployeeService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  RolesEnum = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Company' },
    { id: 4, name: 'Client' },
  ];
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  }
  //Region:If Edit page
  getEditableItem() {
    this._employeeService.getById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        this.item.id = this.id;
        this.createForm();
      }
    });
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      userName: [this.item.userName, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      roleId: [this.item.roleId,this.page.isEdit ? []: [Validators.required]],
      jobTitle: [this.item.jobTitle],
  
      // Conditionally apply validation
      password: [
        this.item.password, 
        this.page.isEdit ? [] : [Validators.required] // Remove required validation if editing
      ],
      confirmPassword: [
        this.item.confirmPassword, 
        this.page.isEdit ? [] : [Validators.required] // Remove required validation if editing
      ],
    });
    this.page.isPageLoaded = true;
  }
  



  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this._employeeService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/jobTitle']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  ngOnDestroy(): void { }
  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

  confirmPassword(): void {
    const password = this.page.form.get('password')?.value;
    const confirmPassword = this.page.form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.isEqualPassword = false;
    } else {
      this.isEqualPassword = true;
    }
  }


  
  navigateToChangePassword(clientId: string): void {
    if (clientId) {
      this._router.navigate(['/sites/jobTitle/changePassword', clientId]);
    } else {
      console.error('Client ID is missing or invalid.');
    }
  }
}

