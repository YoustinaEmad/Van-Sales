import { Component, ViewChild } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GetAllProductAtCart, selectedProductViewModel, transferCreateViewModel, transferSearchViewModel, transferViewModel, WarehouseToWarehouseTransactionDetailsVM } from '../../interface/transfer';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../../service/transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { FormArray, FormGroup, Validators } from '@angular/forms';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService, private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: TransferService,) {
    super(_sharedService);
  }

  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  override pageRoute = '/sites/transfers';
  modalRef: BsModalRef;
  item: transferCreateViewModel = new transferCreateViewModel();
  isDropdownVisible = false;
  products: any[] = [];
  warehouseId: string;
  selectedProduct = '';
  cartErrorMessage: string = '';
  selectedItem: transferViewModel;
  cartProductsResult: GetAllProductAtCart[] = [];
  filteredProducts = this.products;
  override searchViewModel: transferSearchViewModel = new transferSearchViewModel();
  cartVisible = false;
  WarehouseList: any[] = [];
  selectedStatusId: string = '';
  searchText: string = '';
  SalesMen: any[] = [];
  id: string;
  selectedBrandId: string = '';
  brands: any[] = [];

  override controlType = ControlType;
  override items: transferViewModel[] = [];
  productForm: FormGroup;
  cartItems: { productId: string; productName: string; quantity: number }[] = [];
  WarehouseToWarehouseStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'InProcess' },
    { id: 3, name: 'Delivered' },
    { id: 4, name: 'SalesManReject ' },
    { id: 5, name: 'WarehouseReject' }
  ];
  ngOnInit(): void {
    this.initializePage();
    this.loadWarehouses();
    this.loadBrands();

  }
  initializePage() {
    this.page.columns = [

      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "transactionNumber", Title: "sites.transfer.transactionNumber", Selectable: false, Sortable: true },
      { Name: "salesManName", Title: "sites.transfer.salesMan", Selectable: false, Sortable: true },
      { Name: "fromWarehouseName", Title: "sites.transfer.fromWarehouse", Selectable: false, Sortable: true },
      { Name: "toWarehouseName", Title: "sites.transfer.toWarehouse", Selectable: false, Sortable: true },
      { Name: "warehouseToWarehouseStatus", Title: "sites.transfer.warehouseStatus", Selectable: false, Sortable: true },
      { Name: "productsQuantity", Title: "sites.transfer.quantity", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.transfer.action", Selectable: false, Sortable: true },


    ];




    this.createSearchForm();


    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Data: [this.searchViewModel.Data],
      FromWarehouseId: [this.searchViewModel.FromWarehouseId],
      ToWarehouseId: [this.searchViewModel.ToWarehouseId],
      WarehouseToWarehouseStatus: [this.searchViewModel.WarehouseToWarehouseStatus],
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
          this.items = response.data.items as transferViewModel[];

        }
        this.fireEventToParent();
      });
  }
  getWarehouseStatusName(statusId: number) {
    const status = this.WarehouseToWarehouseStatuslist.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }

  onStatusChange(statusId: string) {
    this.selectedStatusId = statusId;
    this.page.searchForm.patchValue({ WarehouseToWarehouseStatus: statusId });
    this.search(); 
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
  OnWarehouseIdChange(warehouseId: any) {
    this.warehouseId = warehouseId;
    if (this.selectedBrandId) {
      this.loadProducts();
    } else {
      this.products = []; 
    }
  }

  loadProducts() {
    if (!this.warehouseId) return;

    this._pageService.getProducts(this.warehouseId, this.selectedBrandId).subscribe((res: any) => {
      if (res.isSuccess) {
        this.products = res.data || [];
      }
    });
  }

  loadBrands() {
    this._pageService.getbrands().subscribe(res => {
      if (res.isSuccess) {
        this.brands = res.data || [];
      }
    });
  }

  onBrandChange(event: any) {
    this.selectedBrandId = event.id || event;
    if (this.warehouseId) {
      this.loadProducts();
    } else {
      this.products = []; 
    }
  }


  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: transferViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
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

  onFromWarehouseChange(id: number) {
    this.page.searchForm.patchValue({ FromWarehouseId: id });
    this.search();
  }

  onToWarehouseChange(id: number) {
    this.page.searchForm.patchValue({ ToWarehouseId: id });
    this.search();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  showCartDialog(event: Event) {
    event.preventDefault();

    this.loadWarehouses();
    this.loadSalesMen();
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
      selectedBrand: [null],
      selectedProduct: [null]
    });

    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        salesManID: [this.item.salesManID, Validators.required],
        fromWarehouseId: [this.item.fromWarehouseId, Validators.required],
        toWarehouseId: [this.item.toWarehouseId, Validators.required],
        transactionDetailsDTOs: this._sharedService.formBuilder.array(
          this.item.transactionDetailsVM?.map(detail => this.createDetailFormGroup(detail)) || []
        )
      },
      { validators: [this.differentWarehousesValidator()] }
    );

    this.pageCreate.isPageLoaded = true;
  }


  differentWarehousesValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const from = group.get('fromWarehouseId')?.value;
      const to = group.get('toWarehouseId')?.value;

      return from && to && from === to
        ? { sameWarehouse: true }
        : null;
    };
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

  getEditableItem() {
    this._pageService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;
          this.cartItems = res.data.transactionDetailsDTOs.map(detail => ({
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




  createDetailFormGroup(detail: WarehouseToWarehouseTransactionDetailsVM): FormGroup {
    return this._sharedService.formBuilder.group({
      productID: [detail.productID, Validators.required],
      quantity: [detail.quantity, [Validators.required, Validators.min(1)]]
    });
  }

  get transactionDetailsArray(): FormArray {
    return this.pageCreate.form.get('transactionDetailsVM') as FormArray;
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

    // Prepare FormArray for transactionDetailsDTOs
    const detailsFormArray = this._sharedService.formBuilder.array(
      this.cartItems.map(item => this._sharedService.formBuilder.group({
        productID: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        productName: [item.productName] 
      }))
    );


    // ✅ Set the cart items into the form
    this.pageCreate.form.setControl('transactionDetailsDTOs', detailsFormArray);

    // Now assign the form value to your model
    Object.assign(this.item, this.pageCreate.form.value);

    this.pageCreate.isSaving = true;
    this._pageService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        //this.item.transactionDetailsVM = this.cartItems;
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/transfers']);
          this.cartVisible = false;
          this.search();
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.pageCreate.isSaving = false;
      }
    });
  }


  editTransaction(id: string) {
    this.pageCreate.isEdit = true;  // Tell the system we are in edit mode
    this.id = id;
    this.cartVisible = true;         // Open the modal/sidebar
    this.loadWarehouses();           // Load warehouses (if needed)
    this.loadSalesMen();             // Load salesmen (if needed)
    this.loadProducts();             // Load products (if needed)
    this.getEditableItem();          // Fetch the transfer data and fill the form

  }

  navigateToTransferDetails(id: string) {
    this._router.navigate(['/sites/transfers/details', id]);
  }



  getMaxQuantity(productId: string): number {
    const product = this.products.find(p => p.id === productId);
    return product ? product.maxQuantity : 1;
  }


  onQuantityInputChange(value: number, index: number): void {
    const item = this.cartItems[index];
    const product = this.products.find(p => p.id === item.productId);
    if (!product) return;

    if (value < 1) {
      item.quantity = 1;
    } else if (value > product.maxQuantity) {
      
    }
  }


  hasInvalidQuantities(): boolean {
    return this.cartItems.some(item => {
      const product = this.products.find(p => p.id === item.productId);
      return product && item.quantity > product.maxQuantity;
    });
  }

}