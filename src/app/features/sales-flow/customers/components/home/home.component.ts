import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { customerActivateViewModel, customerSearchViewModel, customerSelectedViewModel, customerViewModel } from '../../interfaces/customers';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CustomersService } from '../../service/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from "../../../../../shared/shared.module";
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/customers';
  override searchViewModel: customerSearchViewModel = new customerSearchViewModel();
  modalRef: BsModalRef;
  override items: customerViewModel[] = [];
  selectedItem: customerViewModel;
  showDownloadOptions = false;
  records: number;
  activation: customerActivateViewModel = { id: '' }
  @ViewChild('downloadButton') downloadButton: ElementRef;
  @ViewChild('downloadOptions') downloadOptions: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.downloadOptions?.nativeElement.contains(event.target) ||
      this.downloadButton?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showDownloadOptions = false;
    }
  }

  customerActivity = [
    { id: 1, name: 'CarWash' },
    { id: 2, name: 'ServiceStation' },
    { id: 3, name: 'GasStation' },
    { id: 4, name: 'Trader' },

  ]

   ClientType = [
    { id: 1, name: 'Retail' },
    { id: 2, name: 'Wholesale' },
    { id: 3, name: 'VIPClients' }
  ];
  status: customerSelectedViewModel[] = [];
  customerGroups: customerSelectedViewModel[] = [];
  constructor(
    public override _sharedService: SharedService,
    private _pageService: CustomersService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();

  }


  initializePage() {
    this.page.columns = [

      { Name: 'No', Title: '#', Selectable: true, Sortable: false },
      { Name: 'Name', Title: 'salesflow.customers.name', Selectable: false, Sortable: true },
      { Name: 'Activation', Title: 'salesflow.customers.activation', Selectable: false, Sortable: true },
      { Name: 'Client Group Name', Title: 'salesflow.customers.Client Group Name', Selectable: false, Sortable: true },
      { Name: 'ClientType', Title: 'salesflow.customers.clientType', Selectable: false, Sortable: true },
      { Name: 'Email', Title: 'salesflow.customers.email', Selectable: false, Sortable: true },
      { Name: 'National Number', Title: 'salesflow.customers.nationalNumber', Selectable: false, Sortable: true },
      { Name: 'Mobile', Title: 'salesflow.customers.mobile', Selectable: false, Sortable: true },
      { Name: 'Action', Title: 'salesflow.customers.action', Selectable: false, Sortable: true },


    ];
    forkJoin([this._pageService.getClientGroups()]).subscribe((res) => {
      this.customerGroups = res[0].data;
    });
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }

  navigateToCreateCustomer() {
    this._router.navigate(['/salesflow/customers/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Name: [this.searchViewModel.Name],
      Email: [this.searchViewModel.Email],
      NationalNumber: [this.searchViewModel.NationalNumber],
      ClientGroupId: [this.searchViewModel.ClientGroupId],
      Mobile: [this.searchViewModel.Mobile],
      clientType: [this.searchViewModel.clientType],
      From: [this.searchViewModel.From],
      To: [this.searchViewModel.To]

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

        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as customerViewModel[];
        }
        this.fireEventToParent();
      });
  }

  // @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  // showDeleteConfirmation(selectedItem: customerViewModel) {
  //   this.selectedItem = selectedItem;
  //   this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  // }

  updateActivation(id: string, isActive: boolean) {
    this.activation.id = id;
    const updateObservable = isActive ? this._pageService.updateActivated(this.activation) : this._pageService.updateDeactivated(this.activation);

    updateObservable.subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.initializePage();

        }
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      },
    });
  }

  editCustomer(id: string) {
    this._router.navigate(['/salesflow/customers/edit', id]);
  }

  activateCustomers() {
    const selectedIds = this.items
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedIds.length > 0) {
      this._pageService.bulkActivate(selectedIds).subscribe(response => {
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.items.forEach(item => {
            if (selectedIds.includes(item.id)) {
              item.isActive = true;
            }
          });
        }
      });
    }
  }

  disActiveCustomers() {
    const selectedIds = this.items
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedIds.length > 0) {
      this._pageService.bulkDeactivate(selectedIds).subscribe(response => {
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.items.forEach(item => {
            if (selectedIds.includes(item.id)) {
              item.isActive = false;
            }
          });
        }
      });
    }
  }


  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
  }
  getOrderStatusName(statusId: number): string {
    const status = this.customerActivity.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }


  getClientType(statusId: number): string {
    const status = this.ClientType.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }



  isAllSelected(): boolean {
    return this.items.every(item => item.selected);
  }

  // Toggle the selection of all items
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.items.forEach(item => {
      item.selected = isChecked;
    });
  }
  downloadExcel() {
    this.showDownloadOptions = false;

    this._pageService.getCustomerExcel(this.searchViewModel).subscribe({
      next: (response: Blob) => {
        const fileName = 'Customers.xlsx';
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
          this.items = response.data.items as customerViewModel[];
          this.records = response.data.records;

          // Now generate the PDF after fetching the data
          this.generatePDF();
        }

        this.fireEventToParent();
      });
  }

  generatePDF() {
    const doc = new jsPDF({
      orientation: "landscape", // Wider layout for large tables
      unit: "mm",
      format: "a4",
    });

    // Title Styling
    doc.setFontSize(18);
    doc.text("Customers List", 14, 15);

    // Table Headers
    const headers = [
      [
        "No",
        "Name",
        "Activation",
        "Client Group",
        "Email",
        "Verify Status",
        "National Number",
        "Total Orders",
        "Mobile",
        "Phone",
        "Customer Activity",
      ],
    ];

    // Table Data
    const data = this.items.map((item, index) => [
      index + 1,
      item.name,
      item.isActive ? "Active" : "Inactive",
      item.clientGroupName,
      item.email,
      item.nationalNumber,
      item.mobile,
    ]);

    // Generate Table with Better Formatting
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25, // Start table below title
      theme: "grid", // Adds borders
      styles: {
        fontSize: 10, // Reduce font size
        cellPadding: 2, // Adjust spacing
      },
      headStyles: {
        fillColor: [44, 62, 80], // Dark blue header
        textColor: [255, 255, 255], // White text
        fontSize: 11,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // No
        1: { cellWidth: 30 }, // Name
        2: { cellWidth: 20 }, // Activation
        3: { cellWidth: 30 }, // Client Group Name
        4: { cellWidth: 40 }, // Email
        5: { cellWidth: 20 }, // Verify Status
        6: { cellWidth: 25 }, // National Number
        7: { cellWidth: 20 }, // Total Orders
        8: { cellWidth: 25 }, // Mobile
        9: { cellWidth: 25 }, // Phone
        10: { cellWidth: 30 }, // Customer Activity
      },
      margin: { top: 20 },
      pageBreak: "auto", // Automatically insert page breaks
    });

    // Save PDF
    doc.save("customers.pdf");
  }

  toggleDownloadOptions() {
    this.showDownloadOptions = !this.showDownloadOptions;
  }



    navigateToDetails(id: string) {
    this._router.navigate(['/salesflow/customers/details', id]);
  }

}





