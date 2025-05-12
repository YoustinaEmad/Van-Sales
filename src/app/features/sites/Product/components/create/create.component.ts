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
import { TranslateService } from '@ngx-translate/core';

export function validateMaxMin(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const min = group.get('minimumQuantity')?.value;
    const max = group.get('maximumQuantity')?.value;

    return max !== null && min !== null && max < min
      ? { maxLessThanMin: true }
      : null;
  };
}


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
  //isActivated: boolean = false;
  //isActivatedPoint:boolean=false;
  //isFeatured: boolean = false;
  //selectedItem: productViewModel;
  categories: categorySelectedItem[] = [];
  ProductAPI: any[] = [];
  Brands: any[] = [];
  productGroup: brandSelectedItem[] = [];
  selectedCategoryId: string = '';
  selectedTab: TabEnum = TabEnum.GeneralData;
  TabEnum = TabEnum;
  minStartDate: Date = new Date();
  environment = environment;
  // Tabs definition
  ProductUnitList = [
    { id: 1, name: 'Cartoon' },
    { id: 2, name: 'Drum' },
    { id: 3, name: 'Pail' }
  ];
  Grade = [
    { id: 1, name: 'HighGrade' },
    { id: 2, name: 'LowGrade' },
  ]
  ProductStatus=
  [
    { id: 1, name: 'Available' },
    { id: 2, name: 'Unavailable' },
    
  ]

  // Tabs = [
  //   {
  //     ID: 1,
  //     name: 'General Data',
  //     icon: '/assets/icons/vector.svg',
  //     selectedIcon: '/assets/icons/vector.svg',
  //     isSelected: true,
  //   },

  //   {
  //     ID: 2,
  //     name: 'Price',
  //     icon: '/assets/icons/price.svg',
  //     selectedIcon: '/assets/icons/price.svg',
  //     isSelected: false,
  //   },

  //   {
  //     ID: 3,
  //     name: 'Other Data',
  //     icon: '/assets/icons/daimantion.svg',
  //     selectedIcon: '/assets/icons/daimantion.svg',
  //     isSelected: false,
  //   },
  // ];
Tabs:any[]=[];
  // Variable to hold the uploaded image
  selectedImage: string | null = null;

  constructor(
    private _sharedService: SharedService,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this.translate.get([
      'sites.product.generalData',
      'sites.product.price',
      'sites.product.otherData'
    ]).subscribe(translations => {
      this.Tabs = [
        {
          ID: 1,
          name: translations['sites.product.generalData'],
          icon: '/assets/icons/vector.svg',
          selectedIcon: '/assets/icons/vector.svg',
          isSelected: true,
        },
        {
          ID: 2,
          name: translations['sites.product.price'],
          icon: '/assets/icons/price.svg',
          selectedIcon: '/assets/icons/price.svg',
          isSelected: false,
        },
        {
          ID: 3,
          name: translations['sites.product.otherData'],
          icon: '/assets/icons/daimantion.svg',
          selectedIcon: '/assets/icons/daimantion.svg',
          isSelected: false,
        }
      ];
    });
    this.getAllBrands();
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
        
      }
    });

    forkJoin([
      this._productService.getCategories(),
      this._productService.getProductGroup(),
    ]).subscribe((res) => {
      this.categories = res[0].data;
      this.productGroup = res[1].data;
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    });
  }

  getEditableItem() {
    this._productService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          this.item = res.data;
          //this.isActivated = res.data.isActive;
          //this.isActivatedPoint=res.data.isActivePoint;
          //this.isFeatured=res.data.featuredProduct;
          this.item.id = this.id;
          // this.item.availableDate =
          //   this.item.availableDate || new Date().toISOString();
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

    // Reset time parts to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { pastDate: 'sites.product.futureDate' };
    }

    return null;
  }



  createForm() {
    const validators = this.page.isEdit
      ? []
      : [maxGreaterThanMinValidator(), quantityInRangeValidator()];
    this.page.form = this._sharedService.formBuilder.group(
      {
        name: [this.item.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        code: [this.item.code, [Validators.required, Validators.maxLength(50)]],
        smallerUnitsOfMeasurements: [this.item.smallerUnitsOfMeasurements, [Validators.required, Validators.min(1)]],
        wholesalePrice: [this.item.wholesalePrice || '', Validators.required],
        retailPrice: [this.item.retailPrice, [Validators.required, Validators.min(1)]],
        numOfUnitPerCartoon: [this.item.numOfUnitPerCartoon, [Validators.required, Validators.min(1)]],
        vipClientsPrice: [this.item.vipClientsPrice, [Validators.required, Validators.min(1)]],
        safetyStocks: [this.item.safetyStocks, [Validators.required, Validators.min(1)]],
        packSize: [this.item.packSize, [Validators.required, Validators.min(1)]],
        netWeightPerLitre: [this.item.netWeightPerLitre, [Validators.required, Validators.min(1)]],
        weightPerKG: [this.item.weightPerKG, [Validators.required, Validators.min(1)]],
        expiryDate: [
          this.item.expiryDate || new Date(),
          [
            Validators.required,
            this.validatePastDate
          ],
        ],
        unit: [this.item.unit, Validators.required],
        grade: [this.item.grade, Validators.required],
         brandID: [this.item.brandID, Validators.required],
        productStatus: [this.item.productStatus, [Validators.required] ],
        categoryID: [this.item.categoryID, Validators.required],
        productGroupID: [this.item.productGroupID, [Validators.required]],
        productAPI: [this.item.productAPI, [Validators.required]],

      },
      { validators }
    );

    this.page.isPageLoaded = true;
  }
  


  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    //this.item.availableDate = moment(this.item.availableDate).format('YYYY-MM-DD');
    //this.item.isActive = this.isActivated;
    //this.item.isActivePoint=this.isActivatedPoint;
    //this.item.featuredProduct=this.isFeatured;
    // this.item.paths = this.images
    //   .filter((image) => image.uploaded)
    //   .map((image) => image.src);
    // if (this.page.form.value.availableDate) {
    //   this.item.availableDate = new Date(
    //     this.page.form.value.availableDate
    //   ).toISOString();
    // }

    this._productService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          console.log(res)
          this._router.navigate(['/sites/product']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  ngOnDestroy(): void { }

  onCancel(): void {
    this._router.navigate(['/sites/product']);
  }
  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((item) => {
      item.isSelected = item.ID === tabID;
    });
  }
getAllBrands() {
    this._productService.getBrands().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.Brands = res.data;
        } 
      }
    });
  }
  
  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

}
