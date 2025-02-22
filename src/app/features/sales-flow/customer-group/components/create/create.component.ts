import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { customerGroupCreateViewModel } from '../../interfaces/customer-group-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerGroupService } from '../../service/customer-group.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: customerGroupCreateViewModel = new customerGroupCreateViewModel();
  id: string;
  checkedTaxes: boolean = false;

  constructor(
    private _sharedService: SharedService,
    private _customerGroupService: CustomerGroupService,
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
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  }
  getEditableItem() {
    this._customerGroupService.getById(this.id).subscribe( {
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;
          this.checkedTaxes = this.item.taxExempted;
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
      name: [this.item.name, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    });
    this.page.isPageLoaded = true;
  }


  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;


    this.item.taxExempted = this.checkedTaxes;

    Object.assign(this.item, this.page.form.value);

    this._customerGroupService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/salesflow/customergroup']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }


  onCancel(): void {
    this._router.navigate(['/salesflow/customergroup']);
  }


  onReset() {
    this.page.form.reset();
    this.checkedTaxes = false;
  }
  ngOnDestroy(): void { }
}
