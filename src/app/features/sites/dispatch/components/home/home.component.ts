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
import { createDispatchActualViewModel, createDispatchPlannedViewModel, DispatchActualSearchViewModel, DispatchPlannedSearchViewModel, GetAllActualDispatchs, GetAllPlannedDispatchs } from '../../interface/dispatch-view-model';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  _activatedRoute: any;
  id: any;
  _productService: any;
  categories: any;
  productGroup: any;

  constructor(public override _sharedService: SharedService, private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: DispatchService, private translate: TranslateService) {
    super(_sharedService);
  }

  override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  override pageRoute = '/sites/dispatch';
  modalRef: BsModalRef;
  item: createDispatchPlannedViewModel = new createDispatchPlannedViewModel();
  selectedTab: TabEnum = TabEnum.Actual;
  actualSearchForm: FormGroup;
  TabEnum = TabEnum;
  cartVisible = false;
  SalesMen: any[] = [];
  Clients: any[] = [];
  ActualDispatchStatus = [];
  isCreatingActual: boolean = false;
  cartItems: { Id: string, clientName: string }[] = [];
  clientsForm: FormGroup;
  actualDispatches: GetAllActualDispatchs[] = [];
  plannedDispatches: GetAllPlannedDispatchs[] = [];
  override controlType = ControlType;
  override searchViewModel: DispatchPlannedSearchViewModel = new DispatchPlannedSearchViewModel();
  searchViewModel2: DispatchActualSearchViewModel = new DispatchActualSearchViewModel();
  Tabs = [];
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this.translate.get([
      'sites.dispatch.actual',
      'sites.dispatch.planned',
      'sites.dispatch.successful',
      'sites.dispatch.failed',
      'sites.dispatch.notDone'
    ]).subscribe(translations => {
      this.Tabs = [
        {
          ID: 1,
          name: translations['sites.dispatch.actual'],
          isSelected: true,
        },
        {
          ID: 2,
          name: translations['sites.dispatch.planned'],
          isSelected: false,
        },
      ];
      this.ActualDispatchStatus = [
        { id: 1, name: translations['sites.dispatch.successful'] },
        { id: 2, name: translations['sites.dispatch.failed'] },
        { id: 3, name: translations['sites.dispatch.notDone'] }
      ];
    });

    this.createSearchForm();
    this.createActualSearchForm();
    this.loadActualDispatches();
  }
  getAllBrands() {
    throw new Error('Method not implemented.');
  }
  getEditableItem() {
    throw new Error('Method not implemented.');
  }
  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((tab) => {
      tab.isSelected = tab.ID === tabID;
    });

    if (this.selectedTab === TabEnum.Actual) {
      this.loadActualDispatches();
    } else if (this.selectedTab === TabEnum.Planned) {
      this.loadPlannedDispatches();
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


    const formValue = this.pageCreate.form.value;

    formValue.startDate = this.normalizeDate(formValue.startDate);
    formValue.visitDate = this.normalizeDate(formValue.visitDate);



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


  loadPlannedDispatches() {

    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);

    this._pageService
      .getPlanned(
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
          this.plannedDispatches = response.data.items || [];

        }
        this.fireEventToParent();
      });

  }



  loadActualDispatches() {
    this.page.isSearching = true;
    this.actualDispatches = [];

    Object.assign(this.searchViewModel2, this.actualSearchForm.value);

    this._pageService
      .getActual(
        this.searchViewModel2,
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
          this.actualDispatches = response.data.items || [];
        }
        this.fireEventToParent();
      });
  }

  removeClient(index: number): void {

    this.cartItems.splice(index, 1);

  }

  normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To],
    });
    this.page.isPageLoaded = true;

  }
  // override search(): void {
  //   if (this.page.searchForm.invalid) return;

  //   Object.assign(this.searchViewModel, this.page.searchForm.value);
  //   this.page.options.currentPage = 1;
  //   this.loadPlannedDispatches();
  // }
  createActualSearchForm() {
    this.actualSearchForm = this._sharedService.formBuilder.group({
      From: [this.searchViewModel2.From],
      To: [this.searchViewModel2.To],
      DispatchStatus: [this.searchViewModel2.DispatchStatus]
    });
  }

  override search(): void {
    if (this.selectedTab === TabEnum.Actual) {
      if (this.actualSearchForm.invalid) return;
      Object.assign(this.searchViewModel2, this.actualSearchForm.value);
      this.page.options.currentPage = 1;
      this.loadActualDispatches();
    } else {
      if (this.page.searchForm.invalid) return;
      Object.assign(this.searchViewModel, this.page.searchForm.value);
      this.page.options.currentPage = 1;
      this.loadPlannedDispatches();
    }
  }

  getStatusName(statusId: number) {
    const status = this.ActualDispatchStatus.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }
  showActualCartDialog(event: Event) {
    event.preventDefault();
    this.loadClients();
    this.loadSalesMen();
    this.cartItems = [];

    this.createActualForm();
    this.pageCreate.form.reset();

    this.cartVisible = true;
    this.isCreatingActual = true;
  }
  createActualForm() {


    this.pageCreate.form = this._sharedService.formBuilder.group({
      salesManID: [null, Validators.required],
      visitDate: [new Date(), Validators.required],
      clientId: [null, Validators.required],
      dispatchStatus: [null, Validators.required]
    });

    this.pageCreate.isPageLoaded = true;
  }
  saveActual(): void {
    const formValue = this.pageCreate.form.value;

    formValue.startDate = this.normalizeDate(formValue.startDate);
    formValue.visitDate = this.normalizeDate(formValue.visitDate);
    if (this.pageCreate.isSaving || this.pageCreate.form.invalid) return;

    const body = this.pageCreate.form.value as createDispatchActualViewModel;

    this.pageCreate.isSaving = true;

    this._pageService.postOrUpdateActual(body).subscribe({
      next: (res) => {
        this.pageCreate.isSaving = false;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          this.cartVisible = false;
          this.isCreatingActual = false;
          this.pageCreate.form.reset();
          this.loadActualDispatches();
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.pageCreate.isSaving = false;
      }
    });
  }


}