import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ProductService } from 'src/app/features/sites/Product/service/product.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import {
  brandSelectedItem,
  categorySelectedItem,
  productCreateViewModel,
  productViewModel,
} from '../../interfaces/product';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TabEnum } from '../../interfaces/enum/tab-enum';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

export function validateMaxMin(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const min = group.get('minimumQuantity')?.value;
    const max = group.get('maximumQuantity')?.value;

    return max !== null && min !== null && max < min
      ? { maxLessThanMin: true }
      : null;
  };
}


// Validator to ensure max quantity > min quantity
function maxGreaterThanMinValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const min = form.get('minimumQuantity')?.value;
    const max = form.get('maximumQuantity')?.value;

    if (min !== null && max !== null && max <= min) {
      return { maxLessThanMin: 'Maximum Quantity must be greater than Minimum Quantity.' };
    }
    return null;
  };
}


function quantityInRangeValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const min = form.get('minimumQuantity')?.value;
    const max = form.get('maximumQuantity')?.value;
    const quantity = form.get('quantity')?.value;

    if (
      quantity !== null &&
      ((min !== null && quantity < min) || (max !== null && quantity > max))
    ) {
      return { quantityOutOfRange: 'Quantity must be between Minimum and Maximum Quantity.' };
    }
    return null;
  };
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: productCreateViewModel = new productCreateViewModel();
  id: string;
  isActivated: boolean = false;
  isActivatedPoint:boolean=false;
  isFeatured: boolean = false;
  images = [{ uploaded: false, src: null }];
  selectedItem: productViewModel;
  categories: categorySelectedItem[] = [];
  subCategories: any[] = [];
  brands: brandSelectedItem[] = [];
  selectedCategoryId: string = '';
  selectedTab: TabEnum = TabEnum.GeneralData;
  TabEnum = TabEnum;
  minStartDate: Date = new Date();
  environment=environment;
  // Tabs definition
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
      name: 'Media',
      icon: '/assets/icons/media.svg',
      selectedIcon: '/assets/icons/media.svg',
      isSelected: false,
    },
    {
      ID: 3,
      name: 'Price',
      icon: '/assets/icons/price.svg',
      selectedIcon: '/assets/icons/price.svg',
      isSelected: false,
    },
    {
      ID: 4,
      name: 'Dimensions',
      icon: '/assets/icons/daimantion.svg',
      selectedIcon: '/assets/icons/daimantion.svg',
      isSelected: false,
    },
    {
      ID: 5,
      name: 'Other Data',
      icon: '/assets/icons/daimantion.svg',
      selectedIcon: '/assets/icons/daimantion.svg',
      isSelected: false,
    },
  ];

  // Variable to hold the uploaded image
  selectedImage: string | null = null;

  constructor(
    private _sharedService: SharedService,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
        // Hide Media tab when editing
        //this.Tabs = this.Tabs.filter(tab => tab.name !== 'Media');
      }
    });
  
    forkJoin([
      this._productService.getCategories(),
      this._productService.getSubCategories(),
      this._productService.getBrands(),
    ]).subscribe((res) => {
      this.categories = res[0].data;
      this.subCategories = res[1].data;
      this.brands = res[2].data;
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    });
  }
  
  // ngOnInit(): void {
  //   this.page.isPageLoaded = false;
  //   this._activatedRoute.paramMap.subscribe((params) => {
  //     if (params.has('id')) {
  //       this.id = params.get('id');
  //       this.page.isEdit = true;
  //     }
  //   });
  //   forkJoin([
  //     this._productService.getCategories(),
  //     this._productService.getSubCategories(),
  //     this._productService.getBrands(),
  //   ]).subscribe((res) => {
  //     this.categories = res[0].data;
  //     this.subCategories = res[1].data;
  //     this.brands = res[2].data;
  //     if (this.page.isEdit) {
  //       this.getEditableItem();
  //     } else {
  //       this.createForm();
  //     }
  //   });
  // }

  // If Edit page
  getEditableItem() {
    this._productService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          this.item = res.data;
          this.isActivated = res.data.isActive;
          this.isActivatedPoint=res.data.isActivePoint;
          this.isFeatured=res.data.featuredProduct;
          this.item.id = this.id;
          this.item.availableDate =
            this.item.availableDate || new Date().toISOString();
          this.createForm();
          this.page.isPageLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.page.isPageLoaded = true;
      },
    });
  }
  validatePastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
  
    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      return { pastDate: 'Please select today or a future date.' };
    }
  
    return null; 
  }
  

  
  createForm() {
    const validators = this.page.isEdit
    ? [] 
    : [maxGreaterThanMinValidator(), quantityInRangeValidator()];
    this.page.form = this._sharedService.formBuilder.group(
      {
        name: [this.item.name, [Validators.required, Validators.minLength(2)]],
        description: [this.item.description, [Validators.required,Validators.maxLength(500)]],
        tags: [this.item.tags, [Validators.required, Validators.maxLength(50)]],
        paths: [this.item.paths],
        specificationMetrix: [
          this.item.specificationMetrix || '',
          Validators.required,
        ],
        data: [this.item.data || '', Validators.required],
        price: [this.item.price, [Validators.required, Validators.min(1)]],
        width: [this.item.width, [Validators.required,Validators.min(1)]],
        height: [this.item.height, [Validators.required,Validators.min(1)]],
        liter: [this.item.liter, [Validators.required,Validators.min(1)]],
        length: [this.item.length,[Validators.required, Validators.min(1)]],
        tax: [this.item.tax, [Validators.required, Validators.min(0)]],
        maximumQuantity: [this.item.maximumQuantity, [Validators.required,Validators.min(1)]],
        minimumQuantity: [this.item.minimumQuantity, [Validators.required, Validators.min(0)]],
        brandId: [this.item.brandId, Validators.required],
        model: [this.item.model, Validators.required],
        availableDate: [this.item.availableDate || new Date().toISOString(),this.validatePastDate],
        categoryId: [this.item.categoryId, Validators.required],
        quantity: [this.item.quantity, [Validators.required,  Validators.min(0)]],
        numberOfPoints: [this.item.numberOfPoints, [Validators.required]],

    },
    { validators }
    );

    this.page.isPageLoaded = true;
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.availableDate = moment(this.item.availableDate).format('YYYY-MM-DD');
    this.item.isActive = this.isActivated;
    this.item.isActivePoint=this.isActivatedPoint;
    this.item.featuredProduct=this.isFeatured;
    this.item.paths = this.images
      .filter((image) => image.uploaded)
      .map((image) => image.src);
    if (this.page.form.value.availableDate) {
      this.item.availableDate = new Date(
        this.page.form.value.availableDate
      ).toISOString();
    }

    this._productService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/product']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  ngOnDestroy(): void { }

  // Switch to the selected tab

  // onImageUpload(event: any, index: number) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('Files', file, file.name);
  //     this._productService.uploadImage(file).subscribe((response) => {
  //       this.images[index].uploaded = true;
  //       this.images[index].src = response[0];
  //       if (this.images.length - 1 === index) {
  //         this.images.push({ uploaded: false, src: null });
  //       }
  //     });
  //   }
  // }

  // Replace image functionality
  replaceImage(index: number) {
    // Reset the image to allow re-uploading
    this.images[index] = { uploaded: false, src: null };
  }

  // Delete image functionality
  deleteImage(index: number) {
    this.images.splice(index, 1);

    // Ensure at least one empty box always exists
    if (
      this.images.length === 0 ||
      !this.images[this.images.length - 1].uploaded
    ) {
      this.images.push({ uploaded: false, src: null });
    }
  }
  onCancel(): void {
    this._router.navigate(['/sites/product']);
  }
  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((item) => {
      item.isSelected = item.ID === tabID;
    });
  }

  loadSubCategories(categoryId: string) {
    this.subCategories = [];
    this._productService.getSubCategories(categoryId).subscribe((res) => {
      if (res.isSuccess) {
        this.subCategories = res.data;
      } else {
        this.subCategories = [];
      }
    });
  }

  onCategoryChange(categoryId: string) {
    this.page.form.patchValue({ categoryId });
    this.subCategories = [];
    this.loadSubCategories(categoryId);
  }


  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }


  onImageUpload(files, index: number): void {
    if (files.length === 0) {
      return;
    }
  
    const file = <File>files[0];
    const formData = new FormData();
    formData.append('Files', file, file.name);  // Use 'Files' as the field name if required by backend
    console.log(formData);
  
    // Call the service to upload the image, passing the FormData directly
    this._productService.uploadImage(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          //this.images[index] = { uploaded: true, src: res.data.path[index] };
          this.images[index] = { uploaded: true, src: res.data.path[index]};

          this._sharedService.showToastr(res);
          //this.addImageBox();
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      },
    });
  }
  
  
  
  // addImageBox() {
  //   this.images.push({ uploaded: false, src: null });
  // }

  getUploadedImages() {
    return this.images.filter(image => image.uploaded).map(image => image.src);
  }

}
