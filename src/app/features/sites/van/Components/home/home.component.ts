import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { salesManActivateViewModel, salesManSearchViewModel, salesManViewModel } from '../../interfaces/salesMan';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { salesMan } from '../../service/salesMan.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/salesMan';
  override searchViewModel: salesManSearchViewModel = new salesManSearchViewModel();
  modalRef: BsModalRef;
  override items: salesManViewModel[] = [];
  selectedItem: salesManViewModel;
  id:string;
  activation: salesManActivateViewModel = { id: '' };
  constructor(public override _sharedService: SharedService,
    private _pageService: salesMan, private _router: Router, private activatedRoute: ActivatedRoute 

  ) {
    super(_sharedService);
  }
  classifies = [
    { id: 1, name: 'Retail' },
    { id: 2, name: 'VIP Clients' },
    { id: 3, name: 'Telesales' },
  ];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log("Received ID:", id); 
     
  });
    this.initializePage();
  }


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "Name", Title: "sites.salesMan.salesMan", Selectable: false, Sortable: true },
      { Name: "NationalNumber ", Title: "sites.salesMan.nationalNumber", Selectable: false, Sortable: true },
      { Name: "Mobile ", Title: "sites.salesMan.mobile", Selectable: false, Sortable: true },
      { Name: "JobCode  ", Title: "sites.salesMan.jobCode", Selectable: false, Sortable: true },
      { Name: "Email  ", Title: "sites.salesMan.email", Selectable: false, Sortable: true },
      { Name: "Address  ", Title: "sites.salesMan.address", Selectable: false, Sortable: true },
      { Name: "BirthDate  ", Title: "sites.salesMan.birthDate", Selectable: false, Sortable: true },
      { Name: "AppointmentDate   ", Title: "sites.salesMan.appointmentDate", Selectable: false, Sortable: true },
      { Name: "Image  ", Title: "sites.salesMan.image", Selectable: false, Sortable: true },
      { Name: "isActive", Title: "sites.salesMan.isActive", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.salesMan.action", Selectable: false, Sortable: true },

    ];
    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateSalesMan() {
    this._router.navigate(['/sites/salesMan/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Name: [this.searchViewModel.Name],
      NationalNumber: [this.searchViewModel.NationalNumber],
      Mobile: [this.searchViewModel.Mobile],
      WareHouseId:[this.searchViewModel.WareHouseId]
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
        this.items = response.data.items as salesManViewModel[];
      }
      this.fireEventToParent()
    });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: salesManViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  }



  remove() {
    this._pageService.remove(this.selectedItem).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.isSuccess) {
        let index = this.items.findIndex(x => x.id == this.selectedItem.id);
        this.items.splice(index, 1);
        this.search();
      }
    })
  }



  editSalesMan(id: string) {
    console.log('Navigating to edit with ID:', id); 
    this._router.navigate(['/sites/salesMan/edit', id]);
}


  updateActivation(item: salesManViewModel, isActive: boolean) {
    this.page.isSaving = true
    this.activation.id = item.id;
    const updateObservable = isActive ? this._pageService.updateActivated(this.activation) : this._pageService.updateDeactivated(this.activation);

    updateObservable.subscribe({
      next: (response) => {
        this.page.isSaving = false
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          item.isActive = !item.isActive
          this.search();
        }
      },
      error: (error) => {
        this.page.isSaving = true
        this._sharedService.showToastr(error);
      },
    });
  }
  @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
  showDeleteConfirmations(selectedItem: salesManViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedVans() {
    const selectedIds = this.items
      .filter(item => item.selected) // Filter selected rows
      .map(item => item.id);         // Extract IDs

    if (selectedIds.length === 0) {

      return;
    }
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
    this.modalRef.content = {
      onConfirm: () => {
        // Call the delete API
        this._pageService.bulkDelete(selectedIds).subscribe({
          next: (response) => {
            this._sharedService.showToastr(response);
            if (response.isSuccess) {
              // Remove the deleted items from the local list
              this.items = this.items.filter(item => !selectedIds.includes(item.id));
              this.search();
            }
          },
          error: (error) => {
            this._sharedService.showToastr(error);
          }
        });
      },
    };
  }


  activateVans() {
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

  disActiveVans() {
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
  
  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
   }
 
}
