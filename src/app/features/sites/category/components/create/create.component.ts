import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CategoryService } from 'src/app/features/sites/category/service/category.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import {
  categoryCreateViewModel,
  categorySelectedItem,
} from '../../interfaces/category-view-model';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TabEnum } from '../../interfaces/enum/tab_enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: categoryCreateViewModel = new categoryCreateViewModel();
  id: string;
  isActivated: boolean = false;
  images = [{ uploaded: false, src: null }];
  environment=environment;
  isSubCategory: boolean = false;
  categories: categorySelectedItem[] = [];
  selectedTab: TabEnum = TabEnum.GeneralData;
  TabEnum = TabEnum;
  Tabs = [
    {
      ID: 1,
      name: 'General Data',
      icon: '/assets/icons/vector.svg',
      selectedIcon: '/assets/icons/vector.svg',
      isSelected: true,
    },
    {
      ID: 2,
      name: 'Data',
      icon: '/assets/icons/sell.svg',
      selectedIcon: '/assets/icons/sell.svg',
      isSelected: false,
    },
    {
      ID: 3,
      name: 'Images',
      icon: '/assets/icons/sell.svg',
      selectedIcon: '/assets/icons/sell.svg',
      isSelected: false,
    },
  ];

  constructor(
    private _sharedService: SharedService,
    private _categoryService: CategoryService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
        //this.Tabs = this.Tabs.filter(tab => tab.name !== 'Images');

      }
    });
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  }

  getEditableItem() {
    this._categoryService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.isActivated = this.item.isActive;
          this.item.id = this.id;
          if (this.item.parentCategoryId) {
            this.isSubCategory = true;
            this.onCreateSubCategory();
          } else {
            this.createForm();
          }
          this.page.isPageLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.page.isPageLoaded = true;
      },
    });
  }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, Validators.required],
      description: [this.item.description, Validators.required],
      tags: [this.item.tags, Validators.required],
      seo: [this.item.seo, Validators.required],
      paths: [this.item.paths],
      parentCategoryId: [
        this.isSubCategory ? this.item.parentCategoryId : null,
        this.isSubCategory ? Validators.required : null,
      ],
    });
    this.page.isPageLoaded = true;
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this.item.paths = this.getUploadedImages();  // Use the method to get all the uploaded image paths

    //this.item.paths = this.getUploadedImages();
    // this.item.paths = this.images
    //    .filter((image) => image.uploaded)
    //    .map((image) => image.src);
    this.item.paths = this.images.filter((image) => image.uploaded).map((image) => image.src);
    if (this.isSubCategory) {
      this.item.name = this.item.name;
    }

    this._categoryService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/category']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }

  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((item) => {
      item.isSelected = item.ID === tabID;
    });
  }

  getSelectedTab() {
    return this.Tabs.find((item) => item.isSelected);
  }
  onCancel(): void {
    this._router.navigate(['/sites/category']);
  }

  onReset() {
    this.page.form.reset();
    this.isActivated = false;
  }

  onCreateSubCategory() {
    this.isSubCategory = true;
    forkJoin([this._categoryService.getCategories()]).subscribe((res) => {
      const categoryResponse = res[0];
      if (categoryResponse.isSuccess) {
        this.categories = categoryResponse.data;
        this.createForm();
      }
    });
  }

  ngOnDestroy(): void { }
  onImageUpload(files, index: number): void {
    if (files.length === 0) {
      return;
    }
  
    const file = <File>files[0];
    const formData = new FormData();
    formData.append('Files', file, file.name);  // Use 'Files' as the field name if required by backend
    console.log(formData);
  
    // Call the service to upload the image, passing the FormData directly
    this._categoryService.uploadImage(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          //this.images[index] = { uploaded: true, src: res.data.path[index] };
          this.images[index] = { uploaded: true, src: res.data.path[index]};

          this._sharedService.showToastr(res);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      },
    });
  }
  
  
  
 

  getUploadedImages() {
    return this.images.filter(image => image.uploaded).map(image => image.src);
  }
}