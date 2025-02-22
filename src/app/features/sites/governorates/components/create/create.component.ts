import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GovernorateService } from 'src/app/features/sites/governorates/service/government.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { governorateCreateViewModel } from '../../interfaces/governorate';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: governorateCreateViewModel = new governorateCreateViewModel();
  id:string;
  isActivated:boolean=false;
  constructor(
    private _sharedService: SharedService,
    private _governmentService: GovernorateService,
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
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  }
  //Region:If Edit page
  getEditableItem() {
    this._governmentService.getById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        this.isActivated = this.item.isActive;
        this.item.id=this.id;
        this.createForm();
      }
    });
  }
  
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name,[Validators.required,Validators.minLength(2), Validators.maxLength(200)]],
      governorateCode: [this.item.governorateCode,[Validators.required,Validators.minLength(2), Validators.maxLength(200)]]

    });
    this.page.isPageLoaded = true;
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this._governmentService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/governorates']);
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
