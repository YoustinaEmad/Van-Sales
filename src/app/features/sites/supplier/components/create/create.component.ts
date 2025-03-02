import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GovernorateService } from 'src/app/features/sites/governorates/service/government.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { supplierCreateViewModel } from '../../interfaces/supplier';
import { Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { forkJoin } from 'rxjs';
import { cityViewModel } from '../../../city/interfaces/city';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  governoratesList: governorateViewModel[] = [];
  cityList:cityViewModel[]=[];
  classificationList :any[]=[];
  item: supplierCreateViewModel = new supplierCreateViewModel();
  id:string;
  isActivated:boolean=false;
  constructor(
    private _sharedService: SharedService,
    private _supplierService: SupplierService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}



 

  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
    forkJoin([
      this._supplierService.getGovernorates(),
      this._supplierService.getCities(),
      this._supplierService.getClassifications(),
    ]).subscribe((res) => {
      this.governoratesList = res[0].data;
      this.cityList=res[1].data;
      this.classificationList=res[2].data;
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
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
    this._supplierService.getById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        //this.isActivated = this.item.isActive;
        this.item.id=this.id;
        this.createForm();
      }
    });
  }
  
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name,[Validators.required,Validators.minLength(2), Validators.maxLength(200)]],
      code: [this.item.code,[Validators.required]],
      collaborationAdministrator: [this.item.collaborationAdministrator,[Validators.required]], 
      creditLimit: [this.item.creditLimit,[Validators.required]],
      classificationId: [this.item.classificationId,[Validators.required]],
      governorateId: [this.item.governorateId,[Validators.required]],
      cityId: [this.item.cityId,[Validators.required]],
      street: [this.item.street,[Validators.required]],
      landmark: [this.item.landmark,[Validators.required]],
      latitude: [this.item.latitude],
      longitude: [this.item.longitude],
      buildingData: [this.item.buildingData,[Validators.required]],
      path: [this.item.path,[Validators.required]],
    });
    this.page.isPageLoaded = true;
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
   // this.item.isActive = this.isActivated;
    this._supplierService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/supplier']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  ngOnDestroy(): void {}
  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }
}
