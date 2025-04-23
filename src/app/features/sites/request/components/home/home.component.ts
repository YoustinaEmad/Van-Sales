import { Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { requestSearchViewModel, requestViewModel } from '../../interface/request';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../service/request.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService,  private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: RequestService,) {
    super(_sharedService);
  }
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/request';
   modalRef: BsModalRef;
  override searchViewModel: requestSearchViewModel = new requestSearchViewModel();
  cartVisible = false;
  
  WarehouseList: any[] = [];
  selectedStatusId : string='';
 // override controlType = ControlType;
  override items: requestViewModel[] = [];
  RequestStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ];
  ngOnInit(): void {
    this.initializePage();
  }


  initializePage() {
    this.page.columns = [
    
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "requestNumber", Title: "Request Number", Selectable: false, Sortable: true },
      { Name: "requestStatusName", Title: "Request Status", Selectable: false, Sortable: true },
      { Name: "salesManName", Title: "Sales Man Name", Selectable: false, Sortable: true },
      { Name: "warehouseName", Title: "Warehouse Name", Selectable: false, Sortable: true },
       { Name: "quantity", Title: "Quantity", Selectable: false, Sortable: true },
       { Name: "createDate", Title: "Create Date", Selectable: false, Sortable: true },
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
      RequestNumber: [this.searchViewModel.RequestNumber],
      RequestStatus:[this.searchViewModel.RequestStatus],
      SalesManName:[this.searchViewModel.SalesManName],
      SalesManPhone:[this.searchViewModel.SalesManPhone],
      WarehouseId:[this.searchViewModel.WarehouseId],
      FromDate:[this.searchViewModel.FromDate],
      ToDate:[this.searchViewModel.ToDate]
    });
    this.page.isPageLoaded = true;
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
        //         this.idOfShippingAddress=response.data.items.shippingAddressId;
        // console.log(response.data.items)
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as requestViewModel[];
         
        }
        this.fireEventToParent();
      });
  }
  
  getRequestStatusName(statusId: number) {
    const status = this.RequestStatuslist.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }

  onStatusChange(RequestStatus: string) {
    this.selectedStatusId = RequestStatus;
    this.page.searchForm.patchValue({ RequestStatus: RequestStatus });
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
  

  showCartDialog(event: Event) {
    event.preventDefault();
    this.cartVisible = true;
  }

  closeCartDialog() {
    this.cartVisible = false;
  }
}