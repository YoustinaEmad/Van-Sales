import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { salesMan } from '../../service/salesMan.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { salesManCreateViewModel } from '../../interfaces/salesMan';
import { Validators, FormGroup } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: salesManCreateViewModel = new salesManCreateViewModel();
  id: string;
  isActivated: boolean = false;
  image = { uploaded: false, src: null };
  areImagesValid: boolean = true;
  warehousesList: any[] = [];
  selectedWarehouseIds: string[] = [];
  isEqualPassword: boolean = true;
  controlType = ControlType;
  environment=environment
  classifies = [
    { id: 1, name: 'Retail' },
    { id: 2, name: 'VIP Clients' },
    { id: 3, name: 'Telesales' },
  ];

  constructor(
    private _sharedService: SharedService,
    private _salesManService: salesMan,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
        this.getEditableItem();
      } else {
        this.createForm();
      }
      this.getWarehouses();
    });
  }


  getEditableItem() {
    this._salesManService.getById(this.id).subscribe((res) => {
      console.log('Editable Item:', res);
      if (res.isSuccess) {
        this.item = res.data;
        this.isActivated = this.item.isActive ?? false;
        this.item.id = this.id;
        this.warehousesList = res.data.warehousesIDs || [];
        if (res.data.path) {
          this.image = { uploaded: true, src: res.data.path };
        }
        this.createForm();
      }
    });
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.maxLength(100)]],
      nationalNumber: [this.item.nationalNumber, [Validators.required, Validators.pattern(/^\d{14}$/)]],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      jobCode: [this.item.jobCode, [Validators.required]],
      email: [this.item.email, [Validators.required, Validators.email]],
      address: [this.item.address, [Validators.required]],
      birthDate: [this.item.birthDate || new Date(), ],

      appointmentDate: [this.item.appointmentDate || new Date(),],
      classification: [this.item.classification, [Validators.required]],
      warehousesIDs: [this.item.warehousesIDs],
      userName: [this.item.userName, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      password: [this.item.password, this.page.isEdit ? [] : [Validators.required]],
      confirmPassword: [this.item.confirmPassword, this.page.isEdit ? [] : [Validators.required]],
      isActive: [this.item.isActive],

    }, { validators: this.passwordMatchValidator });

    this.page.isPageLoaded = true;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { mismatch: true };
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.item.path = this.getUploadedImage() || "";

    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this.item.warehousesIDs = [...this.selectedWarehouseIds];
    this._salesManService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/salesMan']);
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


  validateImages(): boolean {
    return this.image.uploaded;
    
    
  }

  onImageUpload(files: FileList): void {
    if (!files || files.length === 0) {
      return;
    }
  
    const file = files[0];
    const formData = new FormData();
    formData.append('Files', file, file.name); 
  
    this._salesManService.uploadImage(formData).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          console.log('Upload Response:', res);
  
          
          this.image = { uploaded: true, src: Array.isArray(res.data.path) ? res.data.path[0] : res.data.path };
  
          this._sharedService.showToastr(res);
        }
      },
      error: (err) => {
        console.error('Upload Error:', err);
      },
    });
  }
  
  

  getUploadedImage(): string {
    return this.image.uploaded ? this.image.src : this.item.path || "";
  }
  
  

  removeImage(): void {
    this.image = { uploaded: false, src: null };
  }
  


  getWarehouses() {
    this._salesManService.getWarehouses().subscribe((res) => {
      if (res.isSuccess && Array.isArray(res.data)) {
        this.warehousesList = res.data;
        this.cdRef.detectChanges(); 
      }
    });
  }


  onWarehouseSelection(warehouseId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedWarehouseIds.push(warehouseId); 
    } else {
      this.selectedWarehouseIds = this.selectedWarehouseIds.filter(id => id !== warehouseId);
    }


  }
  confirmPassword(): void {
    const password = this.page.form.get('password')?.value;
    const confirmPassword = this.page.form.get('confirmPassword')?.value;

    this.isEqualPassword = password === confirmPassword;
  }
}