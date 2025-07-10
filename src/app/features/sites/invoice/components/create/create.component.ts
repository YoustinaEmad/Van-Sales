import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { InvoiceService } from '../../service/invoice.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { environment } from 'src/environments/environment';
import { InvoiceCreateViewModel } from '../../interface/invoice-view-model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: InvoiceCreateViewModel = new InvoiceCreateViewModel();
  id: string;
  environment = environment;
    controlType = ControlType;
  constructor(public _sharedService: SharedService,
    private _pageService: InvoiceService, private _router: Router, private activatedRoute: ActivatedRoute

  ) {
  }
  Clients: any[] = [];
  Products: any[] = [];
  selectedProducts: any[] = [];

  allProducts = [
    { id: 1, name: 'Product A', price: 100 ,weight: 1},
    { id: 2, name: 'Product B', price: 150 ,weight: 1.5},
    // ...
  ];
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });

    this.createForm();
    this.loadClients();
  }
  onProductSelect(productId: number) {
    const selected = this.allProducts.find(p => p.id === +productId);
    if (selected && !this.selectedProducts.find(p => p.id === selected.id)) {
      this.selectedProducts.push({
        ...selected,
        quantity: 1,
        isEditing: false
      });
    }
  }

  toggleEdit(index: number) {
    const item = this.selectedProducts[index];
    item.isEditing = !item.isEditing;

    // You can add logic to save updated quantity when saving
    if (!item.isEditing) {
      console.log('Updated quantity:', item.quantity);
    }
  }

  deleteProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }



  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      clientID: [this.item.clientID, [Validators.required]],
      salesManID: [this.item.salesManID],
      notes: [this.item.notes],
      invoiceDetails: [this.item.invoiceDetails],
    });
    this.page.isPageLoaded = true;
  }


  Save() {
    this.page.isSaving = true;
    Object.assign(this.item, this.page.form.value);
    this._pageService.postOrUpdate(this.item).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this._router.navigate(['/sites/invoice']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  loadClients() {
    this._pageService.getClients().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Clients = res.data || [];
      }
    });
  }

   loadProducts() {
  const clientID = this.page.form.get('ClientID')?.value;
  const salesManID = this.getSalesmanIdFromToken(); 

  if (!clientID || !salesManID) return;

  const requestPayload = {
    SalesManID: salesManID,
    ClientID: clientID,
    StorageType: 2
  };

  this._pageService.getProducts(requestPayload).subscribe((res: any) => {
    if (res && res.isSuccess) {
      this.Products = res.data || [];
      this.allProducts = this.Products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.itemPrice,
        weight: p.itemWeightPerKG
      }));
    }
  });
}


onClientChange() {
  this.loadProducts();
}

  getSalesmanIdFromToken(): string | null {
  const token = localStorage.getItem('etoken'); 
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload?.SalesManID || null;
}
}
