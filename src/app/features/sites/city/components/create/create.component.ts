import { Validators } from '@angular/forms';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CityService } from '../../service/city.service';
import { cityCreateViewModel } from '../../interfaces/city';
import { forkJoin } from 'rxjs';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: cityCreateViewModel = new cityCreateViewModel();
  governoratesList: governorateViewModel[] = [];
  id: string;
  isActivated:boolean=false;
  constructor(
    private _sharedService: SharedService,
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
     ]).subscribe((res) => {
      this.governoratesList = res[0].data
      if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  })}

  //Region:If Edit page
  getEditableItem() {
    this._cityService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data; // Set item data from response
          this.isActivated = this.item.isActive;
          this.item.id = this.id;
          this.createForm(); // Create the form after fetching the data
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
      governorateId: [this.item.governorateId, Validators.required]
    });
    this.page.isPageLoaded = true;
  }


  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this._cityService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/cities']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);

        this.page.isSaving = false;
      },
    });
  }

  


  ngOnDestroy(): void { }


}
