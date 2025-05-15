import { Component, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { warehouseActivateViewModel, warehouseSearchViewModel, WarehouseViewModel } from '../../interfaces/warehouse-view-model';
import { SharedService } from 'src/app/shared/service/shared.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/warehouse';
  override searchViewModel: warehouseSearchViewModel = new warehouseSearchViewModel();
  modalRef: BsModalRef;
  override items: WarehouseViewModel[] = [];
  selectedItem: WarehouseViewModel;
  activation: warehouseActivateViewModel = { id: '' };
  isDialogOpen = false; // Control dialog visibility
  WarehouseType = [
    { id: 1, name: "MainBranch" },
    { id: 2, name: "SubBranch" }
  ];

  governorates: governorateViewModel[] = [];
  cities: any[] = []; // Store cities here

  openCreateDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }
  constructor(public override _sharedService: SharedService,
    private _pageService: WarehouseService, private _router: Router, private activatedRoute: ActivatedRoute

  ) {
    super(_sharedService);
  }
  ngOnInit(): void {
    this.initializePage();
    this.loadGovernorates();
    this.loadCities();
  }


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "Name", Title: "sites.Warehouse.warehouse", Selectable: false, Sortable: true },
      { Name: "code", Title: "sites.Warehouse.code", Selectable: false, Sortable: true },
      { Name: "data", Title: "sites.Warehouse.data", Selectable: false, Sortable: true },
      { Name: "warehouseType", Title: "sites.Warehouse.warehouseType", Selectable: false, Sortable: true },
      { Name: "governorateName", Title: "sites.Warehouse.governorate", Selectable: false, Sortable: true },
      { Name: "cityName", Title: "sites.Warehouse.city", Selectable: false, Sortable: true },
      { Name: "street", Title: "sites.Warehouse.street", Selectable: false, Sortable: true },
      { Name: "landmark", Title: "sites.Warehouse.landmark", Selectable: false, Sortable: true },
      { Name: "buildingData", Title: "sites.Warehouse.buildingData", Selectable: false, Sortable: true },
      { Name: "numberOfProduts", Title: "sites.Warehouse.numberOfProduts", Selectable: false, Sortable: true },
      { Name: "totalQuantity", Title: "sites.Warehouse.totalQuantity", Selectable: false, Sortable: true },
      { Name: "totalQuantity", Title: "sites.Warehouse.totalProductsWight", Selectable: false, Sortable: true },
      { Name: "isActive", Title: "sites.Warehouse.activation", Selectable: false, Sortable: true },
      { Name: "Action", Title: "sites.Warehouse.action", Selectable: false, Sortable: true },


      
    ];



    // this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateWarehouse() {
    this._router.navigate(['/sites/warehouse/create']);
  }
  getWarehouseTypeName(id: number): string {
    const warehouseType = this.WarehouseType.find(type => type.id === id);
    return warehouseType ? warehouseType.name : 'Unknown'; // Default to 'Unknown' if the id doesn't match any warehouse type
  }
  onGovernorateChange(governorateId: string) {
    this.loadCities(governorateId); // Load cities for the selected governorate
  }
  loadGovernorates() {
    this._pageService.getGovernorates().subscribe((res) => {
      if (res.isSuccess) {
        this.governorates = res.data; // Ensure this is populated with data
      } else {
        console.log('Failed to load governorates:', res);
      }
    });
  }

  loadCities(governorateId?: string) {
    this.cities = [];
    this._pageService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data; // Ensure this is populated with data
      } else {
        console.log('Failed to load cities:', res);
      }
    });
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      Name: [this.searchViewModel.Name],
      Code: [this.searchViewModel.Code],
      Data: [this.searchViewModel.Data],
      WarehouseType: [this.searchViewModel.WarehouseType],
      GovernorateId: [this.searchViewModel.GovernorateId],
      CityId: [this.searchViewModel.CityId],
      Street: [this.searchViewModel.Street],
      Landmark: [this.searchViewModel.Landmark]
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
        this.items = response.data.items as WarehouseViewModel[];
      }
      this.fireEventToParent()
    });
  }

  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: WarehouseViewModel) {
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


  editWarehouse(id: string) {
    this._router.navigate(['/sites/warehouse/edit', id]);
  }

  updateActivation(item: WarehouseViewModel, isActive: boolean) {
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
  showDeleteConfirmations(selectedItem: WarehouseViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplates, { class: 'modal-sm' });
  }

  deleteSelectedWarehousees() {
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

  activateWarehousees() {
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

  disActiveWarehouses() {
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

  //Toggle the selection of all items
  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.items.forEach(item => {
      item.selected = isChecked;
    });
  }


  navigateToWarehouseDetails(id: string) {
    this._router.navigate(['/sites/warehouse/details', id]);

  }


}
