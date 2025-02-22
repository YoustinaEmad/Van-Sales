import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { cityViewModel } from 'src/app/features/sites/city/interfaces/city';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { governorateViewModel } from 'src/app/features/sites/governorates/interfaces/governorate';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GetShippingAddressesForClientViewModel, CreateShippingAddressViewModel, EditShippingAddressViewModel } from '../../../models/order.model';
import { WebsiteService } from '../../../services/website.service';
import { Validators } from '@angular/forms';
import * as L from 'leaflet';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styleUrls: ['./new-address.component.css']
})
export class NewAddressComponent {
  shippingAddresses: GetShippingAddressesForClientViewModel[] = [];
  clientId :string;
  governorates: governorateViewModel[] = [];
  cities: cityViewModel[] = [];
  map: L.Map;
  isEditMode = false;
  marker: L.Marker;
  page: CRUDCreatePage = new CRUDCreatePage();
  item: CreateShippingAddressViewModel = new CreateShippingAddressViewModel();
controlType = ControlType;
  constructor(
    public websiteService: WebsiteService,
    public _cityService: CityService,
    public _companyService: CompanyService,
    public _sharedService: SharedService,
    public _router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getClientIdFromToken();
    forkJoin([
      this._cityService.getGovernorates(),
      this._companyService.getCities(),
    ]).subscribe((res) => {
      this.governorates = res[0].data;
      this.cities = res[1].data;
    });
    this.route.queryParams.subscribe((params) => {
      const addressId = params['id'];
      this.isEditMode = !!addressId;
      if (this.isEditMode) {
        this.loadAddressForEditing(addressId);
      }
    });
    this.createForm();
    

  }
  getClientIdFromToken() {
    const token = localStorage.getItem('eToken'); // Assuming the token is stored in localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the token
        this.clientId = decodedToken.ID; // Extract the client ID using the correct key
      } catch (error) {
      }
    } else {
    }
  }




  loadAddressForEditing(addressId: string): void {
    this.websiteService.getShippingAddressById(addressId).subscribe({
      next: (res) => {
        const address = res.data;
        this.page.form.patchValue({
          governorateId: address.governorateId,
          cityId: address.cityId,
          street: address.street,
          landmark: address.landmark,
          latitude: address.latitude,
          longitude: address.longitude,
          buildingData: address.buildingData,
        });
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      },
    });
  }
  


  loadCities(governorateId?: string) {
    this.cities = [];
    this._companyService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data;
      } else {
        this.cities = [];
      }
    });
  }

  onGovernorateChange(governorateId: string) {
    this.page.form.patchValue({
      cityId: null,
    });
    this.loadCities(governorateId);
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      governorateId: [this.item?.governorateId || '', Validators.required],
      cityId: [this.item?.cityId || '', Validators.required],
      street: [this.item?.street || '', Validators.required],
      buildingData: [this.item?.buildingData || '', Validators.required],
      landmark: [this.item?.landmark || '', Validators.required],
      isDefualt: [this.item?.isDefualt || false],
      latitude: [this.item?.latitude || 0, [ Validators.min(-90), Validators.max(90)]],
      longitude: [this.item?.longitude || 0, [ Validators.min(-180), Validators.max(180)]],
    });
  }


  
  saveAddress() {
    if (this.page.form.invalid) {
      this.page.form.markAllAsTouched();
      return;
    }

    

    const shippingAddress: CreateShippingAddressViewModel = {
      governorateId: this.page.form.get('governorateId')?.value,
      cityId: this.page.form.get('cityId')?.value,
      street: this.page.form.get('street')?.value,
      landmark: this.page.form.get('landmark')?.value,
      latitude: this.page.form.get('latitude')?.value,
      longitude: this.page.form.get('longitude')?.value,
      clientId: this.clientId,
     
      buildingData: this.page.form.get('buildingData')?.value,
    };



    const editedShippingAddress: EditShippingAddressViewModel = {
      id:this.route.snapshot.queryParams['id'],
      governorateId: this.page.form.get('governorateId')?.value,
      cityId: this.page.form.get('cityId')?.value,
      street: this.page.form.get('street')?.value,
      landmark: this.page.form.get('landmark')?.value,
      latitude: this.page.form.get('latitude')?.value,
      longitude: this.page.form.get('longitude')?.value,
      buildingData: this.page.form.get('buildingData')?.value,
    };

   

    if (this.route.snapshot.queryParams['id']) {
      editedShippingAddress.id = this.route.snapshot.queryParams['id'];
      this.websiteService.EditShippingAddress(editedShippingAddress).subscribe({
        next: (res) => {
          this._sharedService.showToastr(res);
          this._router.navigate(['/address']);
        },
        error: (err) => {
          this._sharedService.showToastr(err);
        },
      });
    } else {
      this.websiteService.AddShippingAddress(shippingAddress).subscribe({
        next: (res) => {
          this._sharedService.showToastr(res);
          this._router.navigate(['/address']);
        },
        error: (err) => {
          this._sharedService.showToastr(err);
        },
      });
    }


   
  }

  ngAfterViewInit(): void {
    this.waitForMapContainer()
      .then(() => this.initMap())
      .catch(() => console.error('Map container still not found.'));
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined; // Set map reference to undefined
    }
  }

  waitForMapContainer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject();
      }, 2000);
    });
  }

  async initMap(): Promise<void> {
    try {
      this.cdRef.detectChanges();

      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }

      if (!this.map) {
        this.map = L.map(mapContainer).setView([26.8206, 30.8025], 6); // Center on Egypt
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        const customIcon = L.icon({
          iconUrl: 'assets/images/marker.png', // Path to the custom marker image
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        // Create marker with default position
        this.marker = L.marker([26.8206, 30.8025], { icon: customIcon, draggable: true }).addTo(this.map)
          .bindPopup('A sample marker in Egypt')
          .openPopup();

        // Map click handler to update marker and form
        this.map.on('click', (event) => {
          const { lat, lng } = event.latlng;

          this.marker.setLatLng([lat, lng]);

          // Set latitude and longitude values in the form inputs
          this.page.form.get('latitude')?.setValue(lat);
          this.page.form.get('longitude')?.setValue(lng);
        });

        // Marker dragend handler to update form values
        this.marker.on('dragend', (event) => {
          const newLatLng = event.target.getLatLng();
          
          this.page.form.get('latitude')?.setValue(newLatLng.lat);
          this.page.form.get('longitude')?.setValue(newLatLng.lng);
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  
  onCancel(): void {
    this._router.navigate(['/address']);
  }
}
