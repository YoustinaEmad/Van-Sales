import { Validators } from '@angular/forms';
import { Classification } from '../../../governorates/interfaces/classification';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CompanyCreateViewModel } from '../../interfaces/company';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { CityService } from '../../../city/service/city.service';
import { CompanyService } from '../../service/company.service';
import { cityViewModel } from '../../../city/interfaces/city';
import { forkJoin } from 'rxjs';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: CompanyCreateViewModel = new CompanyCreateViewModel()
  governorates: governorateViewModel[] = [];
  id: string;
  cities: cityViewModel[] = [];
  classifies: Classification[] = [];
  selectedGovernorateId?: string = '';
  selectedGovernorateName: string = "";
  isEqualPassword: boolean = true;
  isActivated:boolean=false;
  constructor(
    private _sharedService: SharedService,
    private _companyService: CompanyService,
    private _cityService: CityService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
    forkJoin([
      this._cityService.getGovernorates(),
      this._companyService.getCities(),
      this._companyService.getClassifications()
    ]).subscribe((res) => {
      this.governorates = res[0].data
      this.cities = res[1].data
      this.classifies = res[2].data
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    }
    )
  }
  //Region:If Edit page
  getEditableItem() {
    this._companyService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;  // Set company data
          this.isActivated = this.item.isActive;
          this.item.id = this.id;
          // Create the form after data is fetched
          this.createForm();
          this.page.isPageLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.page.isPageLoaded = true;
      }
    });
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, Validators.required],
      mobile: [this.item.mobile, [Validators.required,Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      address: [this.item.address, Validators.required],
      governorateId: [this.item.governorateId, Validators.required],
      cityId: [this.item.cityId, Validators.required],
      classificationId: [this.item.classificationId, Validators.required],
      taxCardID: [this.item.taxCardID, [Validators.pattern(/^\d{14}$/)]],
      taxRegistryNumber: [this.item.taxRegistryNumber,Validators.pattern(/^\d{14}$/)],
      nid: [this.item.nid, [Validators.required,Validators.pattern(/^\d{14}$/)]],
      managerName: [this.item.managerName, [Validators.required, Validators.minLength(2)]],
      managerMobile: [this.item.managerMobile,[Validators.required,Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      email: [this.item.email],
      numberOfPoints: [this.item.numberOfPoints, this.page.isEdit ? [] : [Validators.required]],
      amountOfMoney: [this.item.amountOfMoney, this.page.isEdit ? [] : [Validators.required]]

    });
    if (this.page.isEdit) {
      this.page.form.get('numberOfPoints')?.disable();
      this.page.form.get('amountOfMoney')?.disable();
    }
    this.page.isPageLoaded = true;
  }

  loadCities(governorateId?: string) {
    this.cities = [];
    this._companyService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data; 
      } else {
        this.cities = []; 
      }
    });
  }
 

  onGovernorateChange(gouvernatateId: string) {
    this.page.form.patchValue({
      cityId: null, 
    });
    this.loadCities(gouvernatateId)
  }

  Save() {
  //  if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this._companyService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/company']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }


  onCancel(): void {
    this._router.navigate(['/sites/company']);  
  }

  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

  ngOnDestroy(): void { }
  


}

