import { Component } from '@angular/core';
import { TabEnum } from '../../interface/enum/tab-enum';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { createWarehouseToSalesmanViewModel } from '../../../trasfer-warehouse-to-sales-man/interface/warehouse-to-salesman-view-model';
import { WarehouseToSalesmanServiceService } from '../../../trasfer-warehouse-to-sales-man/service/warehouse-to-salesman-service.service';
import { DispatchService } from '../../service/dispatch.service';
import { createDispatchPlannedViewModel } from '../../interface/dispatch-view-model';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService, private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: DispatchService,) {
    super(_sharedService);
  }

  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  override pageRoute = '/sites/dispatch';
  modalRef: BsModalRef;
  item: createDispatchPlannedViewModel = new createDispatchPlannedViewModel();
  selectedTab: TabEnum = TabEnum.Actual;
  TabEnum = TabEnum;
  cartVisible = false;
  SalesMen: any[] = [];
  Clients: any[] = [];
  cartItems: { Id: string }[] = [];

  Tabs = [
    {
      ID: 1,
      name: 'Actual',
      isSelected: true,
    },
    {
      ID: 2,
      name: 'Planned',
      isSelected: false,
    },

  ];

repeatedRequests = [
    {
      name: 'احمد محمود',
      id: 3989586,
      routes: [
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' }
      ]
    },
    {
      name: 'احمد محمود',
      id: 3989586,
      routes: [
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' }
      ]
    }
  ];
  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((tab) => {
      tab.isSelected = tab.ID === tabID;
    });
  
    if (this.selectedTab === TabEnum.Actual) {
     // this.items = this.items.filter(item => item.verifyStatus === 1); // Pending
     // this.initializePage();
    } else if (this.selectedTab === TabEnum.Planned) {
     // this.items = this.items.filter(item => item.verifyStatus !== 1);
      //.getApprovedAndReject() // Approved or Rejected
    }
  }

  loadSalesMen() {
    this._pageService.getSalesMen().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.SalesMen = res.data || [];
      }
    });
  }
  loadClients() {
    this._pageService.getSalesMen().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Clients = res.data || [];
      }
    });
  }

  showCartDialog(event: Event) {
    event.preventDefault();
    this.loadClients();
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
    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        salesManID: [this.item.salesManID, Validators.required],
        startDate: [this.item.startDate, Validators.required],
        clientIDs: this._sharedService.formBuilder.array(
          this.item.clientIDs?.map(detail => this.createDetailFormGroup(detail)) || []
        )
      });

    this.pageCreate.isPageLoaded = true;
  }

  createDetailFormGroup(clientID: string): FormGroup {
    return this._sharedService.formBuilder.group({
      clientID: [clientID, Validators.required]
    });
  }


  saveTransfer(): void {
    if (this.pageCreate.isSaving) return;
    if (this.pageCreate.form.invalid) {
      return;
    }
  
    const detailsFormArray = this._sharedService.formBuilder.array(
      this.cartItems.map(item =>
        this._sharedService.formBuilder.group({
          clientID: [item.Id, Validators.required]
        })
      )
    );
    
    this.pageCreate.form.setControl('clientIDs', detailsFormArray);
    
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
          this._router.navigate(['/sites/dispatch']);
          this.cartVisible = false;
          this.item = new createDispatchPlannedViewModel();
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

}
