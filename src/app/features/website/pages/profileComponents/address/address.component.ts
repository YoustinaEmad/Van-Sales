import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { cityViewModel } from 'src/app/features/sites/city/interfaces/city';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { governorateViewModel } from 'src/app/features/sites/governorates/interfaces/governorate';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GetShippingAddressesForClientViewModel, CreateOrderByClientViewModel, CreateShippingAddressViewModel, EditShippingAddressViewModel } from '../../../models/order.model';
import { WebsiteService } from '../../../services/website.service';
import { setDefaultShippingAddressViewModel } from '../../../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
   shippingAddresses: GetShippingAddressesForClientViewModel[] = [];
    clientId :string; 
    defaultShippingAddressId: string | null = null;
    editableAddress: any = null;
    isEditing: boolean = false;
    governorates: governorateViewModel[] = [];
    cities: cityViewModel[] = [];
    page: CRUDCreatePage = new CRUDCreatePage();
    item: CreateOrderByClientViewModel = new CreateOrderByClientViewModel();
    shippingAddressId: string = null;
    selectedAddress: GetShippingAddressesForClientViewModel | null = null;
    isAddingNewAddress: boolean = false;
    newShippingAddress: CreateShippingAddressViewModel = new CreateShippingAddressViewModel();
    shippingAddressStatuslist = [
      {id:1,name:'Pending'},
      { id: 2, name: 'Approved' },
      { id: 3, name: 'Rejected' },
      
    ];
    constructor(
      public websiteService: WebsiteService,
      public _cityService: CityService,
      public _companyService: CompanyService,
      public _sharedService: SharedService,
      public _router: Router
    ) { }
  
    ngOnInit(): void {
      this.page.isPageLoaded=true;
      this.getClientIdFromToken();
      forkJoin([
        this._cityService.getGovernorates(),
        this._companyService.getCities(),
        this.websiteService.getAllShippingAdresses(this.clientId),
        this.getDefaultShippingAddress(),
      ]).subscribe((res) => {
        this.governorates = res[0].data;
        this.cities = res[1].data;
        this.shippingAddresses=res[2].data;
        const defaultAddressResponse = res[3]; 
        this.defaultShippingAddressId=defaultAddressResponse.data.id;
      });
     
      this.loadShippingAddresses(this.clientId);
      
    }
    getDefaultShippingAddress() {
      this.page.isPageLoaded=true;
      return this.websiteService.getDefaultShippingAddress(this.clientId);
    }
  
    setDefaultShippingAddress(body:setDefaultShippingAddressViewModel) {
      return this.websiteService.setDefaultShippingAddress(body);
    }
 
    onAddressSelectionChange(address: GetShippingAddressesForClientViewModel): void {
      if (this.selectedAddress && this.selectedAddress.id !== address.id) {
        this.page.isPageLoaded=true;
        const body: setDefaultShippingAddressViewModel = {
          iD: address.id,        
          clientId: this.clientId 
        };
        this.websiteService.setDefaultShippingAddress(body).subscribe({
          next: (res) => {
            this.defaultShippingAddressId = address.id;
            this.selectedAddress = address; 
            this.markDefaultAddress();
            this._sharedService.showToastr(res);
          
          },
          error: (err) => {
            this._sharedService.showToastr(err);
          
          },
        });
      }
    }
    
 
    markDefaultAddress() {
      if (this.defaultShippingAddressId) {
        this.page.isPageLoaded=true;
        this.shippingAddresses.forEach(address => {
          address.isDefault = address.id === this.defaultShippingAddressId;
        });
      }
    }
    
    loadShippingAddresses(clientId: string) {
      this.websiteService.getAllShippingAdresses(clientId).subscribe({
        next: (res) => {
          if (res && res.data && Array.isArray(res.data)) {
            this.shippingAddresses = res.data;
            this.selectedAddress = this.shippingAddresses.find(
          (address) => address.id === this.defaultShippingAddressId
        );
          } else {
            console.error('No valid data in the response or data is not an array');
          }
        },
        error: (err) => {
          console.error('Error fetching shipping addresses:', err);
          this._sharedService.showToastr(err);
        },
      });
    }
    
    getShippingAddressStatusName(statusId: number): string {
      const status = this.shippingAddressStatuslist.find(s => s.id === Number(statusId));
      return status ? status.name : 'Unknown';
    }


    onCancel(): void {
      this._router.navigate(['/profile']);
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



    editAddress(address: GetShippingAddressesForClientViewModel): void {
      this._router.navigate(['/newAddress'], { queryParams: { id: address.id } });
    }
    
    
    onSubmitEditForm(): void {
      if (this.editableAddress) {
        const body: EditShippingAddressViewModel = {
          id: this.editableAddress.id,
          governorateId: this.editableAddress.governorateId,
          cityId: this.editableAddress.cityId,
          street: this.editableAddress.street,
          landmark: this.editableAddress.landmark || '',
          latitude: this.editableAddress.latitude || 0,
          longitude: this.editableAddress.longitude || 0,
          buildingData: this.editableAddress.buildingData || '',
        };
    
        this.websiteService.EditShippingAddress(body).subscribe({
          next: (res) => {
            this._sharedService.showToastr(res);
            this.isEditing = false;
            this.editableAddress = null;
            this.loadShippingAddresses(this.clientId);
          },
          error: (err) => {
            this._sharedService.showToastr(err);
          },
        });
      }
    }
    
    cancelEdit(): void {
      this.isEditing = false;
      this.editableAddress = null;
    }
    
}
