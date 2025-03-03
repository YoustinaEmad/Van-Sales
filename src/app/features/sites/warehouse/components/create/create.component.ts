import { Component, OnDestroy, OnInit } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { warehouseCreateViewModel } from '../../interfaces/warehouse-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { cityViewModel } from '../../../city/interfaces/city';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: warehouseCreateViewModel = new warehouseCreateViewModel();
  id: string;
  cities: cityViewModel[] = [];
  governorateList: governorateViewModel[] = [];
  isActivated: boolean = false;
  WarehouseType = [
    { id: 1, name: "MainBranch" },
    { id: 2, name: "SubBranch" }
  ];
  map: L.Map;
  marker: L.Marker;
  markerLat: string;
  markerLng: string;
  constructor(
    private _sharedService: SharedService,
    private _warehouseService: WarehouseService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });
    forkJoin([
      this._warehouseService.getGovernorates(),
      this._warehouseService.getCities(),
    ]).subscribe((res) => {
      this.governorateList = res[0].data;
      this.cities = res[1].data;

      if (this.page.isEdit) {
        this.getEditableItem();
      } else {
        this.createForm();
      }
    })
  }




  //Region:If Edit page
  getEditableItem() {
    this._warehouseService.getById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        //this.item.warehouseType=res.data.warehouseType
        //this.isActivated = this.item.isActive;
        this.item.id = this.id;
        this.createForm();
      }
    });
  }
  loadCities(governorateId?: string) {
    this.cities = [];
    this._warehouseService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data;
      } else {
        this.cities = [];
      }
    });
  }
  onGovernorateChange(gouvernatateId: string) {
    this.page.form.patchValue({
      cityId: null,
    });
    this.loadCities(gouvernatateId)
  }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      name: [this.item.name, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      code: [this.item.code, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      data: [this.item.data, [Validators.required]],
      warehouseType: [this.item.warehouseType, [Validators.required]],
      governorateId: [this.item.governorateId, [Validators.required]],
      cityId: [this.item.cityId, [Validators.required]],
      street: [this.item.street, [Validators.required]],
      landmark: [this.item.landmark, [Validators.required]],
      latitude: [this.item.latitude, [Validators.required]],
      longitude: [this.item.longitude, [Validators.required]],
      buildingData: [this.item.buildingData, [Validators.required]],

    });



    this.page.isPageLoaded = true;
  }

  initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      return;
    }
  
    // Only initialize the map once
    if (!this.map) {
      // Set initial center and zoom level
      const defaultLat = 26.8206;  // Default Latitude (for example, Egypt's center)
      const defaultLng = 30.8025;  // Default Longitude (for example, Egypt's center)
  
      // Use warehouse coordinates if they are available (in case of edit)
      const markerLat = this.page.isEdit && this.item.latitude && this.item.longitude
        ? +this.item.latitude // Convert to number using the unary plus operator (+)
        : defaultLat;
  
      const markerLng = this.page.isEdit && this.item.latitude && this.item.longitude
        ? +this.item.longitude // Convert to number using the unary plus operator (+)
        : defaultLng;
  
      // Initialize the map
      this.map = L.map(mapContainer).setView([markerLat, markerLng], 6); // Set the map center
  
      // Set up the tile layer (OpenStreetMap tiles)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  
      // Define a custom icon for the marker
      const customIcon = L.icon({
        iconUrl: 'assets/images/marker.png', // Path to your custom marker image
        iconSize: [32, 32], // Set the size of the icon
        iconAnchor: [16, 32], // Anchor the icon at the bottom center
        popupAnchor: [0, -32], // Adjust the popup position relative to the icon
      });
  
      // Create and add a draggable marker with the custom icon at the correct location
      this.marker = L.marker([markerLat, markerLng], { icon: customIcon, draggable: true }).addTo(this.map)
        .bindPopup('Warehouse Location')
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

  getWarehouseTypeName(id: number): string {
    const warehouseType = this.WarehouseType.find(type => type.id === id);
    return warehouseType ? warehouseType.name : 'Unknown'; // Default to 'Unknown' if the id doesn't match any warehouse type
  }
  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    //this.item.isActive = this.isActivated;
    this._warehouseService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/warehouse']);
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
}
