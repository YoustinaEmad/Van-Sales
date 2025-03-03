import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GovernorateService } from 'src/app/features/sites/governorates/service/government.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { supplierCreateViewModel } from '../../interfaces/supplier';
import { Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { forkJoin } from 'rxjs';
import { cityViewModel } from '../../../city/interfaces/city';
import * as L from 'leaflet';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  governoratesList: governorateViewModel[] = [];
  cityList:cityViewModel[]=[];
  images = [{ uploaded: false, src: null }];
  classificationList :any[]=[];
  areImagesValid: boolean = true;
  item: supplierCreateViewModel = new supplierCreateViewModel();
  id:string;
  isActivated:boolean=false;
  constructor(
    private _sharedService: SharedService,
    private _supplierService: SupplierService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}
  map: L.Map;
  marker: L.Marker;
 

  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
    forkJoin([
      this._supplierService.getGovernorates(),
      this._supplierService.getCities(),
      this._supplierService.getClassifications(),
    ]).subscribe((res) => {
      this.governoratesList = res[0].data;
      this.cityList=res[1].data;
      this.classificationList=res[2].data;
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    });
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      this.createForm();
    }
  }





  updateLocation(lat: number, lng: number): void {
    this.page.form.patchValue({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    });
  }
  validateImages(): boolean {
    return this.images.some(image => image.uploaded);
    
    
  }
  //Region:If Edit page
  getEditableItem() {
    this._supplierService.getById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        //this.isActivated = this.item.isActive;
        this.item.id=this.id;
        this.createForm();
      }
    });
  }
  
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name,[Validators.required,Validators.minLength(2), Validators.maxLength(200)]],
      code: [this.item.code,[Validators.required]],
      collaborationAdministrator: [this.item.collaborationAdministrator,[Validators.required]], 
      mobile: [this.item.mobile,[Validators.required , Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      address: [this.item.address,[Validators.required]],
      path: [this.item.path,[Validators.required]],
    });
    this.page.isPageLoaded = true;
  }

  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.areImagesValid = this.validateImages();
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.path = this.getUploadedImages()[0] || null;


   // this.item.isActive = this.isActivated;
    this._supplierService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/supplier']);
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

  loadCities(governorateId?: string) {
    this.cityList = [];
    this._supplierService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cityList = res.data; 
      } else {
        this.cityList = []; 
      }
    });
  }
 

  onGovernorateChange(gouvernatateId: string) {
    this.page.form.patchValue({
      cityId: null, 
    });
    this.loadCities(gouvernatateId)
  }




  onImageUpload(files, index: number): void {
    if (files.length === 0) {
      return;
    }

    const file = <File>files[0];
    const formData = new FormData();
    formData.append('Files', file, file.name);  // Use 'Files' as the field name if required by backend

    // Call the service to upload the image, passing the FormData directly
    this._supplierService.uploadImage(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          //this.images[index] = { uploaded: true, src: res.data.path[index] };
          this.images[index] = { uploaded: true, src: res.data.path[index] };

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

  // ngAfterViewInit(): void {
  //   // Ensure that the map container is present before calling initMap
  //   this.waitForMapContainer()
  //     .then(() => this.initMap())
  //     .catch(() => console.error('Map container still not found.'));
  // }

  // // Wait for the map container to be available in the DOM
  // waitForMapContainer(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const checkInterval = setInterval(() => {
  //       const mapContainer = document.getElementById('map');
  //       if (mapContainer) {
  //         clearInterval(checkInterval);
  //         resolve();
  //       }
  //     }, 50); // Check every 50ms

  //     // Timeout after 2 seconds if the container is still not found
  //     setTimeout(() => {
  //       clearInterval(checkInterval);
  //       reject();
  //     }, 2000);
  //   });
  // }

  // initMap(): void {
  //   const mapContainer = document.getElementById('map');
  //   if (!mapContainer) {
  //     return;
  //   }

  //   // Only initialize the map once
  //   if (!this.map) {
  //     this.map = L.map(mapContainer).setView([26.8206, 30.8025], 6); // Center the map on Egypt and set zoom level

  //     // Set up the tile layer (OpenStreetMap tiles)
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     }).addTo(this.map);

  //     // Define a custom icon for the marker
  //     const customIcon = L.icon({
  //       iconUrl: 'assets/images/marker.png', // Path to the custom marker image
  //       iconSize: [32, 32], // Set the size of the icon
  //       iconAnchor: [16, 32], // Anchor the icon at the bottom center
  //       popupAnchor: [0, -32], // Adjust the popup position relative to the icon
  //     });

  //     // Create and add a draggable marker with the custom icon at Egypt's coordinates
  //     this.marker = L.marker([26.8206, 30.8025], { icon: customIcon, draggable: true }).addTo(this.map)
  //       .bindPopup('A sample marker in Egypt')
  //       .openPopup();

  //     // Update latitude and longitude when the marker is dragged
  //     this.marker.on('dragend', (event) => {
  //       const newLatLng = event.target.getLatLng();
  //       this.page.form.patchValue({
  //         latitude: newLatLng.lat,
  //         longitude: newLatLng.lng
  //       });
  //     });

  //     // Update latitude and longitude when the map is clicked
  //     this.map.on('click', (event) => {
  //       const { lat, lng } = event.latlng;
  //       this.page.form.patchValue({
  //         latitude: lat,
  //         longitude: lng
  //       });
  //       this.marker.setLatLng([lat, lng]); // Update marker position
  //     });

  //     this.map.invalidateSize(); // Forces Leaflet to recalculate the map size
  //   }
  // }
}
