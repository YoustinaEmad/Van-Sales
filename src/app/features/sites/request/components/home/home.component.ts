import { Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GetAllProductAtCart, requestCreateViewNodel, requestSearchViewModel, requestViewModel, SalesmanRequestDetailsVM } from '../../interface/request';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../service/request.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { FormArray, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService,  private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: RequestService,) {
    super(_sharedService);
  }


  override page: CRUDIndexPage = new CRUDIndexPage();
    pageCreate: CRUDCreatePage = new CRUDCreatePage();
    modalRef: BsModalRef;
    item: requestCreateViewNodel = new requestCreateViewNodel();
    isDropdownVisible = false;
    products: any[] = [];
    selectedProduct = '';
      selectedItem: requestViewModel;
    cartProductsResult: GetAllProductAtCart[] = [];
    filteredProducts = this.products;
    override searchViewModel: requestSearchViewModel = new requestSearchViewModel();
    cartVisible = false;
    WarehouseList: any[] = [];
    selectedStatusId : string='';
    searchText: string = '';
    SalesMen: any[] = [];
    override controlType = ControlType;
    override items: requestViewModel[] = [];
    productForm: FormGroup;
    selectedBrandId: string = '';
  brands: any[] = [];
    cartItems: { productId: string; productName: string; quantity: number }[] = [];
  override pageRoute = '/sites/request';
  RequestStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ];
  ngOnInit(): void {
    this.initializePage();
    this.loadBrands() ;
  }


  initializePage() {
    this.page.columns = [
    
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "requestNumber", Title: "sites.request.requestNumber", Selectable: false, Sortable: true },
      { Name: "requestStatusName", Title: "sites.request.requestStatus", Selectable: false, Sortable: true },
      { Name: "salesManName", Title: "sites.request.salesManName", Selectable: false, Sortable: true },
      { Name: "warehouseName", Title: "sites.request.warehouseName", Selectable: false, Sortable: true },
       { Name: "quantity", Title: "sites.request.quantity", Selectable: false, Sortable: true },
       { Name: "createDate", Title: "sites.request.createDate", Selectable: false, Sortable: true },
      // { Name: "Action", Title: "sites.request.action", Selectable: false, Sortable: true },

    ];
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }
 override createSearchForm() {
  console.log('Initial ToDate before form creation:', this.searchViewModel.To);
    this.page.searchForm = this._sharedService.formBuilder.group({
      RequestNumber: [this.searchViewModel.RequestNumber],
      RequestStatus:[this.searchViewModel.RequestStatus],
      SalesManName:[this.searchViewModel.SalesManName],
      SalesManPhone:[this.searchViewModel.SalesManPhone],
      WarehouseId:[this.searchViewModel.WarehouseId],
      From:[this.searchViewModel.From],
      To: [this.searchViewModel.To],
    });
    this.page.isPageLoaded = true;
  }

  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);

    this._pageService
      .get(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.page.options.currentPage,
        this.page.options.itemsPerPage
      )
      .subscribe((response) => {
        this.page.isSearching = false;
        //         this.idOfShippingAddress=response.data.items.shippingAddressId;
        // console.log(response.data.items)
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as requestViewModel[];
          console.log(response)
          console.log('Response ToDate:', response.data.ToDate)
        }
        this.fireEventToParent();
      });
  }
  
  onProductSelected(event: any): void {
    const selected = this.products.find(p => p.id === event.id);
    if (selected && !this.cartItems.find(i => i.productId === selected.id)) {
      this.cartItems.push({
        productId: selected.id,
        productName: selected.name,
        quantity: 1
      });
      this.productForm.reset(); 
    }
  }
  getRequestStatusName(statusId: number) {
    const status = this.RequestStatuslist.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }

  onStatusChange(RequestStatus: string) {
    this.selectedStatusId = RequestStatus;
    this.page.searchForm.patchValue({ RequestStatus: RequestStatus });
  }

  loadWarehouses() {
    this._pageService.getWarehouses().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.WarehouseList = res.data || [];
      }
    });
  }
  loadSalesMen() {
    this._pageService.getSalesMen().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.SalesMen = res.data || [];
      }
    });
  }

  loadProducts() {
    this._pageService.getProducts(this.selectedBrandId).subscribe((res: any) => {
      if (res.isSuccess) {
        this.products = res.data;
      }
    });
  }

  loadBrands() {
    this._pageService.getbrands().subscribe(res => {
      if (res.isSuccess) {
        this.brands = res.data;
      }
    });
  }
  onBrandChange(event: any) {
    this.selectedBrandId = event?.id || null;
    this.loadProducts();
  }
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.items.forEach(item => {
      item.selected = isChecked;
    });
  }
  isAllSelected(): boolean {
    return this.items?.length > 0 && this.items.every(item => item.selected);
  }
  

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;

  }

  showCartDialog(event: Event) {
    event.preventDefault();
    this.loadWarehouses();
    this.loadSalesMen();
    this.loadProducts();
    this.createForm();
    this.cartVisible = true;
    this.cartItems = [];
    this.pageCreate.form.reset();
  }

  closeCartDialog() {
    this.cartVisible = false;
  }
createForm() {
    this.productForm = this._sharedService.formBuilder.group({
      selectedBrand:[null],
      selectedProduct: [null]
    });

    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        salesManID: [this.item.salesManID, Validators.required],
        warehouseId: [this.item.warehouseId, Validators.required],
        RequestDetails: this._sharedService.formBuilder.array(
          this.item.RequestDetails?.map(detail => this.createDetailFormGroup(detail)) || []
        )
      },
    );

    this.page.isPageLoaded = true;
  }
 createDetailFormGroup(detail: SalesmanRequestDetailsVM): FormGroup {
    return this._sharedService.formBuilder.group({
      productID: [detail.productId, Validators.required],
      quantity: [detail.quantity, [Validators.required, Validators.min(1)]]
    });
  }
  get transactionDetailsArray(): FormArray {
    return this.pageCreate.form.get('RequestDetails') as FormArray;
  }


  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

  ngOnDestroy(): void { }

  onCancel(): void {
    this.cartVisible = false;
  }

  saveRequest(): void {
    if (this.pageCreate.isSaving) return;
  
    if (this.cartItems.length === 0) {
      //this._sharedService.showToastr(res);
      return;
    }
  
    if (this.pageCreate.form.invalid) {
      //this._sharedService.showToastr({ isSuccess: false, message: 'Please fill in all required fields.' });
      return;
    }
  
    const detailsFormArray = this._sharedService.formBuilder.array([]);
  
    this.cartItems.forEach(item => {
      detailsFormArray.push(
        this._sharedService.formBuilder.group({
          productID: [item.productId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]]
        })
      );
    });
  
    this.pageCreate.form.setControl('RequestDetails', detailsFormArray);
  
    this.pageCreate.isSaving = true;
    Object.assign(this.item, this.pageCreate.form.value);
  
    this._pageService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/request']);
          this.cartVisible = false;
          this.search();
        }
      },
      error: () => {
        this.pageCreate.isSaving = false;
      }
    });
  }
  
  removeProduct(index: number): void {

    this.cartItems.splice(index, 1);

  }
  increaseQuantity(index: number): void {
    this.cartItems[index].quantity += 1;
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
    }
  }

}