import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { brandCreateViewModel } from '../../interfaces/brand';
import { SharedService } from 'src/app/shared/service/shared.service';
import { BrandService } from '../../service/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy  {


  page: CRUDCreatePage = new CRUDCreatePage();
  item: brandCreateViewModel = new brandCreateViewModel();
  id:string;
  images = [{ uploaded: false, src: null }];
  isActivated:boolean=false;
environment=environment
  constructor(
    private _sharedService: SharedService,
    private _brandService: BrandService,
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
    this._brandService.getById(this.id).subscribe((res) => {
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
      name: [this.item.name,[Validators.required,Validators.minLength(2),Validators.maxLength(200)]],
      tags:[this.item.tags]
    });
    this.page.isPageLoaded = true;
  }

  Save() {
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.isActive = this.isActivated;
    this.item.paths = this.getUploadedImages();  // Use the method to get all the uploaded image paths

    //this.item.paths = this.getUploadedImages();
    // this.item.paths = this.images
    //    .filter((image) => image.uploaded)
    //    .map((image) => image.src);
    this.item.paths = this.images.filter((image) => image.uploaded).map((image) => image.src);
    this._brandService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/brand']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  ngOnDestroy(): void {}

  onImageUpload(files, index: number): void {
    if (files.length === 0) {
      return;
    }
  
    const file = <File>files[0];
    const formData = new FormData();
    formData.append('Files', file, file.name);  // Use 'Files' as the field name if required by backend
    console.log(formData);
  
    // Call the service to upload the image, passing the FormData directly
    this._brandService.uploadImage(formData).subscribe({
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
