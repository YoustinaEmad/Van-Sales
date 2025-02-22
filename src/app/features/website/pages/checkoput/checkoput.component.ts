import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartCardComponent } from '../../components/cart-card/cart-card.component';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { CheckoutViewModel, CreateOrderByClientViewModel, CreateShippingAddressViewModel } from '../../models/order.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { SharedModule } from "../../../../shared/shared.module";
import { WebsiteService } from '../../services/website.service';
import { GetShippingAddressesForClientViewModel } from '../../models/order.model';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { forkJoin } from 'rxjs';
import { governorateViewModel } from 'src/app/features/sites/governorates/interfaces/governorate';
import { cityViewModel } from 'src/app/features/sites/city/interfaces/city';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { jwtDecode } from 'jwt-decode';
import { Route, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { add } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-checkoput',
  standalone: true,
  templateUrl: './checkoput.component.html',
  styleUrls: ['./checkoput.component.css'],
  imports: [CommonModule, CartCardComponent, SharedModule]
})
export class CheckoputComponent implements OnInit {
  shippingAddresses: GetShippingAddressesForClientViewModel[] = [];
  clientId:string;
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

  constructor(
    public websiteService: WebsiteService,
    public _cityService: CityService,
    public _companyService: CompanyService,
    public _sharedService: SharedService,
    public _router: Router
  ) { }

  ngOnInit(): void {
   this.getClientIdFromToken();
    forkJoin([
      this._cityService.getGovernorates(),
      this._companyService.getCities(),
      this.websiteService.getAllShippingAdresses(this.clientId),
      this.websiteService.getDefaultShippingAddress(this.clientId)
    ]).subscribe((res) => {
      this.governorates = res[0].data;
      this.cities = res[1].data;
      this.shippingAddresses = res[2].data;
      const defaultAddress = res[3].data;
        if (defaultAddress) {
            this.selectedAddress = defaultAddress; 
            this.shippingAddressId = defaultAddress.id;  
        }
    });
    
    //this.getDefaultShippingAddress(); 
   // this.loadShippingAddresses(this.clientId);
    this.createForm();
  
  }
  getDefaultShippingAddress() {
    this.page.isPageLoaded=true;
    return this.websiteService.getDefaultShippingAddress(this.clientId);
  }
  

  getClientIdFromToken() {
    const token = localStorage.getItem('eToken'); 
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); 
        this.clientId = decodedToken.ID; 
      } catch (error) {
      }
    } else {
    }
  }

  loadShippingAddresses(clientId: string) {
    this.websiteService.getAllShippingAdresses(this.clientId).subscribe({
      next: (res) => {
        this.shippingAddresses = res.data;
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      },
    });
  }

  SeconCarOils = [
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1800',
      oldPrice: '1950 ',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1800',
      oldPrice: '1950 ',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1800',
      oldPrice: '1950 ',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1800',
      oldPrice: '1950 ',
    }
  ]

  getTotalPrice() {
    return this.websiteService.productsInCart.reduce((acc, x) => acc + (x.price * x.quantity), 0);
  }

  // editAddress(address: GetShippingAddressesForClientViewModel) {
  //   this.isEditing = true;
  //   this.isAddingNewAddress = false;
  //   this.editableAddress = { ...address }; 
  // }

  saveAddress() {
    if (this.isAddingNewAddress) {
      this.editableAddress.clientId=this.clientId;
      this.editableAddress.landmark='';
      this.websiteService.AddShippingAddress(this.editableAddress).subscribe({
        next: (res) => {
          this._sharedService.showToastr(res);
          this.loadShippingAddresses(this.clientId);
          //this.cancelEdit(); // Hide the address form after saving
        },
        error: (err) => {
          this._sharedService.showToastr(err);
        },
      });
    } else {
      this.websiteService.EditShippingAddress(this.editableAddress).subscribe({
        next: (res) => {
          this._sharedService.showToastr(res);
          this.loadShippingAddresses(this.clientId);
         // this.cancelEdit(); // Hide the address form after saving
        },
        error: (err) => {
          this._sharedService.showToastr(err);
        },
      });
    }
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

  // addNewAddress() {
  //   this.editableAddress = {
  //     governorateId: '',
  //     cityId: '',
  //     street: '',
  //     buildingData:'',
  //   };

  //   this.item.shippingAddressId = null;
  //   this.isEditing = false;
  //   this.isAddingNewAddress = true;
  // }

  // cancelEdit() {
  //   this.isEditing = false;
  //   this.isAddingNewAddress = false;
  //   this.editableAddress = null;
  // }

  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      governorateId: [this.item?.governorateId || '', Validators.required],
      cityId: [this.item?.cityId || '', Validators.required],
      street: [this.item?.street || '', Validators.required],
      buildingData:[this.item?.buildingData|| '',Validators.required],
      landmark: [this.item?.landmark || '', Validators.required],
      comment: [this.item?.comment || ''],
      shippingAddressId: [this.item?.shippingAddressId || ''],
      isDefualt: [this.item?.isDefualt || false],
      latitude: [this.item?.latitude || 0, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [this.item?.longitude || 0, [Validators.required, Validators.min(-180), Validators.max(180)]],
    });
  }

  Save() {
    Object.assign(this.item, this.page.form.value);
    this.page.isSaving = true;

    if (this.shippingAddressId) {
      this.item.shippingAddressId = this.shippingAddressId;
    } else {
      this.item.governorateId = this.editableAddress.governorateId;
      this.item.cityId = this.editableAddress.cityId;
      this.item.street = this.editableAddress.street;
      this.item.buildingData=this.editableAddress.buildingData;
      this.item.latitude = 0; // Default value
      this.item.longitude = 0; // Default value
    }

    this.websiteService.CreateOrder(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/home']);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.page.isSaving = false;
      },
    });
  }

  onSelectShippingAddress(address: GetShippingAddressesForClientViewModel) {
    if (!address) return;
    this.selectedAddress = address;  
    this.shippingAddressId = address.id;  
    this.page.form.patchValue({
        governorateId: address.governorateId,
        cityId: address.cityId,
        street: address.street,
        buildingData: address.buildingData,
        landmark: address.landmark,
    });
}




}
