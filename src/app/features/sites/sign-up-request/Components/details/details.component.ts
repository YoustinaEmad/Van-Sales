import { Component, ViewChild } from '@angular/core';
import { detailsSignUpRequestViewModel, RejectReasonViewModel, signUpRequestViewModel } from '../../interfaces/sign-up-request';
import { SignUpRequestService } from '../../service/sign-up-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as L from 'leaflet';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
 item: detailsSignUpRequestViewModel = new detailsSignUpRequestViewModel();
  id: string;
  selectedItem: RejectReasonViewModel=new RejectReasonViewModel();
  modalRef: BsModalRef;
map: L.Map;
  marker: L.Marker;
  long:number=0;
  lat:number=0;
  constructor(
    private _sharedService: SharedService,
    private _profileRequestService: SignUpRequestService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];
  customerActivity=[
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ]

  getEditableItem() {
    this._profileRequestService.getDetailsById(this.id).subscribe((res) => {
      if (res.isSuccess) {
        this.item = res.data;
        //this.item.id = this.id;

      }
    });
  }

  ngOnInit(): void {
    //this.page.isPageLoaded = false;
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
      }
    });

    this.getEditableItem();
  }
  navigateBack(): void {
    this._router.navigate(['/sites/signUpRequest']); 
  }

  approveRequest(item: signUpRequestViewModel, newStatus: string) {
    this._profileRequestService.Approved(item.id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this._sharedService.showToastr(response); 
        }
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      }
    })
  }

  @ViewChild('confirmRejectTemplate', { static: false }) confirmRejectTemplate: any;
  showRejectConfirmation(Item:signUpRequestViewModel) {
    this.selectedItem = new RejectReasonViewModel();
    this.selectedItem.id=Item.id;
    this.modalRef = this._sharedService.modalService.show(this.confirmRejectTemplate, { class: 'modal-sm' });
  }

  rejectRequest(item: signUpRequestViewModel, newStatus: string) {
    this._profileRequestService.Rejected(this.selectedItem).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this._sharedService.showToastr(response);
        }
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      }
    })
  }

  get genderName(): string {
    return this.genderOptions.find(g => g.id === this.item.gender)?.name || 'Unknown';
  }
  get clientActivityName(): string {
    return this.customerActivity.find(g => g.id === this.item.clientActivity)?.name || 'Unknown';
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
      const defaultLat = this.item.latitude; // Latitude (e.g., Cairo)
      const defaultLng = this.item.longitude; // Longitude (e.g., Cairo)
  
      // Initialize the map
      this.map = L.map('map', {
        center: [defaultLat, defaultLng], // Center of the map
        zoom: 13, // Zoom level
        zoomControl: false, // Disable zoom controls
        dragging: false, // Disable dragging
        scrollWheelZoom: false, // Disable zoom with scroll wheel
        doubleClickZoom: false, // Disable double-click zoom
        touchZoom: false, // Disable touch zoom
        keyboard: false, // Disable keyboard interactions
      });
  
      // Add the tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
  
      // Add a custom marker
      const customIcon = L.icon({
        iconUrl: 'assets/images/marker.png', // Path to custom marker image
        iconSize: [32, 32], // Size of the marker icon
        iconAnchor: [16, 32], // Anchor point of the marker
        popupAnchor: [0, -32], // Popup position relative to the marker
      });
  
      L.marker([defaultLat, defaultLng], { icon: customIcon, draggable: false }).addTo(this.map);
    }
}
