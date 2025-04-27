import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import {
  customerGroupSearchViewModel,
  customerGroupTaxesViewModel,
  customerGroupViewModel,
} from '../../interfaces/customer-group-view-model';
import { CustomerGroupService } from '../../service/customer-group.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/customergroup';
  override searchViewModel: customerGroupSearchViewModel = new customerGroupSearchViewModel();
  modalRef: BsModalRef;
  override items: customerGroupViewModel[] = [];
  selectedItem: customerGroupViewModel;
  editableCustomerGroup: customerGroupViewModel = { id: '', name: '' };
  isEditing:boolean=false;
 @ViewChild('CustomerGroupModalTemplate', { static: false }) CustomerGroupModalTemplate: TemplateRef<any>;
  constructor(
    public override _sharedService: SharedService,
    private _pageService: CustomerGroupService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
     private modalService: BsModalService 
  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "Name", Title: "Name", Selectable: false, Sortable: true },
      // { Name: "isActive", Title: "Activation", Selectable: false, Sortable: true },
      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },
    ];
    //this.subscribeToParentEvent();
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }

  navigateToCreateCustomerGroup() {
    this._router.navigate(['/salesflow/customergroup/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Name: [this.searchViewModel.Name],
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
          this.items = response.data.items as customerGroupViewModel[];
        }
        this.fireEventToParent();
      });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: customerGroupViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  }

  remove() {
    this._pageService.remove(this.selectedItem).subscribe((res) => {
      this._sharedService.showToastr(res);
      if (res.isSuccess) {
        const index = this.items.findIndex((x) => x.id === this.selectedItem.id);
        this.items.splice(index, 1);
        this.initializePage();
      }
    });
  }

  editCustomerGroup(id: string) {
    this._router.navigate(['/salesflow/customergroup/edit', id]);
  }

  updateTaxExemptStatus(item: customerGroupTaxesViewModel) {
   
    this._pageService.updateTaxExemptStatus(item).subscribe({
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


  @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
      showDeleteConfirmations(selectedItem: customerGroupViewModel) {
        this.selectedItem = selectedItem as customerGroupViewModel;
  
        this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
      }
      deleteSelectedCustomerGroups()
    {
      const selectedIds = this.items
      .filter(item => item.selected) 
      .map(item => item.id);         
  
    if (selectedIds.length === 0) {
  
      return;
    }
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
    this.modalRef.content = {
      onConfirm: () => {
        
        this._pageService.bulkDelete(selectedIds).subscribe({
          next: (response) => {
            this._sharedService.showToastr(response);
            if (response.isSuccess) {
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
   
  
    saveCustomerGroup() {
      if (!this.editableCustomerGroup.name) {
        return;
      }
    
      if (this.isEditing) {
        // Editing existing customer group
        this._pageService.postOrUpdate(this.editableCustomerGroup).subscribe(response => {
          this._sharedService.showToastr(response);
          if (response.isSuccess) {
            this.modalRef.hide();
            this.search();
          }
        });
      } else {
        // Creating new customer group
        this._pageService.postOrUpdate(this.editableCustomerGroup).subscribe(response => {
          this._sharedService.showToastr(response);
          if (response.isSuccess) {
            this.modalRef.hide();
            this.search();
          }
        });
      }
    }
    
    // activateCustomerGroups() {
    //   const selectedIds = this.items
    //     .filter(item => item.selected)
    //     .map(item => item.id);
  
    //   if (selectedIds.length > 0) {
    //     this._pageService.bulkActivate(selectedIds).subscribe(response => {
    //       this._sharedService.showToastr(response);
    //       if (response.isSuccess) {
    //         this.items.forEach(item => {
    //           if (selectedIds.includes(item.id)) {
    //             item.isActive = true;
    //           }
    //         });
    //       }
    //     });
    //   }
    // }
  
    // disActiveCustomerGroups() {
    //   const selectedIds = this.items
    //     .filter(item => item.selected)
    //     .map(item => item.id);
  
    //   if (selectedIds.length > 0) {
    //     this._pageService.bulkDeactivate(selectedIds).subscribe(response => {
    //       this._sharedService.showToastr(response);
    //       if (response.isSuccess) {
    //         this.items.forEach(item => {
    //           if (selectedIds.includes(item.id)) {
    //             item.isActive = false;
    //           }
    //         });
    //       }
    //     });
    //   }
    // }



    openCustomerGroupModal(editMode: boolean, CustomerGroup?: customerGroupViewModel) {
      this.isEditing = editMode;
    
      if (editMode && CustomerGroup) {
        this.editableCustomerGroup = { 
          id: CustomerGroup.id, 
          name: CustomerGroup.name,  
         // isActive: CustomerGroup.isActive 
        };
      } else {
        this.editableCustomerGroup = { id: '', name: ''};
      }
    
     
      if (this.CustomerGroupModalTemplate) {
        this.modalRef = this.modalService.show(this.CustomerGroupModalTemplate, { class: 'modal-md' });
        
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
}
