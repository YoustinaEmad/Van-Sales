import { Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GetAllProductAtCart, selectedProductViewModel, transferCreateViewModel, transferSearchViewModel, transferViewModel, WarehouseToWarehouseTransactionDetailsVM } from '../../interface/transfer';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../../service/transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
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
  selectedProduct = '';
  cartProductsResult: GetAllProductAtCart[] = [];
  filteredProducts = this.products;
  override searchViewModel: transferSearchViewModel = new transferSearchViewModel();
  cartVisible = false;
  WarehouseList: any[] = [];
  searchText: string = '';
  SalesMen: any[] = [];
  selectedStatusId: string = '';
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

  }
  initializePage() {
    this.page.columns = [

      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "transactionNumber", Title: "Transaction Number", Selectable: false, Sortable: true },
      { Name: "fromWarehouseName", Title: "From Warehouse Name", Selectable: false, Sortable: true },
      { Name: "toWarehouseName", Title: "To Warehouse Name", Selectable: false, Sortable: true },
      { Name: "warehouseToWarehouseStatus", Title: "Warehouse Status", Selectable: false, Sortable: true },
      { Name: "productsQuantity", Title: "Products Quantity", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.supplier.action", Selectable: false, Sortable: true },

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
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        console.log(response.data)
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as transferViewModel[];
      }
      this.fireEventToParent()
    });
  }


  getWarehouseStatusName(statusId: number) {
    const status = this.WarehouseToWarehouseStatuslist.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }

  onStatusChange(statusId: string) {
    this.selectedStatusId = statusId;
    this.page.searchForm.patchValue({ WarehouseToWarehouseStatus: statusId });
    this.search(); // optionally trigger search on change
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
    this._pageService.getProducts().subscribe((res: any) => {
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
    );

    this.page.isPageLoaded = true;
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

  onCancel(): void {
    this.cartVisible = false;
  }

  saveTransfer(): void {
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
  
    this.pageCreate.form.setControl('transactionDetailsDTOs', detailsFormArray);
  
    this.pageCreate.isSaving = true;
    Object.assign(this.item, this.pageCreate.form.value);
  
    this._pageService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/transfers']);
          this.cartVisible = false;
          this.search();
        }
      },
      error: () => {
        this.pageCreate.isSaving = false;
      }
    });
  }
  
  


}