import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { AddSalesmanToSalesmanTransactionDetailsVM, RejectReasonViewModel, salesManToSalesManCreateViewNodel, transferSalesManToSalesManSearchViewModel, transferSalesManToSalesManViewModel } from '../../interface/transfer-sales-man-to-sales-man';
import { TransfersWarehouseToWarehouseServiceService } from '../../service/transfers-warehouse-to-warehouse-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  modalRef: BsModalRef;
  status: string = 'pending';
  cartVisible = false;
  selectedProduct = '';
  id: string;
  item: salesManToSalesManCreateViewNodel = new salesManToSalesManCreateViewNodel;
  override items: transferSalesManToSalesManViewModel[] = [];
  selectedItem: RejectReasonViewModel = new RejectReasonViewModel();
  cartItems: { productId: string; storageType: number; quantity: number, productName: string, maxQuantity: number }[] = [];
  productForm: FormGroup;
  products: any[] = [];
  override controlType = ControlType;

  cartProductsResult: AddSalesmanToSalesmanTransactionDetailsVM[] = [];
  filteredProducts = this.products;
  override searchViewModel: transferSalesManToSalesManSearchViewModel = new transferSalesManToSalesManSearchViewModel();
  TransactionStatus = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ]

  StorageType = [
    { id: 1, name: 'Transaction' },
    { id: 2, name: 'selling' },
  ]
  salesManList: any[] = [];

  constructor(
    public override _sharedService: SharedService,
    private _transfersWarehouseToWarehouseServiceService: TransfersWarehouseToWarehouseServiceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private translate: TranslateService
  ) {
    super(_sharedService);
  }
  ngOnInit(): void {
    this.initializePage();
    this.productForm = this._sharedService.formBuilder.group({
      selectedProduct: ['']
    });

    this.pageCreate.form = this._sharedService.formBuilder.group({
      fromSalesmanId: ['', Validators.required],
      toSalesManId: ['', Validators.required],
      transactionDetails: this._sharedService.formBuilder.array([])
    });

  }


  getSalesManList() {
    this._transfersWarehouseToWarehouseServiceService.getSalesManList().subscribe(response => {
      this.salesManList = response.data;
    });
  }

  getStatusName(statusId: number): string {
    const status = this.TransactionStatus.find(s => s.id === statusId);
    return status ? status.name.trim() : '';
  }
  get transactionDetailsArray(): FormArray {
    return this.pageCreate.form.get('transactionDetails') as FormArray;
  }

  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "transactionNumber", Title: "sites.transferSalesManToSalesMan.transactionNumber", Selectable: false, Sortable: true },
      { Name: "fromSalesManName", Title: "sites.transferSalesManToSalesMan.fromSalesManID", Selectable: false, Sortable: true },
      { Name: "toSalesMan", Title: "sites.transferSalesManToSalesMan.toSalesManID", Selectable: false, Sortable: true },
      { Name: "transactionStatus", Title: "sites.transferSalesManToSalesMan.transactionStatus", Selectable: false, Sortable: true },
      { Name: "productsQuantity", Title: "sites.transferSalesManToSalesMan.productsQuantity", Selectable: false, Sortable: true },
      { Name: "createdDate", Title: "sites.transferSalesManToSalesMan.createdDate", Selectable: false, Sortable: true },
      { Name: "", Title: "sites.transferSalesManToSalesMan.action", Selectable: false, Sortable: true },
    ];
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  onCancel(): void {
    this.cartVisible = false;
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromSalesManID: [this.searchViewModel.FromSalesManID],
      ToSalesManID: [this.searchViewModel.ToSalesManID],
      transactionStatus: [this.searchViewModel.transactionStatus],
    });
    this.page.isPageLoaded = true;
  }



  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);

    this._transfersWarehouseToWarehouseServiceService
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
          this.items = response.data.items as transferSalesManToSalesManViewModel[];
        }
        this.fireEventToParent();
      });
  }

  approveRequest(item: transferSalesManToSalesManViewModel, newStatus: string) {
    this._transfersWarehouseToWarehouseServiceService.Approved(item.id).subscribe({
      next: (response) => {
        this.page.isSaving = false;
        if (response.isSuccess) {
          console.log(response);
          this._sharedService.showToastr(response);
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

  loadProducts() {
    const fromSalesmanId = this.pageCreate.form.get('fromSalesmanId')?.value;
    if (!fromSalesmanId) {
      return;
    }
    this._transfersWarehouseToWarehouseServiceService.getProducts(fromSalesmanId).subscribe((res: any) => {
      if (res.isSuccess) {
        this.products = res.data;
        this.filteredProducts = this.products;
      }
    });
  }


  @ViewChild('confirmRejectTemplate', { static: false }) confirmRejectTemplate: any;
  showRejectConfirmation(Item: transferSalesManToSalesManViewModel) {
    this.selectedItem = new RejectReasonViewModel();
    this.selectedItem.transactionId = Item.id;
    this.modalRef = this._sharedService.modalService.show(this.confirmRejectTemplate, { class: 'modal-sm' });
  }

  rejectRequest() {
    this._transfersWarehouseToWarehouseServiceService.Rejected(this.selectedItem).subscribe({
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

  showCartDialog(event: Event) {
    event.preventDefault();
    this.getSalesManList();

    this.loadProducts();
    this.createForm();

    this.cartItems = [];
    this.pageCreate.form.reset();
    this.cartVisible = true;
  }

  closeCartDialog() {
    this.cartVisible = false;
    this.cartItems = [];
    this.productForm.reset();
    this.pageCreate.form.reset()
  }

  //  onProductSelected(event: any): void {
  //     const selected = this.products.find(p => p.id === event.id);
  //     if (selected && !this.cartItems.find(i => i.productId === selected.id)) {
  //       this.cartItems.push({
  //         productId: selected.id,
  //         quantity: 1,
  //         storageType:1,
  //         productName:selected.name
  //       });
  //       this.productForm.reset(); 
  //     }
  //   }
  onProductSelected(event: any) {
    const selectedProductId = this.productForm.get('selectedProduct')?.value;
    const selectedProduct = this.products.find(p => p.id === selectedProductId);

    if (!selectedProduct) return;

    const existingItem = this.cartItems.find(item => item.productId === selectedProductId);

    if (!existingItem) {
      this.cartItems.push({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: 1,
        storageType: 1,
        maxQuantity: selectedProduct.maxQuantity
      });
    }
  }

  createForm() {
    this.productForm = this._sharedService.formBuilder.group({
      selectedProduct: [null]
    });

    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        fromSalesmanId: [this.item.fromSalesmanId, Validators.required],
        toSalesManId: [this.item.toSalesManId, Validators.required],
        transactionDetails: this._sharedService.formBuilder.array(
          this.item.transactionDetails?.map(detail => this.createDetailFormGroup(detail)) || []
        )
      },
    );
    this.pageCreate.form.get('fromSalesmanId')?.valueChanges.subscribe(value => {
      if (value) {
        this.loadProducts();
      }
    });
    this.page.isPageLoaded = true;
  }



  createDetailFormGroup(detail: AddSalesmanToSalesmanTransactionDetailsVM): FormGroup {
    return this._sharedService.formBuilder.group({
      productId: [detail.productId, Validators.required],
      quantity: [detail.quantity, [Validators.required, Validators.min(1)]],
      storageType: [detail.storageType, Validators.required],
    });
  }
  saveRequest(): void {
    if (this.pageCreate.isSaving) return;

    if (this.pageCreate.form.invalid) {
      return;
    }

    const detailsFormArray = this._sharedService.formBuilder.array([]);

    this.cartItems.forEach(item => {
      detailsFormArray.push(
        this._sharedService.formBuilder.group({
          productId: [item.productId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          storageType: [item.storageType, Validators.required]
        })
      );
    });

    this.pageCreate.form.setControl('transactionDetails', detailsFormArray);

    this.pageCreate.isSaving = true;
    Object.assign(this.item, this.pageCreate.form.value);
    this.pageCreate.isSaving = true;
    this._transfersWarehouseToWarehouseServiceService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/transferSalesManToSalesMan']);
          this.cartVisible = false;
          this.item = new salesManToSalesManCreateViewNodel();
          this.cartItems = [];
          this.pageCreate.form.reset();
          this.search();
           this.pageCreate.isSaving = false;
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
  increaseQuantity(index: number) {
    const item = this.cartItems[index];
    if (item.quantity < item.maxQuantity) {
      item.quantity++;
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
    }
  }



  editSalesMan(id: string) {
    this.pageCreate.isEdit = true;
    this.id = id;
    this.cartVisible = true;
    this.getSalesManList();
    this.loadProducts();
    this.getEditableItem();

  }



  getEditableItem() {
    this._transfersWarehouseToWarehouseServiceService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.item.id = this.id;


         this.cartItems = res.data.transactionDetailsByIdDTOs.map(detail => {
          const product = this.products.find(p => p.id === detail.productId);
          return {
            productId: detail.productId,
            productName: detail.productName,
            quantity: detail.quantity,
            storageType: detail.storageType,
           maxQuantity: product ? product.maxQuantity : null 
          };
        });


          this.createForm();


          this.pageCreate.form.patchValue({
            fromSalesmanId: this.item.fromSalesmanId,
            toSalesManId: this.item.toSalesManId
          });

          this.pageCreate.isPageLoaded = true;
        }
      },
      error: (err) => {
        this.pageCreate.isPageLoaded = true;
      },
    });
  }


}
