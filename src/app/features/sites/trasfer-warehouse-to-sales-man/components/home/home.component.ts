import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { createWarehouseToSalesmanViewModel, GetAllProductAtCart, ProductsList, RejectReasonViewModel, WarehouseToSalesmanSearchViewModel, WarehouseToSalesmanTransactionDetailsDTO, WarehouseToSalesmanViewModel } from '../../interface/warehouse-to-salesman-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { WarehouseToSalesmanServiceService } from '../../service/warehouse-to-salesman-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService, private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: WarehouseToSalesmanServiceService,) {
    super(_sharedService);
  }

  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  override pageRoute = '/sites/transferWarehouseToSalesMan';
  modalRef: BsModalRef;
  item: createWarehouseToSalesmanViewModel = new createWarehouseToSalesmanViewModel();
  isDropdownVisible = false;
  products: ProductsList[] = [];
  selectedProduct = '';
  cartErrorMessage: string = '';
  selectedItem: WarehouseToSalesmanViewModel;
  cartProductsResult: GetAllProductAtCart[] = [];
  filteredProducts = this.products;
  override searchViewModel: WarehouseToSalesmanSearchViewModel = new WarehouseToSalesmanSearchViewModel();
  cartVisible = false;
  WarehouseList: any[] = [];
  selectedStatusId: string = '';
  searchText: string = '';
  SalesMen: any[] = [];
  status: string = 'pending';
  selectedItemReject: RejectReasonViewModel = new RejectReasonViewModel();
  warehouseId: string;
  id: string;
  override controlType = ControlType;
  override items: WarehouseToSalesmanViewModel[] = [];
  productForm: FormGroup;
  cartItems: { productId: string; productName: string; quantity: number }[] = [];
  TransactionsStatus = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ];
  ngOnInit(): void {
    this.initializePage();
    this.loadWarehouses();
    

  }
  OnWarehouseIdChange(warehouseId: any) {
    this.warehouseId = warehouseId;
    this.loadProducts();

  }

  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "transactionNumber", Title: "sites.transferWarehouseToSalesMan.transactionNumber", Selectable: false, Sortable: true },
      { Name: "salesManName", Title: "sites.transferWarehouseToSalesMan.salesMan", Selectable: false, Sortable: true },
      { Name: "warehouseName", Title: "sites.transferWarehouseToSalesMan.warehouseName", Selectable: false, Sortable: true },
      { Name: "createdDate", Title: "sites.transferWarehouseToSalesMan.createdDate", Selectable: false, Sortable: true },
      { Name: "productNumber", Title: "sites.transferWarehouseToSalesMan.productNumber", Selectable: false, Sortable: true },
      { Name: "transactionStatus", Title: "sites.transferWarehouseToSalesMan.transactionStatus", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.transferWarehouseToSalesMan.action", Selectable: false, Sortable: true },

    ];
    this.createSearchForm();
   // this.createForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      SearchText: [this.searchViewModel.SearchText],
      WarehouseId: [this.searchViewModel.WarehouseId],
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To],
    });
    this.page.isPageLoaded = true;
  }
  onProductSelected(event: any): void {
    const selected = this.products.find(p => p.id === event.id);
    if (selected && !this.cartItems.find(i => i.productId === selected.id)) {
      this.cartItems.push({
        productId: selected.id,
        productName: selected.name,
        quantity: 1
      });
      this.productForm.reset(); // optional: clear selection after adding
    }
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
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as WarehouseToSalesmanViewModel[];

        }
        this.fireEventToParent();
      });
  }
 
  loadWarehouses() {
    this._pageService.getWarehouses().subscribe((res: any) => {
      if (res.isSuccess) {
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
    this._pageService.getProducts(this.warehouseId).subscribe((res: any) => {
      if (res.isSuccess) {
        this.products = res.data;
      }
    });
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
    //this.loadProducts();
    this.cartItems = [];
    this.createForm();
    this.pageCreate.form.reset();
    this.cartVisible = true;
  }
  closeCartDialog() {
    this.cartVisible = false;
  }

  createForm() {
    this.productForm = this._sharedService.formBuilder.group({
      selectedProduct: [null]
    });

    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        salesManID: [this.item.salesManID, Validators.required],
        warehouseId: [this.item.warehouseId, Validators.required],
        transactionDetails: this._sharedService.formBuilder.array(
          this.item.transactionDetails?.map(detail => this.createDetailFormGroup(detail)) || []
        )
      }

    );

    this.pageCreate.isPageLoaded = true;
  }

  removeProduct(index: number): void {

    this.cartItems.splice(index, 1);

  }
  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
    const product = this.products.find(p => p.id === item.productId);
    if (product && item.quantity < product.maxQuantity) {
      item.quantity += 1;
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
    }
  }

  getEditableItem() {
    this._pageService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;
          this.cartItems = res.data.warehouseToSalesmanTransactionDetailsDTO.map(detail => ({
            productId: detail.productID,
            productName: detail.productName,
            quantity: detail.quantity
          }));

          this.createForm();
          this.pageCreate.isPageLoaded = true;
        }
      },
      error: (err) => {
        this.pageCreate.isPageLoaded = true;
      },
    });
  }




  createDetailFormGroup(detail: WarehouseToSalesmanTransactionDetailsDTO): FormGroup {
    return this._sharedService.formBuilder.group({
      productID: [detail.productID, Validators.required],
      quantity: [detail.quantity, [Validators.required, Validators.min(1)]]
    });
  }
  

  get transactionDetailsArray(): FormArray {
    return this.pageCreate.form.get('transactionDetails') as FormArray;
  }
  

  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }
  ngOnDestroy(): void { }
  saveTransfer(): void {
    if (this.pageCreate.isSaving) return;
    if (this.pageCreate.form.invalid) {
      return;
    }
  
    const detailsFormArray = this._sharedService.formBuilder.array(
      this.cartItems.map(item => this._sharedService.formBuilder.group({
        productID: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        productName: [item.productName]
      }))
    );
    this.pageCreate.form.setControl('transactionDetails', detailsFormArray);
    
    // ✅ Set the cart items into the form
    //this.pageCreate.form.setControl('transactionDetails', detailsFormArray);

    // Now assign the form value to your model
    Object.assign(this.item, this.pageCreate.form.value);

    this.pageCreate.isSaving = true;
    this._pageService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        //this.item.transactionDetailsVM = this.cartItems;
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/transferWarehouseToSalesMan']);
          this.cartVisible = false;
          this.item = new createWarehouseToSalesmanViewModel();
          this.cartItems = [];
          this.pageCreate.form.reset();
          this.search();
           this.pageCreate.isSaving = false;
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.pageCreate.isSaving = false;
      }
    });
  }


  editTransaction(id: string) {
    this.pageCreate.isEdit = true;
    this.id = id;
    this.cartVisible = true;
    this.loadWarehouses();
    this.loadSalesMen();
    this.loadProducts();
    this.getEditableItem();
  }



  approveRequest(item: WarehouseToSalesmanViewModel, newStatus: string) {
    this._pageService.Approved(item.id).subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);

        this.page.isSaving = false;
        if (response.isSuccess) {
          console.log(response);
          this.initializePage();
          this.status = 'Approved'
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      }
    })
  }

  @ViewChild('confirmRejectTemplate', { static: false }) confirmRejectTemplate: any;
  showRejectConfirmation(item: WarehouseToSalesmanViewModel): void {
    this.selectedItemReject = new RejectReasonViewModel();
    this.selectedItemReject.Id = item.id;  // Assuming the RejectReasonViewModel has an `id` field
    this.modalRef = this._sharedService.modalService.show(this.confirmRejectTemplate, { class: 'modal-sm' });
  }

  rejectRequest() {
    this._pageService.Rejected(this.selectedItemReject).subscribe({
      next: (response) => {
        this.page.isSaving = false;
        if (response.isSuccess) {
          this._sharedService.showToastr(response);
          this.initializePage();
          this.status = 'Rejected'
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      }
    })
  }
navigateToTransferDetails(id: string) {
     this._router.navigate(['/sites/transferWarehouseToSalesMan/details', id]);
  }
}

