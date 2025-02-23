import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from 'src/app/features/auth/service/authservice.service';
import { RegisterViewModel } from 'src/app/features/auth/interfaces/authviewmodel';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { governorateSelectedItem } from 'src/app/features/sites/city/interfaces/city';
import { Router } from '@angular/router';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { environment } from 'src/environments/environment';

import * as L from 'leaflet';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  map: L.Map;
  marker: L.Marker;
  governorates: governorateSelectedItem[] = [];
  isEqualPassword: boolean = true;
  isSubmitting: boolean = false;
  images = [{ uploaded: false, src: null }];
  item: RegisterViewModel;
  controlType = ControlType;
  environment = environment;
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ];
  customerActivity = [
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ];

  cities: { value: number; label: string }[] = [];

  constructor(
    private authService: AuthserviceService,
    private _sharedService: SharedService,
    private _cityService: CityService,
    private _companyService: CompanyService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadGovernorates();
    this.loadCities();
    this.initializeMap();

  }

  initializeMap() {
    // Set default coordinates
    const defaultLat = 30.0444; // Cairo Latitude
    const defaultLng = 31.2357; // Cairo Longitude
  
    // Initialize the map
    const map = L.map('map').setView([defaultLat, defaultLng], 13);
  
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Define a custom icon for the marker
    const customIcon = L.icon({
      iconUrl: 'assets/images/marker.png', // Replace with your custom marker image URL
      iconSize: [32, 32], // Set the size of the icon
      iconAnchor: [16, 32], // Anchor the icon at the bottom center
      popupAnchor: [0, -32], // Adjust the popup position relative to the icon
    });
  
    // Add a marker with the custom icon
    const marker = L.marker([defaultLat, defaultLng], { icon: customIcon, draggable: true }).addTo(map);
  
    // Update form values on marker drag
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      this.registerForm.patchValue({
        latitude: position.lat.toFixed(6),
        longitude: position.lng.toFixed(6),
      });
    });
  
    // Center the map on marker drag
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      this.registerForm.patchValue({
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      });
    });
  }


initializeForm(): void {
  this.registerForm = this._sharedService.formBuilder.group({
    nationalNumber: ['', [Validators.pattern(/^\d{14}$/)]],
    name: ['', Validators.required],
    userName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
    age: [],
    gender: [],
    governorateId: [null, Validators.required],
    cityId: [null, Validators.required],
    street: ['', Validators.required],
    landmark: [''],
    latitude: [0],
    longitude: [0],
    email: ['', [ Validators.email]],
    phone: [''],
    clientActivity: [],
    buildingData: ['', [Validators.required]]
  });
}
loadGovernorates() {
  this._cityService.getGovernorates().subscribe((res) => {
    if (res.isSuccess) {
      this.governorates = res.data;
    }
  });
}

loadCities(governorateId ?: string) {
  if (governorateId) {
    // Load cities for the selected governorate
    this._companyService.getCities(governorateId).subscribe((res) => {
      if (res.isSuccess) {
        this.cities = res.data;
      } else {
        this.cities = []; // Reset cities if there's an error
      }
    });
  } else {
    // Load all cities if no governorate is selected
    this._companyService.getCities().subscribe((res) => {
      if (res.isSuccess) {
        this.cities = res.data;
      } else {
        this.cities = []; // Reset cities if there's an error
      }
    });
  }
}

onGovernorateChange(governorateId: string): void {
  // Reset the city field when the governorate changes
  this.registerForm.patchValue({
    cityId: '', // Clear the city selection
  });

  // Load cities based on the selected governorate or all cities if no governorate
  this.loadCities(governorateId);
}

confirmPassword(): void {
  const password = this.registerForm.get('password')?.value;
  const confirmPassword = this.registerForm.get('confirmPassword')?.value;

  if(password !== confirmPassword) {
  this.isEqualPassword = false;
} else {
  this.isEqualPassword = true;
}
  }

onSubmit(): void {
  if(!this.registerForm.valid ||this.isSubmitting ) return;
  this.isSubmitting = true; // Disable the button immediately

  const registerData: RegisterViewModel = this.registerForm.value;
  registerData.paths = this.getUploadedImages();
  this.authService.setRegister(registerData).subscribe({
    next: (response) => {
      this.isSubmitting = false;
      this._sharedService.showToastr(response);
      this.isSubmitting=false;

      if (response.data != null) {
        localStorage.setItem('rToken', response.data.otPtoken);
        this._router.navigate(['/auth/otp'], {
          queryParams: { source: 'register' },
        });
        this.isSubmitting = false; // Re-enable button after successful login

      }

    },
    error: (error) => {
      this.isSubmitting = false;
      this._sharedService.showToastr(error);
    },
  });
}


numberOnly(event: any) {
  return this._sharedService.numberOnly(event);
}

onImageUpload(files, index: number): void {
  if(files.length === 0) {
  return;
}
const file = <File>files[0];
const formData = new FormData();
formData.append('Files', file, file.name);  // Use 'Files' as the field name if required by backend
console.log(formData);
// Call the service to upload the image, passing the FormData directly
this.authService.uploadImage(formData).subscribe({
  next: (res) => {
    if (res.isSuccess) {
      console.log(res);
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
isImageUploaded(): boolean {
  return this.images.some(image => image.uploaded); // Returns true if at least one image is uploaded
}

}
