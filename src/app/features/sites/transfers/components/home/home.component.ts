import { Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { transferSearchViewModel, transferViewModel } from '../../interface/transfer';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../../service/transfer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {

  constructor(public override _sharedService: SharedService,  private _router: Router, private activatedRoute: ActivatedRoute, private _pageService: TransferService,) {
    super(_sharedService);
  }
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/transfers';
   modalRef: BsModalRef;
  override searchViewModel: transferSearchViewModel = new transferSearchViewModel();
  cartVisible = false;
  WarehouseList: any[] = [];
  selectedStatusId : string='';
  override controlType = ControlType;
  override items: transferViewModel[] = [];
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
      FromWarehouseId:[this.searchViewModel.FromWarehouseId],
      ToWarehouseId:[this.searchViewModel.ToWarehouseId],
      WarehouseToWarehouseStatus:[this.searchViewModel.WarehouseToWarehouseStatus],
      From:[this.searchViewModel.From],
      To:[this.searchViewModel.To],
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
    this.page.searchForm.patchValue({ statusId: statusId });
  }
  loadWarehouses() {
    this._pageService.getWarehouses().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.WarehouseList = res.data || [];
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

  showCartDialog(event: Event) {
    event.preventDefault();
    this.cartVisible = true;
  }

  closeCartDialog() {
    this.cartVisible = false;
  }
}