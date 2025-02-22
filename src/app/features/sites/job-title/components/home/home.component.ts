import { Component, ViewChild } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { employeeSearchViewModel, employeeViewModel } from '../../interfaces/job-title-view-model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { EmployeeService } from '../../service/job-title.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/jobTitle';
  override searchViewModel: employeeSearchViewModel = new employeeSearchViewModel();
  modalRef: BsModalRef;
  override items: employeeViewModel[] = [];
  selectedItem: employeeViewModel;
  activation: any = { id: '' }

  constructor(public override _sharedService: SharedService,
    private _employeeService: EmployeeService, private _router: Router, private activatedRoute: ActivatedRoute

  ) {
    super(_sharedService);
  }
  RolesEnum = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'Company' },
    { id: 4, name: 'Client' },
  ];

  ngOnInit(): void {
    this.initializePage();
  }


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "Name", Title: "Employee", Selectable: false, Sortable: true },
      { Name: "UserName", Title: "UserName", Selectable: false, Sortable: true },
      { Name: "Mobile", Title: "Mobile", Selectable: false, Sortable: true },
      { Name: "roleId", Title: "Role", Selectable: false, Sortable: true },
      { Name: "jobTitle", Title: "Job Title", Selectable: false, Sortable: true },
      { Name: 'Activation', Title: 'Activation', Selectable: false, Sortable: true },

      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },

    ];


    
  
    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateEmployee() {
    this._router.navigate(['/sites/jobTitle/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      UserName: [this.searchViewModel.UserName],
      Mobile: [this.searchViewModel.Mobile],

    });
    this.page.isPageLoaded = true;
  }

  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._employeeService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as employeeViewModel[];
      }
      this.fireEventToParent()
    });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: employeeViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  }



  remove() {
    this._employeeService.remove(this.selectedItem).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.isSuccess) {
        let index = this.items.findIndex(x => x.id == this.selectedItem.id);
        this.items.splice(index, 1);
        this.search();
      }
    })
  }



  editEmployee(id: string) {
    // Navigate to the create page with the governorate ID
    this._router.navigate(['/sites/jobTitle/edit', id]);
  }

  getRoleName(statusId: number): string {
    const status = this.RolesEnum.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }
 
  @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
  showDeleteConfirmations(selectedItem: employeeViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  // deleteSelectedGovernorates() {
  //   const selectedIds = this.items
  //     .filter(item => item.selected) 
  //     .map(item => item.id);         

  //   if (selectedIds.length === 0) {

  //     return;
  //   }
  //   this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  //   this.modalRef.content = {
  //     onConfirm: () => {
  //       // Call the delete API
  //       this._employeeService.bulkDelete(selectedIds).subscribe({
  //         next: (response) => {
  //           this._sharedService.showToastr(response);
  //           if (response.isSuccess) {
  //             // Remove the deleted items from the local list
  //             this.items = this.items.filter(item => !selectedIds.includes(item.id));
  //             this.search();
  //           }
  //         },
  //         error: (error) => {
  //           this._sharedService.showToastr(error);
  //         }
  //       });
  //     },
  //   };
  // }


 

  
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


  activateCustomers() {
    const selectedIds = this.items
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedIds.length > 0) {
      this._employeeService.bulkActivate(selectedIds).subscribe(response => {



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
  updateActivation(id: string, isActive: boolean) {
    this.activation.id = id;
    const updateObservable = isActive ? this._employeeService.updateActivated(this.activation) : this._employeeService.updateDeactivated(this.activation);

    updateObservable.subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.initializePage();
        } else {
          this._sharedService.showToastr(response);
        }
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      },
    });
  }

  disActiveCustomers() {
    const selectedIds = this.items
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedIds.length > 0) {
      this._employeeService.bulkDeactivate(selectedIds).subscribe(response => {
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
}
