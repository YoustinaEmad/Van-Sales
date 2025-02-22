import { Component, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { discountCreateViewModel } from '../../interfaces/dicount-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DiscountService } from '../../service/discount.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { TabEnum } from '../../interfaces/tab_enum';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: discountCreateViewModel = new discountCreateViewModel();
  id: string | null = null;
  checkedActivation: boolean;
  minStartDate: Date = new Date(); 
  minEndDate: Date = this.minStartDate; 
  disabledDates: Date[] = [];
  selectedTab: TabEnum = TabEnum.GeneralData;
TabEnum = TabEnum;
    Tabs = [
      {
        ID: 1,
        name: 'General Data',
        icon: '/assets/icons/vector.svg',
        selectedIcon: '/assets/icons/vector-colored.svg',
        isSelected: true,
      },
    ];



  validateStartDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; 
  
    const selectedDate = new Date(control.value);
    const today = new Date();
 
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      return { startDateInvalid: 'Start date cannot be before today.' };
    }
    return null; 
  }
  
  discountCategory = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Receipt' },
    { id: 3, name: 'Items' },
    { id: 4, name: 'Quantity' },
  ];

  discountType = [
    { id: 1, name: 'Percentage' },
    { id: 2, name: 'Money' },
  ];

  constructor(
    private _sharedService: SharedService,
    private _discountService: DiscountService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDisabledDates();
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

  validatePastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
  
    const selectedDate = new Date(control.value);
    const today = new Date();
  
    // Reset time parts to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      return { pastDate: 'Please select today or a future date.' };
    }
  
    return null; 
  }
 
  initializeDisabledDates(): void {
    const today = new Date();
    this.disabledDates = [];
  
    // Populate all previous dates
    for (let d = new Date(today); d >= new Date(today.getFullYear(), 0, 1); d.setDate(d.getDate() - 1)) {
      this.disabledDates.push(new Date(d));
    }
  }
  createForm(): void {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.maxLength(100)]],
      discountCategory: [this.item.discountCategory, Validators.required],
      discountType: [this.item.discountType, Validators.required],
      receiptAmount: [
        { value: this.item.receiptAmount, disabled: true },
        Validators.required,
      ],
      amount: [this.item.amount, [Validators.required, Validators.min(1)]],
      startDate: [
        this.item.startDate || new Date(),
        [
          Validators.required,
         this.validatePastDate
        ],
      ],
      endDate: [
        this.item.endDate,
        [
          Validators.required,
          this.endDateValidator.bind(this),
        ],
      ],
      isActive: [this.item.isActive],
      quantity: [this.item.quantity],
    });

    // this.page.form.get('startDate')?.valueChanges.subscribe((startDate) => {
    //   this.minEndDate = new Date(startDate);
    // });
    this.page.form.get('startDate')?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        this.minEndDate = new Date(startDate);
      }
    });

    this.page.form.get('discountCategory')?.valueChanges.subscribe((category) => {
      this.toggleReceiptAmountField(category);
    });

    this.page.isPageLoaded = true;
  }

  toggleReceiptAmountField(category: number): void {
    const receiptAmountControl = this.page.form.get('receiptAmount');
    if (category === 2) {
      receiptAmountControl?.enable();
    } else {
      receiptAmountControl?.disable();
    }
  }

  endDateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = this.page.form?.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateBeforeStart: 'End date must be after start date' };
    }
    return null;
  }


  getEditableItem(): void {
    this._discountService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
this.item.id=this.id;
          this.checkedActivation = this.item.isActive;
          this.createForm();
          this.page.isPageLoaded = true;

        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isPageLoaded = true;

      },
    });
  }

  Save(): void {
    if (this.page.isSaving || this.page.form.invalid) return;

    // if (!this.page.form.valid) {
    //   console.error('Form is invalid!');
    //   return;
    // }

    this.page.isSaving = true;

    Object.assign(this.item, this.page.form.value);
    this.item.startDate = moment(this.item.startDate).format('YYYY-MM-DD');
    this.item.endDate = moment(this.item.endDate).format('YYYY-MM-DD');
    this.item.isActive = this.checkedActivation;

    this._discountService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/discount']);
        }
      },
      error: (err) => {
        this.page.isSaving = false;
        console.error('Error during save:', err);

        if (err.error?.errors?.StartDate) {
          console.error('Backend StartDate Error:', err.error.errors.StartDate[0]);
        }
      },
    });
  }

  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

  onChangeStartDate(event:any){
    console.log(event);
    
    console.log(this.page.form.get('startDate').value);
    if(this.page.form.get('startDate').value<this.page.form.get('endDate').value)
    {
      
      this.page.form.get('endDate').setValue('')
    }
  }
}
