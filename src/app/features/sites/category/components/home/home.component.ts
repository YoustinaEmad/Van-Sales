import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { categoryActivateViewModel, categorySearchViewModel, categorySelectedItem, categoryViewModel, subCategorySelectedItem } from '../../interfaces/category-view-model';
import { CategoryService } from '../../service/category.service';
import { forkJoin } from 'rxjs';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/category';
  override searchViewModel: categorySearchViewModel = {};
  modalRef: BsModalRef;
  override items: categoryViewModel[] = [];
  selectedItem: categoryViewModel;
  categories: categorySelectedItem[] = [];
  subCategories: any[] = [];
  selectedCategoryId: string = '';  
  activation: categoryActivateViewModel = { id: ''};

  constructor(public override _sharedService: SharedService,
              private _pageService: CategoryService,
              private _router: Router,
              private activatedRoute: ActivatedRoute) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage() {
    this.page.columns = [
    
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "Name", Title: "Category", Selectable: false, Sortable: true },
      { Name: "ProductCount", Title: "Product Count", Selectable: false, Sortable: true },
      { Name: "SubcategoryCount", Title: "Sub Category Count", Selectable: false, Sortable: true },
      { Name: "IsActive", Title: "Activation", Selectable: false, Sortable: true },
      { Name: "ImagePath", Title: "Img", Selectable: false, Sortable: true },
      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },
    ]
    forkJoin([this._pageService.getCategories()]).subscribe((res) => {
      this.categories = res[0].data;
    });

    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }

  
  navigateToCreateCategory() {
    this._router.navigate(['/sites/category/create']);
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      CategoryId: [this.searchViewModel.CategoryId],  
      SubCategoryId: [this.searchViewModel.SubCategoryId],
    });
    this.page.isPageLoaded = true;
  }
  onCategoryChange(categoryId: string) {
    this.loadSubCategories(categoryId);  
  }
  loadSubCategories(categoryId: string) {
    this.subCategories = []; 
    if (!categoryId) return; 
    this._pageService.getSubCategories(categoryId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.subCategories = res.data;
        } else {
          this.subCategories = []; 
        }
      },
      error: (err) => {
        this.subCategories = []; 
      }
    });
  }

  override search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._pageService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage)
      .subscribe(response => {
        this.page.isSearching = false;
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data.items as categoryViewModel[];
        }
        this.fireEventToParent();
      });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;

  showDeleteConfirmation(selectedItem: categoryViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  }

  remove() {
    this._pageService.remove(this.selectedItem).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.isSuccess) {
        let index = this.items.findIndex(x => x.id == this.selectedItem.id);
        this.items.splice(index, 1);
        this.search();
      }
      else{
        this._sharedService.showToastr(res);
      }
    });
  }

  editCategory(id: string) {  
    this._router.navigate(['/sites/category/edit', id]);
  }

  updateActivation(item: categoryViewModel, isActive: boolean) {
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
  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
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

  @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
  showDeleteConfirmations(selectedItem: categoryViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedCategories() {
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


activateCategories() {
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

disActiveCategories() {
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
}
