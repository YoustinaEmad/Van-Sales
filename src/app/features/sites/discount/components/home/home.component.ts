import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { DiscountService } from '../../service/discount.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DicountViewModel, discountActivateViewModel } from 'src/app/features/sites/discount/interfaces/dicount-view-model'; // Corrected import
import { DiscountModule } from '../../discount.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/discount';
  modalRef: BsModalRef;
  override items: DicountViewModel[] = []; 
  selectedItem: DicountViewModel; 
  activation: discountActivateViewModel = { id: ''}
  constructor(public override _sharedService: SharedService,
    private _pageService: DiscountService, private _router: Router, private activatedRoute: ActivatedRoute,private cdRef: ChangeDetectorRef) {
    super(_sharedService);
  }
  ngOnInit(): void {
    this.initializePage();
  }
  initializePage() {
    this.page.columns = [
   
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
    
      { Name: "Name", Title: "Discount Name", Selectable: false, Sortable: true },
      { Name: "discountCategory", Title: "Discount Category", Selectable: false, Sortable: true },
      { Name: "discountType", Title: "Discount Type", Selectable: false, Sortable: true },
      { Name: "amount", Title: "Amount", Selectable: false, Sortable: true },
      { Name: "receiptAmount", Title: "Receipt Amount", Selectable: false, Sortable: true },
      { Name: "startDate", Title: "Start Date", Selectable: false, Sortable: true },
      { Name: "endDate", Title: "End Date", Selectable: false, Sortable: true },
      { Name: "isActive", Title: "Activation", Selectable: false, Sortable: true },   
      { Name: "quantity", Title: "Quantity", Selectable: false, Sortable: true },
      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },
    ];
    this.search();
  }

  navigateToCreateGovernorate() {
    this._router.navigate(['/sites/discount/create']);
  }
  
  override search() {
    this.page.isSearching = true;
    this.items = [];
    this._pageService.get(this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage)
      .subscribe(response => {
        this.page.isSearching = false;
        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response)
          this.items = response.data.items as DicountViewModel[]; 
          
        }
        this.fireEventToParent()
      });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: DicountViewModel) { 
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

  editDiscount(id: string) {
    this._router.navigate(['/sites/discount/edit', id]);
  }

  updateActivation(id: string, isActive: boolean) {
    this.activation.id=id;
    const updateObservable = isActive ? this._pageService.updateActivated(this.activation) : this._pageService.updateDeactivated(this.activation);
      updateObservable.subscribe({
      next: (response) => {
        this._sharedService.showToastr(response);
        if (response.isSuccess) {
          this.search(); 
        } else {
          this._sharedService.showToastr(response);
        }
      },
      error: (error) => {
        this._sharedService.showToastr(error);
      },
    });
  }
   @ViewChild('confirmDeleteTemplates', { static: false }) confirmDeleteTemplates: any;
    showDeleteConfirmations(selectedItem: DiscountModule) {
      this.selectedItem = selectedItem as DicountViewModel;

      this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
    }
  deleteSelectedDiscounts()
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

  activateDiscounts()
  {
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

  disActiveDiscounts()
  {
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
}
