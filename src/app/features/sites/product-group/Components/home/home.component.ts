import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import {productGroupViewModel ,productGroupSearchViewModel ,productGroupActivateViewModel,productGroupCreateViewModel}from '../../interfaces/product-group'
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { ProductGroupService } from '../../services/product-group.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/productGroup';
  override searchViewModel: productGroupSearchViewModel = new productGroupSearchViewModel();
  modalRef: BsModalRef;
  isEditing:boolean=false;
  override items: productGroupViewModel[] = [];
  selectedItem: productGroupViewModel;
  activation: productGroupActivateViewModel = { id: '' };
  constructor(public override _sharedService: SharedService,
    private _pageService: ProductGroupService, private _router: Router, private activatedRoute: ActivatedRoute ,  private modalService: BsModalService 

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
  }

  editableProductGroup: productGroupCreateViewModel = { id: '', name: '', isActive: true };

 @ViewChild('productGroupModalTemplate', { static: false }) productGroupModalTemplate: TemplateRef<any>;


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "Name", Title: "Product Group", Selectable: false, Sortable: true },
      { Name: "isActive", Title: "Activation", Selectable: false, Sortable: true },
      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },

    ];
    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateProductGroup() {
    this._router.navigate(['/sites/productGroup/create']);
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
    const mappedSearchViewModel: productGroupViewModel = { 
      id: '', 
      name: this.searchViewModel.Name || '', 
      isActive: true 
    };
    this._pageService.get(mappedSearchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as productGroupViewModel[];
      }
      this.fireEventToParent()
    });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: productGroupViewModel) {
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



  editproductGroup(id: string) {
    this._router.navigate(['/sites/productGroup/edit', id]);
  }


  updateActivation(item: productGroupViewModel, isActive: boolean) {
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
  showDeleteConfirmations(selectedItem: productGroupViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedProductGroups() {
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


  activateProductGroups() {
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

  disActiveProductGroups() {
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



  saveProductGroup() {
    if (!this.editableProductGroup.name ) {
      return;
    }

    const productGroup: productGroupCreateViewModel = { 
      ...this.editableProductGroup
    };

    this._pageService.postOrUpdate(productGroup).subscribe(response => {
      this._sharedService.showToastr(response);
      if (response.isSuccess) {
        this.modalRef?.hide();
        this.search();
      }
    });
}



openProductGroupModal(editMode: boolean, productGroup?: productGroupViewModel) {
  this.isEditing = editMode;

  if (editMode && productGroup) {
    this.editableProductGroup = { 
      id: productGroup.id, 
      name: productGroup.name,  
      isActive: productGroup.isActive 
    };
  } else {
    this.editableProductGroup = { id: '', name: '', isActive: true };
  }

 
  if (this.productGroupModalTemplate) {
    this.modalRef = this.modalService.show(this.productGroupModalTemplate, { class: 'modal-md' });
    
  } 
}



}
