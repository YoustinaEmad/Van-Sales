import { ChangeDetectorRef, Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { OrderService } from '../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from "../../../../../shared/shared.module";
import { forkJoin } from 'rxjs';
import { orderSearchViewModel, orderStatusViewModel, orderViewModel, shippingAddressStatusViewModel } from '../../interface/order';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/order';
  override searchViewModel: orderSearchViewModel = {};
  modalRef: BsModalRef;
  override items: orderViewModel[] = [];
  idOfShippingAddress: string = '';
  showDownloadOptions = false;
  records: number;
  orderStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'InProcess' },
    { id: 3, name: 'Confirmed' },
    { id: 4, name: 'Cancelled' },
    { id: 5, name: 'Completed' },
  ];
  shippingAddressStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approved' },
    { id: 3, name: 'Rejected' },

  ];


  constructor(
    public override _sharedService: SharedService,
    private _pageService: OrderService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();

  }



  initializePage() {
    this.page.columns = [
      { Name: 'No', Title: '#', Selectable: true, Sortable: false },
      { Name: 'orderNumber', Title: 'Order Number', Selectable: false, Sortable: true },
      { Name: 'name', Title: 'Customer Name', Selectable: false, Sortable: true },
      { Name: 'mobile', Title: ' Customer Mobile', Selectable: false, Sortable: true },
      { Name: 'orderStatus', Title: 'order Status', Selectable: false, Sortable: true },
      { Name: 'totalPrice', Title: 'Total Price', Selectable: false, Sortable: true },
      // { Name: 'shippingAddressId', Title: 'Shipping Address Status', Selectable: false, Sortable: true },
      { Name: 'CreatedDate', Title: 'Created Date', Selectable: false, Sortable: true }
    ];
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }



  navigateToCreateOrder() {
    this._router.navigate(['/salesflow/order/create']);
  }




  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      CustomerName: [this.searchViewModel.CustomerName],
      CustomerNumber: [this.searchViewModel.CustomerNumber],
      OrderNumber: [this.searchViewModel.OrderNumber],
      OrderStatus: [this.searchViewModel.OrderStatus],
      TotalPrice: [this.searchViewModel.TotalPrice],
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To]
    });
    this.page.isPageLoaded = true;
  }



  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    // this.items.From = moment(this.items.From).format('YYYY-MM-DD');
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
          this.items = response.data.items as orderViewModel[];
          this.records = response.data.records;
        }
        this.fireEventToParent();
      });
  }

  editOrder(id: string) {
    this._router.navigate(['/salesflow/order/edit', id]);
  }



  getOrderStatusName(statusId: number): string {
    const status = this.orderStatuslist.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }
  getShippingAddressStatusName(statusId: number): string {
    const status = this.shippingAddressStatuslist.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }


  // updateOrderStatus(item: orderStatusViewModel, newStatus: string) {
  //   this.page.isSaving = true

  //   let updateObservable;

  //   if (newStatus === 'Confirmed') {
  //     updateObservable = this._pageService.ConfirmedOrder(item);
  //   } else if (newStatus === 'Cancelled') {
  //     updateObservable = this._pageService.CancelledOrder(item);
  //   } else if (newStatus === 'InProcess') {
  //     updateObservable = this._pageService.InProcessOrder(item);
  //   } else if (newStatus === 'Completed') {
  //     updateObservable = this._pageService.CompletedOrder(item);
  //   }

  //   updateObservable.subscribe({
  //     next: (response) => {
  //       this.page.isSaving = false
  //       this._sharedService.showToastr(response);
  //       if (response.isSuccess) {
  //         this.search();
  //       }
  //     },
  //     error: (error) => {
  //       this.page.isSaving = true
  //       this._sharedService.showToastr(error);
  //     },
  //   });
  // }

  updateOrderStatus(item: orderStatusViewModel, newStatus: string) {
    this.page.isSaving = true;

    // Check if the selected status is 'Completed'
    const isCompleted = newStatus === 'Completed';

    // Disable other statuses if 'Completed' is selected
    let updateObservable;

    if (newStatus === 'Confirmed') {
      updateObservable = this._pageService.ConfirmedOrder(item);
    } else if (newStatus === 'Cancelled') {
      updateObservable = this._pageService.CancelledOrder(item);
    } else if (newStatus === 'InProcess') {
      updateObservable = this._pageService.InProcessOrder(item);
    } else if (newStatus === 'Completed') {
      updateObservable = this._pageService.CompletedOrder(item);
    }

    updateObservable.subscribe({
      next: (response) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.search();
          if (isCompleted) {
            // Disable other statuses in the dropdown after 'Completed' is selected
            this.disableOtherStatuses(item);
          }
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      },
    });
  }

  isCompletedStatus(item: orderViewModel): boolean {
    return item.orderStatus === 5;
  }

  disableOtherStatuses(item: orderStatusViewModel) {
    // Disable the options other than "Completed" in the dropdown
    const otherStatusOptions = this.orderStatuslist.filter(status => status.name !== 'Completed');

    // Now iterate over the dropdown elements in the table and disable those
    const statusSelects = document.querySelectorAll('select');
    statusSelects.forEach(select => {
      const options = select.querySelectorAll('option');
      options.forEach(option => {
        if (otherStatusOptions.some(status => status.name === option.text)) {
          option.setAttribute('disabled', 'true');
        }
      });
    });
  }

  updateShippingAddressStatus(item: orderViewModel, newStatus: string) {
    this.page.isSaving = true;

    const shippingAddressStatusPayload: shippingAddressStatusViewModel = {
      id: item.id, // Order ID
      shippingAddressId: item.shippingAddressId, // Shipping Address ID
      shippingAddressStatus: newStatus, // New Status
    };

    let updateObservable;

    if (newStatus === 'Approved') {
      updateObservable = this._pageService.ApprovedShippingAddress(shippingAddressStatusPayload);
    } else if (newStatus === 'Rejected') {
      updateObservable = this._pageService.RejectedShippingAddress(shippingAddressStatusPayload);
    }

    updateObservable.subscribe({
      next: (response) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.search(); // Refresh the table or data
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      },
    });
  }


  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }

  navigateToOrderDetails(orderNumber: string) {
    this._router.navigate(['/salesflow/order/details', orderNumber]);

  }
  // updateShippingAddressStatus(item: shippingAddressStatusViewModel, newStatus: string) {
  //   this.page.isSaving = true

  //   let updateObservable;
  //   if (newStatus === 'Approved') {
  //     updateObservable = this._pageService.ApproveShippingAddress(item);
  //   } else if (newStatus === 'Rejected') {
  //     updateObservable = this._pageService.RejectShippingAddress(item);
  //   }


  //   updateObservable.subscribe({
  //     next: (response) => {
  //       this.page.isSaving = false
  //       this._sharedService.showToastr(response);
  //       console.log(response);

  //       if (response.isSuccess) {
  //         console.log(response);
  //         this.search();
  //       }
  //     },
  //     error: (error) => {
  //       this.page.isSaving = true
  //       this._sharedService.showToastr(error);
  //     },
  //   });



  // }




  deleteSelectedOrders() {

  }
  downloadExcel() {
    this.showDownloadOptions = false;

    this._pageService.getOrdersExcel(this.searchViewModel).subscribe({
      next: (response: Blob) => {
        const fileName = 'Orders.xlsx';
        saveAs(response, fileName);
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      },
    });
  }

  downloadPDF() {
    this.showDownloadOptions = false;
    this.page.isSearching = true;
  
    this._pageService
      .get(
        this.searchViewModel,
        this.page.orderBy,
        this.page.isAscending,
        this.page.options.currentPage,
        this.records
      )
      .subscribe((response) => {
        this.page.isSearching = false;
  
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as orderViewModel[];
          this.records = response.data.records;
  
          // Now generate the PDF after fetching the data
          this.generatePDF();
        }
  
        this.fireEventToParent();
      });
  }

  generatePDF() {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('Orders List', 14, 15);
  
    // Table Headers
    const headers = [['No', 'Name', 'Mobile', 'Order Status', 'Total Price']];
  
    // Table Data
    const data = this.items.map((item, index) => [
      index + 1,
      item.name,
      item.mobile,
      item.orderStatus,
      item.totalPrice
    ]);
  
    // Generate Table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20
    });
  
    // Save the PDF
    doc.save('orders.pdf');
  }
  toggleDownloadOptions() {
    this.showDownloadOptions = !this.showDownloadOptions;
  }

}
