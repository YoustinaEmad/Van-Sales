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
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';

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
  cartItems: { Id: string, clientName: string }[] = [];
  clientsForm: FormGroup;
  override controlType = ControlType; // add this line if missing

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
  onClientsSelected(event: any): void {
    const selected = this.Clients.find(p => p.id === event.id);
    if (selected && !this.cartItems.find(i => i.Id === selected.id)) {
      this.cartItems.push({
        Id: selected.id,
        clientName: selected.name
      });
      this.clientsForm.reset(); // optional: clear selection after adding
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
    this._pageService.getClients().subscribe((res: any) => {
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
    this.clientsForm = this._sharedService.formBuilder.group({
      selectedClient: [null]
    });
    this.pageCreate.form = this._sharedService.formBuilder.group(
      {
        salesManID: [this.item.salesManID, Validators.required],
        startDate: [this.item.startDate || new Date(), [Validators.required, this.validatePastDate
        ]],
        clientIDs: [[], [Validators.required, this.requireNonEmptyArray()]],

      });

    this.pageCreate.isPageLoaded = true;
  }
  validatePastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Reset time parts to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      return { pastDate: 'sites.product.futureDate' };
    }

    return null;
  }
  requireNonEmptyArray(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { required: true };
    };
  }



  saveTransfer(): void {
    this.pageCreate.form.get('clientIDs')?.setValue(this.cartItems.map(c => c.Id));
    this.pageCreate.form.get('clientIDs')?.updateValueAndValidity();

    if (this.pageCreate.isSaving) return;
    if (this.pageCreate.form.invalid) {
      console.log(this.pageCreate.form.errors); // لمساعدتك على معرفة السبب
      return;
    }




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

  removeClient(index: number): void {

    this.cartItems.splice(index, 1);

  }

}
