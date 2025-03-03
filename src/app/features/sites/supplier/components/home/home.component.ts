import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { supplierActivateViewModel, supplierCreateViewModel, supplierSearchViewModel, supplierViewModel } from '../../interfaces/supplier';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { SupplierService } from '../../service/supplier.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/supplier';
  override searchViewModel: supplierSearchViewModel = new supplierSearchViewModel();
  modalRef: BsModalRef;
  isEditing:boolean=false;
  isAddingNewAddress:boolean=false
  override items: supplierViewModel[] = [];
  selectedItem: supplierViewModel;
  activation: supplierActivateViewModel = { id: '' };
  constructor(public override _sharedService: SharedService,
    private _pageService: SupplierService, private _router: Router, private activatedRoute: ActivatedRoute,  private modalService: BsModalService

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
  }
  // editableSupplier: supplierCreateViewModel = { id: '', name: '', governorateCode: '', isActive: true };
  

 
  // @ViewChild('supplierModalTemplate', { static: false }) supplierModalTemplate: TemplateRef<any>;

  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },

      { Name: "name", Title: "Name", Selectable: false, Sortable: true },
      { Name: "code", Title: "Code", Selectable: false, Sortable: true },
      { Name: "mobile", Title: "Mobile", Selectable: false, Sortable: true },
      { Name: "address", Title: "Address", Selectable: false, Sortable: true },
       { Name: "path", Title: "Path", Selectable: false, Sortable: true },
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

  navigateToCreateSupplier() {
    this._router.navigate(['/sites/supplier/create']);
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
        this.items = response.data.items as supplierViewModel[];
      }
      this.fireEventToParent()
    });
  }


  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: supplierViewModel) {
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



  editSupplier(id: string) {
    this._router.navigate(['/sites/supplier/edit', id]);
  }

  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
  }
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
  @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
  showDeleteConfirmations(selectedItem: supplierViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedSuppliers() {
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


  activateSuppliers() {
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

  disActiveSuppliers() {
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




  // saveSupplier() {
  //   if (!this.editableSupplier.name || !this.editableSupplier.governorateCode) {
  //     return;
  //   }
  
  //   const supplier: supplierViewModel = {
  //     ...this.editableSupplier,
  //     cities: this.editableSupplier.cities ?? [], 
  //   };
  
  //   this._pageService.postOrUpdate(supplier).subscribe(response => {
  //     this._sharedService.showToastr(response);
  //     if (response.isSuccess) {
  //       setTimeout(() => {
  //         if (this.modalRef) {
  //           this.modalRef.hide();
  //         }
  //       });
  //       this.search();
  //     }
  //   });
  // }
  

  // openSupplierModal(editMode: boolean, supplier?: supplierViewModel) {
  //   this.isEditing = editMode;
  
  //   if (editMode && supplier) {
  //     this.editableSupplier = { 
  //       id: supplier.id, 
  //       name: supplier.name, 
  //       governorateCode: supplier.governorateCode, 
  //       isActive: supplier.isActive 
  //     };
  //   } else {
  //     this.editableSupplier = { id: '', name: '', governorateCode: '', isActive: true };
  //   }
  
  //   // Open modal
  //   this.modalRef = this.modalService.show(this.supplierModalTemplate, { class: 'modal-md' });
  // }
  



}
