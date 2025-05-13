import { Component } from '@angular/core';
import { warehouseDetailsViewModel, WarehouseProductCreateViewModel } from '../../interfaces/warehouse-view-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/api.service';
import { WarehouseService } from '../../services/warehouse.service';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { Validators } from '@angular/forms';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';

@Component({
  selector: 'app-warehouse-details',
  templateUrl: './warehouse-details.component.html',
  styleUrls: ['./warehouse-details.component.css']
})
export class WarehouseDetailsComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  warehouse: warehouseDetailsViewModel | null = null;
  item: WarehouseProductCreateViewModel = new WarehouseProductCreateViewModel();
  isLoading = true;
  id: string = '';
  cartVisible = false;
  products: any[] = [];
  cartItems: { productId: string; productName: string; quantity: number }[] = [];

  productForm = this._sharedService.formBuilder.group({
    selectedProduct: [null, Validators.required]
  });

  WarehouseType = [
    { id: 1, name: "MainBranch" },
    { id: 2, name: "SubBranch" }
  ];

  constructor(
    public override _sharedService: SharedService,
    private route: ActivatedRoute,
    private api: ApiService,
    private _WarehouseService: WarehouseService,
    private _router: Router
  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getWarehouseDetails(this.id);
    }
  }

  getWarehouseTypeName(id: number): string {
    const warehouseType = this.WarehouseType.find(type => type.id === id);
    return warehouseType ? warehouseType.name : 'Unknown';
  }

  getWarehouseDetails(ID: string) {
    this._WarehouseService.getWarehouseDetails(ID).subscribe((res) => {
      this.warehouse = res.data;
      this.isLoading = false;
    });
  }

  showCartDialog(event: Event) {
    event.preventDefault();
    this.loadProducts();
    this.cartItems = [];
    this.productForm.reset();
    this.cartVisible = true;
  }

  closeCartDialog() {
    this.cartVisible = false;
  }

  loadProducts() {
    this._WarehouseService.getProducts().subscribe((res: any) => {
      if (res.isSuccess) {
        this.products = res.data;
      }
    });
  }

  onProductSelected(event: any): void {
    const selectedProductId = this.productForm.get('selectedProduct')?.value;
    const selectedProduct = this.products.find(p => p.id === selectedProductId);

    if (!selectedProduct) return;

    const existingItem = this.cartItems.find(item => item.productId === selectedProductId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        productId: selectedProductId,
        productName: selectedProduct.name,
        quantity: 1
      });
    }

    this.productForm.get('selectedProduct')?.reset();
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity += 1;
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
    }
  }

  removeProduct(index: number): void {
    this.cartItems.splice(index, 1);
  }

  saveRequest(): void {
    if (this.cartItems.length === 0 || !this.warehouse) return;

    this.item.warehouseId = this.id;
    this.item.productWarehouses = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    this.pageCreate.isSaving = true;

    this._WarehouseService.postProduct(this.item).subscribe({
      next: (res) => {
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this.cartVisible = false;
          this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this._router.navigate(['/sites/warehouse/details/' + this.id]);
          });

          this.search();
        }
      },
      error: () => {
        this.pageCreate.isSaving = false;
      }
    });
  }
}
