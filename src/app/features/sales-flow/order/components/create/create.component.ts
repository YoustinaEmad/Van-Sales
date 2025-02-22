import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TabEnum } from '../../interface/tab_enum';
import { editOrderItemsViewModel, editOrderViewModel, EditShippingAddressViewModel, GetAllProductAtCart, orderCreateViewModel, orderSelectedViewModel, selectedProductViewModel } from '../../interface/order';
import { SharedService } from 'src/app/shared/service/shared.service';
import { OrderService } from '../../service/order.service';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { customerSelectedViewModel } from '../../../customers/interfaces/customers';
import { CityService } from 'src/app/features/sites/city/service/city.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { CustomersService } from '../../../customers/service/customers.service';
import { add } from 'ngx-bootstrap/chronos';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  @ViewChild('map') mapContainer: ElementRef | undefined;
  page: CRUDCreatePage = new CRUDCreatePage();
  item: orderCreateViewModel = {} as orderCreateViewModel;
  map: L.Map;
  marker: L.Marker;

  images = [{ uploaded: false, src: null }];
  id: string;
  shippingAddresses = [];
  areImagesValid: boolean = true;
  shippingAddressId: string = '';
  governorates: orderSelectedViewModel[] = [];
  cities: orderSelectedViewModel[] = [];
  clientGroups: orderSelectedViewModel[] = [];
  selectedGovernorateId?: string = '';
  isDropdownVisible = false;
  isEqualPassword: boolean = true;
  checkedActivation: boolean = false;
  checkedDefault: boolean = false;
  selectedProduct = '';
  cartProductsResult: GetAllProductAtCart[] = [];
  orderItems: editOrderItemsViewModel[] = [];
  products: selectedProductViewModel[] = [];
  shippingAddress: EditShippingAddressViewModel;
  isExistingCustomer: boolean = false;
  isEditMode: boolean = false;
  isAddButtonDisabled: boolean = false;
  isAddMode: boolean = false;
  searchText: string = '';
  filteredProducts = this.products;
  productPrice: number = 0;
  environment = environment;
  editItem: editOrderViewModel = new editOrderViewModel();
  customerActivity = [
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ]
  filterProducts() {
    if (this.searchText) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredProducts = [];
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  items = [];
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' },
  ];
  orderStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Cancelled' }
  ];

  controlType = ControlType;
  selectedTab: TabEnum = TabEnum.OrderDetails;
  selectedAddressId: string | null = null;
  TabEnum = TabEnum;
  Tabs = [
    {
      ID: 1,
      name: 'Order Details',
      icon: '/assets/icons/vector.svg',
      selectedIcon: '/assets/icons/vector-colored.svg',
      isSelected: true,
    },
    {
      ID: 2,
      name: 'Order Adress',
      icon: '/assets/icons/sell.svg',
      selectedIcon: '/assets/icons/sell-colored.svg',
      isSelected: false,
    },
    {
      ID: 3,
      name: 'Comments',
      icon: '/assets/icons/sell.svg',
      selectedIcon: '/assets/icons/sell-colored.svg',
      isSelected: false,
    },
  ];

  constructor(
    private _sharedService: SharedService,
    private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _cityService: CityService,
    private _companyService: CompanyService,
    private _customersService: CustomersService,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  // ngOnInit(): void {
  //   this.page.isPageLoaded = false;

  //   this._activatedRoute.paramMap.subscribe((params) => {
  //     if (params.has('id')) {
  //       this.id = params.get('id');
  //       this.page.isEdit = true;
  //     }
  //   });

  //   this.fetchShippingAddresses(this.id);
  //   forkJoin([
  //     this._cityService.getGovernorates(),
  //     this._companyService.getCities(),
  //     this._customersService.getClientGroups(),
  //     this._orderService.getProducts()
  //   ]).subscribe((res) => {
  //     this.governorates = res[0].data
  //     this.cities = res[1].data
  //     this.clientGroups = res[2].data
  //     this.products=res[3].data

  //     if (this.page.isEdit) {
  //       this.getEditableItem();
  //     } else {
  //       this.createForm();
  //     }
  //   }
  //   )
  // }

  ngOnInit(): void {
    this.page.isPageLoaded = false;


    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });

    // Initialize form early
    this.createForm();

    // Fetch initial data
    forkJoin([
      this._cityService.getGovernorates(),
      this._companyService.getCities(),
      this._customersService.getClientGroups(),
      this._orderService.getProducts()
    ]).subscribe((res) => {
      this.governorates = res[0].data;
      this.cities = res[1].data;
      this.clientGroups = res[2].data;
      this.products = res[3].data;


    });
    if (this.page.isEdit) {
      this.getEditableItem();
    } else {
      //this.createForm();
    }
    this.fetchShippingAddresses(this.id);

  }


  onSearch(): void {
    const MobileNumber = this.page.form.get('mobile')?.value;
    if (!MobileNumber) {

      return;
    }

    const searchViewModel = { MobileNumber: MobileNumber };

    this._orderService.getCustomerDetails(searchViewModel.MobileNumber)
      .subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            console.log(res)
          //   if (res.data.status === 1) {
          //     this.toastr.warning('Client status is pending!', 'Warning');
          // }
            this.isExistingCustomer = true;
            this.populateFormWithCustomerData(res.data);
       
            this.images = res.data.path
            ? [{ uploaded: true, src: `${environment.api}/${res.data.path}` }]
            : [];
            // if (res.data.images) {
             
            //   this.images = res.data.images.map((imgSrc: string) => ({
            //     uploaded: true,
            //     src: imgSrc,
            //   }));
            // }
            this.shippingAddressId = res.data.shippingAddresses.id;
            Object.keys(this.page.form.controls).forEach(key => {
              if (key !== 'mobile') {
                this.page.form.get(key)?.disable();
               
              }
            });

            this.fetchShippingAddresses(res.data.userId);
            this.id = res.data.userId;
            this.items = [];
            this._sharedService.showToastr(res);
          } else {
            this.isExistingCustomer = false;
            this.page.form.reset();
            this.resetOrderAddressFields();
            this.shippingAddresses = []
            this.cartProductsResult=[]

            Object.keys(this.page.form.controls).forEach(key => {
              this.page.form.get(key)?.enable();
            });

            this._sharedService.showToastr(res);
          }

          this.page.form.get('mobile')?.enable();
          this.page.form.get('comment')?.enable();
          this.cartProductsResult=[]
        },
        error: (err) => {
          this.isExistingCustomer = false;
          this._sharedService.showToastr(err);
          this.page.form.get('mobile')?.enable();
          this.page.form.get('comment')?.enable();
          this.cartProductsResult=[]
        }
      });

  }

  populateFormWithCustomerData(customerData: any): void {
    this.page.form.patchValue({
      name: customerData.name,
      mobile: customerData.mobile,
      email: customerData.email,
      cityId: customerData.shippingAddresses.cityId,
      governorateId: customerData.shippingAddresses.governorateId,
      street: customerData.shippingAddresses.street,
      buildingData: customerData.buildingData,
      landmark: customerData.shippingAddresses.landmark,
      longitude: customerData.shippingAddresses.longitude,
      latitude: customerData.shippingAddresses.latitude,
      phone: customerData.phone,
      clientGroupId: customerData.clientGroupId,
      age: customerData.age,
      gender: customerData.gender,
      userName: customerData.userName,
      workInfo: customerData.workInfo,
      clientActivity: customerData.clientActivity,
      path :customerData.path
    });
    if (customerData.path) {
      this.images = [
        {
          uploaded: true,
          src: this.getImageUrl(customerData.path), 
        },
      ];
    } else {
      this.images = []; 
    }
    this.loadCities(customerData.governorateId);
  }

  fetchShippingAddresses(clientId: string) {
    this._orderService.getAllShippingAdresses(clientId)
      .subscribe(
        (response: any) => {
   
          this.shippingAddresses = response.data;
        },
        error => {
        }
      );
  }


  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      nationalNumber: [this.item.nationalNumber, [Validators.pattern(/^\d{14}$/)]],
      name: [this.item.name, Validators.required],
      userName: [this.item.userName, Validators.required],
      password: [
        this.item.password,
        this.page.isEdit || this.isExistingCustomer ? [] : [Validators.required]
      ],  // Password not required when editing
      confirmPassword: [
        this.item.confirmPassword,
        this.page.isEdit || this.isExistingCustomer ? [] : [Validators.required]
      ],
      mobile: [this.item.mobile, [Validators.required, Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
      governorateId: [this.item.governorateId, Validators.required],
      cityId: [this.item.cityId, Validators.required],
      street: [this.item.street, Validators.required],
      landmark: [this.item.landmark, Validators.required],
      email: [this.item.email, [ Validators.email]],
      phone: [this.item.phone],
      clientGroupId: [this.item.clientGroupId],
      comment: [this.item.comment],
      shippingAddressId: [this.item.shippingAddressId],
      notifyCustomer: [this.item.notifyCustomer],
      age: [1,this.item.age],
      gender: [1,this.item.gender],
      buildingData: [this.item.buildingData, Validators.required],
      latitude: [this.item.latitude||0],
      longitude: [this.item.longitude||0],
      clientActivity: [this.item.clientActivity],
     
      //cartProductsResult: [[this.item.cartProductsResult],[Validators.required,Validators.minLength(1)]]
    });
    this.page.form.get('nationalNumber')?.enable();
    //this.page.form.get('comment')?.enable();
    this.page.isPageLoaded = true;
  }


  Save() {
    if (this.page.isSaving || this.page.form.invalid) return;
    // if (this.page.isSaving || this.page.form.invalid) {
    //   // Debug: Log invalid controls before submission
    //   Object.keys(this.page.form.controls).forEach(key => {
    //     const control = this.page.form.get(key);
    //     if (control?.invalid) {
    //       console.log(`${key} is invalid. Errors:`, control.errors);
    //     } else {
    //       console.log(`${key} is valid.`);
    //     }
    //   });
    //   //return;
    // }
    this.areImagesValid = this.validateImages(); // Validate images before saving

    // if (!this.areImagesValid) {

    //   return;
    // }
    this.item.cartProductsResult = this.cartProductsResult; // Ensure it is up-to-date 

    if (this.shippingAddressId) {
      this.item.shippingAddressId = this.shippingAddressId;
      this.editItem.shippingAddressID = this.shippingAddressId;
    } else {
      this.item.governorateId = this.page.form.get('governorateId')?.value;
      this.item.cityId = this.page.form.get('cityId')?.value;
      this.item.landmark = this.page.form.get('landmark')?.value;
      this.item.street = this.page.form.get('street')?.value;
      this.item.buildingData = this.page.form.get('buildingData')?.value;
      this.item.longitude = this.page.form.get('longitude').value;
      this.item.latitude = this.page.form.get('latitude').value;
      // this.item.latitude = 0;
      // this.item.longitude = 0;
    }
    this.editItem.governorateId = this.page.form.get('governorateId')?.value;

    this.editItem.cityId = this.page.form.get('cityId')?.value;
    this.editItem.landmark = this.page.form.get('landmark')?.value;
    this.editItem.street = this.page.form.get('street')?.value;
    this.editItem.nationalNumber = this.page.form.get('nationalNumber')?.value;
    this.editItem.name = this.page.form.get('name')?.value;
    this.editItem.userName = this.page.form.get('userName')?.value;
    this.editItem.phone = this.page.form.get('phone')?.value;
    this.editItem.mobile = this.page.form.get('mobile')?.value;
    this.editItem.comment = this.page.form.get('comment')?.value;
    this.editItem.clientGroupId = this.page.form.get('clientGroupId')?.value;
    this.editItem.email = this.page.form.get('email')?.value;
    this.editItem.workInfo = this.page.form.get('workInfo')?.value;
    this.editItem.gender = this.page.form.get('gender')?.value;
    this.editItem.age = this.page.form.get('age')?.value;
    this.editItem.buildingData = this.page.form.get('buildingData')?.value;
    this.editItem.clientActivity = this.page.form.get('clientActivity')?.value;
    this.editItem.longitude = this.page.form.get('longitude')?.value;
    this.editItem.latitude = this.page.form.get('latitude')?.value;
    if (!this.page.isEdit) {

      Object.assign(this.item, this.page.form.value);
      this.item.paths = this.getUploadedImages();
      this.page.isSaving = true;
     this.item.notifyCustomer = this.checkedActivation;
      this.item.isDefualt = this.checkedDefault;
      // this.item.latitude = 0;
      // this.item.longitude = 0;
      this._orderService.postOrUpdate(this.item).subscribe({
        next: (res) => {
          this.page.isSaving = false;
          this.page.responseViewModel = res;


          this._sharedService.showToastr(res);
          if (res.isSuccess) {
            this._router.navigate(['/salesflow/order']);
          }
        },
        error: (err) => {
          this._sharedService.showToastr(err);
          this.page.isSaving = false;
        },
      });
    }
    else if (this.page.isEdit) {

      this.page.isSaving = true;
      //this.editItem.items=this.orderItems;
      if (!this.editItem.items || this.editItem.items.length === 0) {
        this.editItem.items = [...this.orderItems];
      }
      this._orderService.Update(this.editItem).subscribe({
        next: (res) => {
          this.page.isSaving = false;
          this.page.responseViewModel = res;

          this._sharedService.showToastr(res);
          if (res.isSuccess) {
            this._router.navigate(['/salesflow/order']);
          }
        },
        error: (err) => {
          this._sharedService.showToastr(err);
          this.page.isSaving = false;
        },
      });
    }
  }

  // switchTab(tabID: number) {
  //   this.selectedTab = tabID;
  //   this.Tabs.forEach((item) => {
  //     item.isSelected = item.ID === tabID;

  //   });
  //   if (tabID === TabEnum.OrderDetails) {
  //     //this.initMap();
  //   }
  //   this.initMap();
  // }

  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((item) => {
      item.isSelected = item.ID === tabID;
    });
  
    if (tabID === TabEnum.OrderAdress ) {
      // Only re-initialize the map if it's not already initialized
      if (this.map) {
        //this.map.remove(); // Properly remove the previous map instance
        this.map = undefined; // Set map to undefined to allow reinitialization
      }
      this.initMap();
    }
  }
  
  

  getSelectedTab() {
    return this.Tabs.find((item) => item.isSelected);
  }
  onCancel(): void {
    this._router.navigate(['/salesflow/order']);
  }
  edittotal: number;

  onReset(): void {
    this.page.form.reset();
  }
  getEditableItem() {
    this._orderService.getOrderById(this.id).subscribe({
      next: (res) => {
   
        if (res.isSuccess) {
          this.editItem = res.data;
          this.editItem.orderID = this.id;
          //this.editItem.items=this.orderItems;
          
          this.items = res.data.items;
          this.shippingAddressId = res.data.shippingAddressID
          res.data.shippingAddressID = null;
          this.page.isPageLoaded = true;
          this.fetchShippingAddresses(res.data.clientID);

          this.page.form.patchValue(this.editItem);
         
        }
      },
      error: (err) => {
        this.page.isPageLoaded = true;
      }
    });
  }

  // editOrderForm() {
  //   this.page.form = this._sharedService.formBuilder.group({
  //     nationalNumber: [this.editItem.nationalNumber,[Validators.required,Validators.pattern(/^\d{14}$/)] ],
  //     name: [this.editItem.name,Validators.required],
  //     workInfo: [this.editItem.workInfo,Validators.required],
  //     userName: [this.editItem.userName,Validators.required],
  //     mobile: [this.editItem.mobile,[Validators.required,Validators.pattern(/^(010|011|012|015)\d{8}$/)]],
  //     governorateId: [this.editItem.governorateId,Validators.required],
  //     cityId: [this.editItem.cityId,Validators.required],
  //     street: [this.editItem.street,Validators.required],
  //     landmark: [this.editItem.landmark,Validators.required],
  //     email: [this.editItem.email,[Validators.required,Validators.email]],
  //     phone: [this.editItem.phone],
  //     clientGroupId: [this.editItem.clientGroupId],
  //     comment: [this.editItem.comment],
  //     shippingAdressID: [this.editItem.shippingAdressID],
  //     age: [this.editItem.age,Validators.required],
  //     gender: [this.editItem.gender,Validators.required],
  //     latitude: [this.editItem.latitude],
  //     longitude: [this.editItem.longitude],
  //     items: this._sharedService.formBuilder.array(
  //       this.editItem.items.map((item: editOrderItemsViewModel) =>
  //         this._sharedService.formBuilder.group({
  //           productName:[item.productName,Validators.required],
  //           productId: [item.productId, Validators.required],
  //           quantity: [item.quantity, Validators.required],
  //           itemPrice: [item.itemPrice, Validators.required],
  //         })
  //       )
  //     ),
  //   });


  //   this.page.isPageLoaded = true;
  // }

  addProductToList(product) {
    const product1 = this.products.find(p => p.id === product.id);
    if (product1) {
      this._orderService.getProductPrice(product.id).subscribe({
        next: (res: any) => {
          if (res.isSuccess) {
            const productPrice = res.data.itemPrice;

            const existingItem = this.items.find(item => item.productId === product.id);
            if (existingItem) {
              existingItem.quantity++;
              existingItem.total = existingItem.quantity * productPrice;
              existingItem.price = existingItem.quantity * productPrice;
            } else {
              const newItem = {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                itemPrice: productPrice,
                total: productPrice,
                price: productPrice
              };
              this.items.push(newItem);
            }


            this.syncCartProductsResult();

            this.selectedProduct = '';
          } else {
            this._sharedService.showToastr(res)
          }
        },
        error: (err) => {
          this._sharedService.showToastr(err)
        }
      });

    }
  }

  syncCartProductsResult() {
    this.cartProductsResult = this.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    this.orderItems = this.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      itemPrice: item.itemPrice,
      productName: item.productName,
      price: item.price
    }));
    this.editItem.items = [...this.orderItems];

  }



  submitOrder() {
    const cartProductsResult: GetAllProductAtCart[] = this.items.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const orderPayload: orderCreateViewModel = {
      ...this.item,
      cartProductsResult
    };



    this._orderService.postOrUpdate(orderPayload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this._sharedService.showToastr(res);
          this._router.navigate(['/salesflow/order']);
        } else {
          this._sharedService.showToastr(res)

        }
      },
      error: (err) => {
        this._sharedService.showToastr(err)

      }
    });
  }



  updateTotal(item: any) {
    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }

    item.total = item.quantity * item.itemPrice;
    item.price = item.quantity * item.itemPrice;
    const product = this.products.find(p => p.id === item.id);
    if (product) {
      item.total = item.quantity * item.itemPrice; // Use product's price
      item.price = item.quantity * item.itemPrice;
    } else {
    }


    const cartProduct = this.cartProductsResult.find(cp => cp.productId === item.id);
    if (cartProduct) {
      cartProduct.quantity = item.quantity;
    } else if (item.id) {

      this.cartProductsResult.push({
        productId: item.id,
        quantity: item.quantity
      });
    }

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



  private enableFormFields() {
    const governorateControl = this.page.form.get('governorateId');
    const cityControl = this.page.form.get('cityId');
    const streetControl = this.page.form.get('street');
    const landmarkControl = this.page.form.get('landmark');
    const buildingDataControl = this.page.form.get('buildingData');
    const latitudeControl = this.page.form.get('latitude');
    const longitudeControl = this.page.form.get('longitude');
    
    
    if (governorateControl) {
      governorateControl.enable();
      governorateControl.setValidators([Validators.required]);
      governorateControl.updateValueAndValidity();
    }

    if (cityControl) {
      cityControl.enable();
      cityControl.setValidators([Validators.required]);
      cityControl.updateValueAndValidity();
    }

    if (streetControl) {
      streetControl.enable();
      streetControl.setValidators([Validators.required]);
      streetControl.updateValueAndValidity();
    }

    if (landmarkControl) {
      landmarkControl.enable();
      landmarkControl.setValidators([Validators.required]);
      landmarkControl.updateValueAndValidity();
    }

    if (buildingDataControl) {
      buildingDataControl.enable();
      buildingDataControl.setValidators([Validators.required]);
      buildingDataControl.updateValueAndValidity();
    }
    if (latitudeControl) {
      latitudeControl.enable();
      latitudeControl.setValidators([Validators.required]);
      latitudeControl.updateValueAndValidity();
    }
    if (longitudeControl) {
      longitudeControl.enable();
      longitudeControl.setValidators([Validators.required]);
      longitudeControl.updateValueAndValidity();
    }

  }



  private disableFormFields() {
    this.page.form.get('governorateId')?.disable();
    this.page.form.get('cityId')?.disable();
    this.page.form.get('street')?.disable();
    this.page.form.get('landmark')?.disable();
    this.page.form.get('buildingData').disable();
  }


  onSelectShippingAddress(address: any): void {
    if (!address) return;
    this.shippingAddressId = address.id,
      this.page.form.patchValue({
        governorateId: address.governorateId,
        cityId: address.cityId,
        street: address.street,
        landmark: address.landmark,
        buildingData: address.buildingData,
        longitude  :address.longitude,
        latitude :address.latitude,
      });
    this.isEditMode = false;
    if (this.page.isEdit) {
      this.enableFormFields();
    } else {
      this.disableFormFields();

    }
  }

  onEdit() {
    this.isEditMode = true;
    this.enableFormFields();
    this.isAddButtonDisabled = true;
  }


  areShippingAddressFieldsValid(): boolean {
    const governorateControl = this.page.form.get('governorateId');
    const cityControl = this.page.form.get('cityId');
    const streetControl = this.page.form.get('street');
    const landmarkControl = this.page.form.get('landmark');
    const buildingDataControl = this.page.form.get('buildingData');
    const longitudeControl = this.page.form.get('longitude');
    const latitudeControl = this.page.form.get('latitude');
    

    return (
      governorateControl?.valid &&
      cityControl?.valid &&
      streetControl?.valid &&
      landmarkControl?.valid &&
      buildingDataControl?.valid&&
      longitudeControl?.valid&&
      latitudeControl?.valid
    );

  }

  onSaveIfValid(): void {
    if (this.areShippingAddressFieldsValid()) {
      const governorateControl = this.page.form.get('governorateId');
      const cityControl = this.page.form.get('cityId');
      const streetControl = this.page.form.get('street');
      const landmarkControl = this.page.form.get('landmark');
      const buildingDataControl = this.page.form.get('buildingData');
      const statusControl = this.page.form.get('status');
      const latitudeControl = this.page.form.get('latitude');
      const longitudeControl = this.page.form.get('longitude');
      this.shippingAddress = {
        id: this.shippingAddressId,
        governorateId: governorateControl?.value,
        cityId: cityControl?.value,
        street: streetControl?.value,
        landmark: landmarkControl?.value,
        buildingData: buildingDataControl?.value,
        status: statusControl?.value,
        latitude: latitudeControl?.value,
        longitude: longitudeControl?.value,
      };
      this.onSave();
    } else {

    }
  }
  onSave() {
    this.isAddButtonDisabled = false;
    this._orderService.EditShippingAddress(this.shippingAddress).subscribe(res => {
      if (res.isSuccess) {
        this._sharedService.showToastr(res);
        this.fetchShippingAddresses(this.id);
        this.disableFormFields();

      } else {
        this._sharedService.showToastr(res);
      }

    });


    this.isEditMode = false;
  }



  onAddNew() {

    this.page.form.get('governorateId')?.setValue('');
    this.page.form.get('cityId')?.setValue('');
    this.page.form.get('street')?.setValue('');
    this.page.form.get('landmark')?.setValue('');
    this.page.form.get('buildingData')?.setValue('');
    this.page.form.get('latitude')?.setValue('');
    this.page.form.get('longitude')?.setValue('');
    
    this.enableFormFields();
    this.isEditMode = true;
    this.shippingAddressId = null;

    this.isAddMode = true;

    this.page.form.get('governorateId')?.clearValidators();
    this.page.form.get('cityId')?.clearValidators();
    this.page.form.get('street')?.clearValidators();
    this.page.form.get('landmark')?.clearValidators();
    this.page.form.get('buildingData')?.clearValidators();
    this.page.form.get('latitude')?.clearValidators();
    this.page.form.get('longitude')?.clearValidators();

    this.page.form.get('governorateId')?.updateValueAndValidity();
    this.page.form.get('cityId')?.updateValueAndValidity();
    this.page.form.get('street')?.updateValueAndValidity();
    this.page.form.get('landmark')?.updateValueAndValidity();
    this.page.form.get('buildingData')?.updateValueAndValidity();
    this.page.form.get('latitude')?.updateValueAndValidity();
    this.page.form.get('longitude')?.updateValueAndValidity();
  }



  removeProduct(index: number): void {

    this.items.splice(index, 1);
    this.syncCartProductsResult();

  }

  resetOrderAddressFields(): void {

    this.page.form.get('governorateId')?.setValue('');
    this.page.form.get('cityId')?.setValue('');
    this.page.form.get('street')?.setValue('');
    this.page.form.get('landmark')?.setValue('');
    this.page.form.get('buildingData')?.setValue('');
    this.page.form.get('latitude')?.setValue('');
    this.page.form.get('longitude')?.setValue('');
    this.items = [];
    this.shippingAddressId = '';
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
    this._orderService.uploadImage(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
      
          //this.images[index] = { uploaded: true, src: res.data.path[index] };
          this.images[index] = { uploaded: true, src:`${environment.api}/${res.data.path[index]}`};

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
  

  validateImages(): boolean {
    return this.images.some(image => image.uploaded);
    
    
  }



  ngAfterViewInit(): void {
    // Ensure that the map container is present before calling initMap
    this.waitForMapContainer()
      .then(() => this.initMap())
      .catch(() => console.error('Map container still not found.'));
  }

  ngOnDestroy(): void {
    // Clean up the map when the component is destroyed to avoid memory leaks
    if (this.map) {
      this.map.remove();
      this.map = undefined; // Set map reference to undefined
    }
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

  async initMap(): Promise<void> {
    try {
      // Ensure change detection has run before initializing the map
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
  
        this.marker = L.marker([26.8206, 30.8025], { icon: customIcon, draggable: true }).addTo(this.map)
          .bindPopup('A sample marker in Egypt')
          .openPopup();
  
        this.map.on('click', (event) => {
          const { lat, lng } = event.latlng;
          this.marker.setLatLng([lat, lng]);
          this.page.form.get('latitude')?.setValue(lat);
          this.page.form.get('longitude')?.setValue(lng);
        });
  
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
  
  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
  }

}