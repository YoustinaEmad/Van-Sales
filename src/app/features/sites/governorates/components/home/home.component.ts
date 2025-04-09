import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { GovernorateService } from 'src/app/features/sites/governorates/service/government.service';
import { governorateActivateViewModel, governorateCreateViewModel, governorateSearchViewModel, governorateViewModel } from '../../interfaces/governorate';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/governorates';
  override searchViewModel: governorateSearchViewModel = new governorateSearchViewModel();
  modalRef: BsModalRef;
  isEditing:boolean=false;
  override items: governorateViewModel[] = [];
  selectedItem: governorateViewModel;
  activation: governorateActivateViewModel = { id: '' };
  constructor(public override _sharedService: SharedService,
    private _pageService: GovernorateService, private _router: Router, private activatedRoute: ActivatedRoute ,  private modalService: BsModalService 

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
  }

 editableGovernorate: governorateCreateViewModel = { id: '', name: '', governorateCode: '', isActive: true };

 @ViewChild('GovernorateModalTemplate', { static: false }) GovernorateModalTemplate: TemplateRef<any>;


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "Name", Title: "sites.Governorate.name", Selectable: false, Sortable: true },
      { Name: "Cities", Title: "sites.Governorate.cities", Selectable: false, Sortable: true },
      { Name: "governorateCode", Title: "sites.Governorate.governorateCode", Selectable: false, Sortable: true },
      { Name: "isActive", Title: "sites.Governorate.isActive", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.Governorate.action", Selectable: false, Sortable: true },
    ];
    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateGovernorate() {
    this._router.navigate(['/sites/governorates/create']);
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
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.data.items as governorateViewModel[];
      }
      this.fireEventToParent()
    });
  }

  //Region:Remove Governorate
  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: governorateViewModel) {
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



  editGovernorate(id: string) {
    // Navigate to the create page with the governorate ID
    this._router.navigate(['/sites/governorates/edit', id]);
  }


  updateActivation(item: governorateViewModel, isActive: boolean) {
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
  showDeleteConfirmations(selectedItem: governorateViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedGovernorates() {
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


  activateGovernorates() {
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

  disActiveGovernorates() {
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



  saveGovernorate() {
    if (!this.editableGovernorate.name || !this.editableGovernorate.governorateCode) {
      return;
    }

    const governorate: governorateCreateViewModel = { 
      ...this.editableGovernorate
    };

    this._pageService.postOrUpdate(governorate).subscribe(response => {
      this._sharedService.showToastr(response);
      if (response.isSuccess) {
        this.modalRef?.hide();
        this.search();
      }
    });
}



openGovernorateModal(editMode: boolean, governorate?: governorateViewModel) {
  this.isEditing = editMode;

  if (editMode && governorate) {
    this.editableGovernorate = { 
      id: governorate.id, 
      name: governorate.name, 
      governorateCode: governorate.governorateCode, 
      isActive: governorate.isActive 
    };
  } else {
    this.editableGovernorate = { id: '', name: '', governorateCode: '', isActive: true };
  }

 
  if (this.GovernorateModalTemplate) {
    this.modalRef = this.modalService.show(this.GovernorateModalTemplate, { class: 'modal-md' });
    
  } 
}



}
