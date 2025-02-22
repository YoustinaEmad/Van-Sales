import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AppConfigService } from '../../../../../shared/service/chartServices/app-config-service.service';
import { DesignerServiceService } from '../../../../../shared/service/chartServices/designer-service-service.service'; // Adjust the path as needed
import { orderStatusAndPercentageViewModel, searchViewModel, SiteStatisticsViewModel } from '../../interface/dashboard';
import { DashboardService } from '../../Service/dashboard.service';
import { environment } from 'src/environments/environment';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { orderViewModel } from 'src/app/features/sales-flow/order/interface/order';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/features/sales-flow/order/service/order.service';
import { customerViewModel } from 'src/app/features/sales-flow/customers/interfaces/customers';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/order';
  override searchViewModel: searchViewModel = new searchViewModel();
  modalRef: BsModalRef;
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  configService = inject(AppConfigService);
  designerService = inject(DesignerServiceService);
  siteStatistics: SiteStatisticsViewModel = new SiteStatisticsViewModel();
  customerList: customerViewModel[] = [];
  orderStatuslist: orderStatusAndPercentageViewModel[] = []; // Dynamic list from API

  orderStatuslist2 = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'InProcess' },
    { id: 3, name: 'Confirmed' },
    { id: 4, name: 'Cancelled' },
    { id: 5, name: 'Completed' }
  ];

  constructor(private cd: ChangeDetectorRef, private _dashboardService: DashboardService, public override _sharedService: SharedService, private _orderService: OrderService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(_sharedService);
  }


  ngOnInit() {
    this.initializePage();
    this.createSearchForm();
    this.loadSiteStatistics();
    this.loadOrderStatusPercentage();
     this.loadCustomers();
  }
  initializePage() {
    this.page.columns = [
      { Name: 'No', Title: '#', Selectable: true, Sortable: false },
      { Name: 'orderNumber', Title: 'Order Number', Selectable: false, Sortable: true },
      { Name: 'name', Title: 'Customer Name', Selectable: false, Sortable: true },
      { Name: 'orderStatus', Title: 'order Status', Selectable: false, Sortable: true },
      { Name: 'totalPrice', Title: 'Total Price', Selectable: false, Sortable: true },
  ];
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }


  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To]
    });
    this.page.isPageLoaded = true;
  }





  override search() {
    this.page.isSearching = true;

    Object.assign(this.searchViewModel, this.page.searchForm.value);

    this._dashboardService
      .get(
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
          this.items = response.data.items as orderViewModel[];
        }
        this.fireEventToParent();
      });


    this.loadOrderStatusPercentage();
    this.loadSiteStatistics();
    this.loadCustomers();

  }


  loadCustomers() {
    this.page.isSearching = true;
    this._dashboardService.getCustomers(
      this.searchViewModel,
      this.page.orderBy,
      this.page.isAscending,
      this.page.options.currentPage,
      this.page.options.itemsPerPage
    ).subscribe((response) => {
      this.page.isSearching = false;

      if (response.isSuccess) {
        this.customerList = response.data.items as customerViewModel[];
        this.confingPagination(response);
      } else {
        console.error('Error fetching customer data:', response.message);
      }
    }, (error) => {
      this.page.isSearching = false;
      console.error('An error occurred while fetching customers:', error);
    });
  }

  loadSiteStatistics() {
    this._dashboardService.getSiteStatistics(this.searchViewModel)
      .subscribe((res) => {
        console.log(res.data)
        this.siteStatistics = res.data;
        this.cd.markForCheck();
      }, error => {
        console.error('Error fetching site statistics', error);
      });
  }
  loadOrderStatusPercentage() {



    this._dashboardService.getOrderStatusAndPercentage(this.searchViewModel)
      .subscribe((res) => {
        console.log(res.data);
        this.orderStatuslist = res.data; // Dynamically populate the list
        this.initChart(); // Initialize chart after data load
        this.cd.markForCheck();
      }, error => {
        console.error('Error fetching order status percentage', error);
      });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');

      this.data = {
        datasets: [
          {
            data: this.orderStatuslist.map(status => status.numberOfOrders || 0),
            backgroundColor: ['#972ccc', '#717BBC', '#12b76a', '#f04438', '#a6f4c5']
          }
        ],

      };     
    }
  }

  getTotalNumberOforders(): number {
    return this.orderStatuslist.reduce((total, status) => total + (status.numberOfOrders || 0), 0);
  }


  getOrderStatusName(statusId: number) {
    const status = this.orderStatuslist2.find(s => s.id === statusId);
    return status ? status.name : 'Unknown';
  }

  getCircleClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'bg-purple-500';    // Pending
      case 2: return 'bg-dark-blue-500'; // InProcess
      case 3: return 'bg-green-500';    // Confirmed
      case 4: return 'bg-red-500';      // Cancelled
      case 5: return 'bg-green-300';    // Completed
      default: return '';
    }
  }


  getCountClass(statusId: number): string {
    switch (statusId) {

      case 1: return 'color-purple-500 bg-purple-100';    // Pending
      case 2: return 'color-dark-blue-500 bg-dark-blue-100'; // InProcess
      case 3: return 'color-green-500 bg-green-100';    // Confirmed
      case 4: return 'color-red-500 bg-red-100';      // Cancelled
      case 5: return 'color-green-300 bg-green-100';    // Completed
      default: return '';
    }
  }

  getPercentageClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'color-purple-500';          // Pending
      case 2: return 'color-dark-blue-500  '; // InProcess
      case 3: return 'color-green-500 ';    // Confirmed
      case 4: return 'color-red-500 ';      // Cancelled
      case 5: return 'color-green-300 ';    // Completed
      default: return '';
    }
  }




  navigateToAllOrders() {
    this._router.navigate(['/salesflow/order']);
  }
  navigateToAllCustomers(){
    this._router.navigate(['salesflow/customers']);

  }
  editCustomer(id: string) {
    this._router.navigate(['/salesflow/customers/edit', id]);
  }

  download() {
    const printableContent = document.createElement('div');
    printableContent.id = 'printable-tables';
  
    
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const clonedTable = table.cloneNode(true) as HTMLElement;
      printableContent.appendChild(clonedTable);
    });
  
    
    printableContent.style.position = 'absolute';
    printableContent.style.top = '0';
    printableContent.style.left = '0';
    printableContent.style.width = '100%';
    printableContent.style.backgroundColor = 'white';
    printableContent.style.zIndex = '9999';
    printableContent.style.padding = '20px';
  
    // Apply table-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }
      th {
        background-color: #f2f2f2;
        text-align: left;
      }
    `;
    document.head.appendChild(style);
  
  
    document.body.appendChild(printableContent);
  
    
    const allElements = document.body.children;
    Array.from(allElements).forEach((el) => {
      if (el.id !== 'printable-tables') {
        (el as HTMLElement).style.display = 'none';
      }
    });
  
  
    window.print();
  
    
    setTimeout(() => {
      document.body.removeChild(printableContent);
      document.head.removeChild(style);
      Array.from(allElements).forEach((el) => {
        if (el.id !== 'printable-tables') {
          (el as HTMLElement).style.display = '';
        }
      });
    }, 0);
  }
  
  
}
