import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../service/customers.service';
import { customerCreateViewModel, customerSelectedViewModel } from '../../interfaces/customers';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ApiService } from 'src/app/shared/service/api.service';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { forkJoin } from 'rxjs';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: customerCreateViewModel = new customerCreateViewModel();
  governorates: customerSelectedViewModel[] = [];
  cities: customerSelectedViewModel[] = [];
  clientGroups: customerSelectedViewModel[] = [];
  selectedGovernorateId?: string = '';
  images = [{ uploaded: false, src: null }];
  controlType = ControlType;
  environment = environment;
  areImagesValid: boolean = true;

  isEqualPassword: boolean = true;
  id: string;
  map: L.Map;
  marker: L.Marker;

  customerActivity = [
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ]
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];
  constructor(private _router: Router, private _customersService: CustomersService, private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute, private _apiService: ApiService, private _cityService: CityService, private _companyService: CompanyService
  ) {

  }

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
      this._companyService.getCities(),
      this._customersService.getClientGroups()
    ]).subscribe((res) => {
      this.governorates = res[0].data
      this.cities = res[1].data
      this.clientGroups = res[2].data
      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }


    }

    )
  }


  updateLocation(lat: number, lng: number): void {
    this.page.form.patchValue({
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    });
  }

  getEditableItem() {
    this._customersService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;
          this.editeform();
          this.page.isPageLoaded = true;
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isPageLoaded = true;
      }
    });
  }
  editeform() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      nationalNumber: [this.item.nationalNumber, [ Validators.pattern(/^\d{14}$/)]],
      age: [this.item.age],
      userName: [this.item.userName, [Validators.required]],
      gender: [this.item.gender],
      email: [this.item.email, [Validators.email, ]],
      mobile: [this.item.mobile, [Validators.required, , Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      phone: [this.item.phone],
      clientGroupId: [this.item.clientGroupId],
      clientActivity: [this.item.clientActivity],

    });
    this.page.isPageLoaded = true;

  }
  validateImages(): boolean {
    return this.images.some(image => image.uploaded);
    
    
  }
  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      nationalNumber: [
        this.item.nationalNumber,
        [ Validators.pattern(/^\d{14}$/)]
      ],
      age: [this.item.age],
      gender: [this.item.gender],
      userName: [this.item.userName, [Validators.required]],
      password: [
        this.item.password,
        [Validators.required, Validators.minLength(8), Validators.maxLength(100)]
      ],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      phone: [this.item.phone],

      governorateId: [this.item.governorateId, [Validators.required]],
      cityId: [this.item.cityId, [Validators.required]],
      street: [this.item.street, [Validators.required]],
      landmark: ['', [Validators.required]],
      latitude: [0],
      longitude: [0],
      buildingData: [this.item.buildingData, [Validators.required]],
      email: [this.item.email, [Validators.email]],
      confirmPassword: [
        this.item.confirmPassword,
        [Validators.required]
      ],
      clientGroupId: [this.item.clientGroupId],
      clientActivity: [this.item.clientActivity],
    });
    this.page.isPageLoaded = true;
  }


  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.areImagesValid = this.validateImages(); // Validate images before saving

    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this.item.paths = this.getUploadedImages();
    this._customersService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/salesflow/customers']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }

  onGovernorateChange(governorateId: string) {
    this.page.form.patchValue({
      cityId: null,
    });
    this.loadCities(governorateId)
  }

  loadCities(governorateId?: string) {
    this.cities = [];
    this._customersService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data;
      } else {
        this.cities = [];
      }
    });
  }

  confirmPassword(): void {
    const password = this.page.form.get('password')?.value;
    const confirmPassword = this.page.form.get('confirmPassword')?.value;

    this.isEqualPassword = password === confirmPassword;
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

    // Call the service to upload the image, passing the FormData directly
    this._customersService.uploadImage(formData).subscribe({
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

  ngAfterViewInit(): void {
    // Ensure that the map container is present before calling initMap
    this.waitForMapContainer()
      .then(() => this.initMap())
      .catch(() => console.error('Map container still not found.'));
  }

  // Wait for the map container to be available in the DOM
  waitForMapContainer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50); // Check every 50ms

      // Timeout after 2 seconds if the container is still not found
      setTimeout(() => {
        clearInterval(checkInterval);
        reject();
      }, 2000);
    });
  }

  initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      return;
    }

    // Only initialize the map once
    if (!this.map) {
      this.map = L.map(mapContainer).setView([26.8206, 30.8025], 6); // Center the map on Egypt and set zoom level

      // Set up the tile layer (OpenStreetMap tiles)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Define a custom icon for the marker
      const customIcon = L.icon({
        iconUrl: 'assets/images/marker.png', // Path to the custom marker image
        iconSize: [32, 32], // Set the size of the icon
        iconAnchor: [16, 32], // Anchor the icon at the bottom center
        popupAnchor: [0, -32], // Adjust the popup position relative to the icon
      });

      // Create and add a draggable marker with the custom icon at Egypt's coordinates
      this.marker = L.marker([26.8206, 30.8025], { icon: customIcon, draggable: true }).addTo(this.map)
        .bindPopup('A sample marker in Egypt')
        .openPopup();

      // Update latitude and longitude when the marker is dragged
      this.marker.on('dragend', (event) => {
        const newLatLng = event.target.getLatLng();
        this.page.form.patchValue({
          latitude: newLatLng.lat,
          longitude: newLatLng.lng
        });
      });

      // Update latitude and longitude when the map is clicked
      this.map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        this.page.form.patchValue({
          latitude: lat,
          longitude: lng
        });
        this.marker.setLatLng([lat, lng]); // Update marker position
      });

      this.map.invalidateSize(); // Forces Leaflet to recalculate the map size
    }
  }
  changePassword() {
    this._router.navigate(['/salesflow/customers/changePassword']);
  }


  navigateToChangePassword(clientId: string): void {
    if (clientId) {
      this._router.navigate(['/salesflow/customers/changePassword', clientId]);
    } else {
      console.error('Client ID is missing or invalid.');
    }
  }



}