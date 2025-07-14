import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';

import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';

import { environment } from 'src/environments/environment';
import { InvoiceService } from '../../service/invoice.service';
import { salesManActivateViewModel } from '../../../van/interfaces/salesMan';
import { IvoiceSearchViewModel, InvoiceViewModel } from '../../interface/invoice-view-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/invoice';
  override searchViewModel: IvoiceSearchViewModel = new IvoiceSearchViewModel();
  modalRef: BsModalRef;
  override items: InvoiceViewModel[] = [];
  selectedItem: InvoiceViewModel;
  SalesMen: any[] = [];
  Clients: any[] = [];
  id:string;
  activation: salesManActivateViewModel = { id: '' };
  constructor(public override _sharedService: SharedService,
    private _pageService: InvoiceService, private _router: Router, private activatedRoute: ActivatedRoute 

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("Received ID:", id); 
     
  });
    this.initializePage();
    this.loadClients();
    this.loadSalesMen();
  }


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "invoiceNumber", Title: "sites.Invoice.invoiceNumber", Selectable: false, Sortable: true },
      { Name: "salesManName ", Title: "sites.Invoice.salesMan", Selectable: false, Sortable: true },
      { Name: "clientName ", Title: "sites.Invoice.client", Selectable: false, Sortable: true },
      { Name: "totalPrice  ", Title: "sites.Invoice.totalPrice", Selectable: false, Sortable: true },
      { Name: "totalNetPrice  ", Title: "sites.Invoice.totalNetPrice", Selectable: false, Sortable: true },
      { Name: "totalWeightInKG  ", Title: "sites.Invoice.totalWeightInKG", Selectable: false, Sortable: true },
      { Name: "totalQuantity  ", Title: "sites.Invoice.totalQuantity", Selectable: false, Sortable: true },
      { Name: "createdDate  ", Title: "sites.Invoice.createdDate", Selectable: false, Sortable: true },


    ];
    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateSalesMan() {
    this._router.navigate(['/sites/invoice/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      SalesManID: [this.searchViewModel.SalesManID],
      ClientID: [this.searchViewModel.ClientID],
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To]
    });
    this.page.isPageLoaded = true;
  }

  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as InvoiceViewModel[];
      }
      this.fireEventToParent()
    });
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



  navigateToDetails(id: string) {
    this._router.navigate([`${this.pageRoute}/details/${id}`]);
  }
}
