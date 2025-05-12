import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { RejectReasonViewModel, transferSalesManToSalesManSearchViewModel, transferSalesManToSalesManViewModel } from '../../interface/transfer-sales-man-to-sales-man';
import { TransfersWarehouseToWarehouseServiceService } from '../../service/transfers-warehouse-to-warehouse-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/shared/service/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  extends CrudIndexBaseUtils{
override page: CRUDIndexPage = new CRUDIndexPage();
 modalRef: BsModalRef;
  status: string = 'pending';
  override items: transferSalesManToSalesManViewModel[] = [];
    selectedItem: RejectReasonViewModel=new RejectReasonViewModel();
      override searchViewModel: transferSalesManToSalesManSearchViewModel = new transferSalesManToSalesManSearchViewModel();
  TransactionStatus = [
     { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
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
    this.getSalesManList();
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

 initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "transactionNumber", Title: "sites.transferSalesManToSalesMan.transactionNumber", Selectable: false, Sortable: true },
      { Name: "fromSalesManName", Title: "sites.transferSalesManToSalesMan.fromSalesManID", Selectable: false, Sortable: true },
      { Name: "toSalesMan", Title: "sites.transferSalesManToSalesMan.toSalesManID", Selectable: false, Sortable: true },
       { Name: "transactionStatus", Title: "sites.transferSalesManToSalesMan.transactionStatus", Selectable: false, Sortable: true },
        { Name: "productsQuantity", Title: "sites.transferSalesManToSalesMan.productsQuantity", Selectable: false, Sortable: true },
           { Name: "createdDate", Title: "sites.transferSalesManToSalesMan.createdDate", Selectable: false, Sortable: true },
      { Name: "", Title: "Action", Selectable: false, Sortable: true },
    ];

    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }


 override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromSalesManID: [this.searchViewModel.FromSalesManID],
      ToSalesManID:[this.searchViewModel.ToSalesManID],
        transactionStatus:[this.searchViewModel.transactionStatus],
    });
    this.page.isPageLoaded = true;
  }

  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._transfersWarehouseToWarehouseServiceService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as transferSalesManToSalesManViewModel[];
      }
      this.fireEventToParent()
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
            this.status='Approved'
          }
        },
        error: (error) => {
          this.page.isSaving = false;
          this._sharedService.showToastr(error);
        }
      })
    }
  
  

  @ViewChild('confirmRejectTemplate', { static: false }) confirmRejectTemplate: any;
  showRejectConfirmation(Item:transferSalesManToSalesManViewModel) {
    this.selectedItem = new RejectReasonViewModel();
    this.selectedItem.transactionId=Item.id;
    this.modalRef = this._sharedService.modalService.show(this.confirmRejectTemplate, { class: 'modal-sm' });
  }

  rejectRequest() {
    this._transfersWarehouseToWarehouseServiceService.Rejected(this.selectedItem).subscribe({
      next: (response) => {
        this.page.isSaving = false;
        if (response.isSuccess) {
          this._sharedService.showToastr(response);
          this.initializePage();
          this.status='Rejected'
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      }
    })
  }

}
