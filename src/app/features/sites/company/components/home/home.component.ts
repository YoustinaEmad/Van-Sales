import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CompanyService } from 'src/app/features/sites/company/service/company.service';
import { CompanySearchViewModel, CompanyViewModel } from '../../interfaces/company';
import { governorateViewModel } from '../../../governorates/interfaces/governorate';
import { CityService } from '../../../city/service/city.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/company';
  override searchViewModel: CompanySearchViewModel = new CompanySearchViewModel()
  modalRef: BsModalRef;
  override items: CompanyViewModel[] = [];
  selectedItem: CompanyViewModel;
  governorates: governorateViewModel[] = [];
  cities: any[] = []; // Store cities here


  constructor(public override _sharedService: SharedService,
    private _pageService: CompanyService, private _router: Router, private activatedRoute: ActivatedRoute, private _cityService: CityService

  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.initializePage();
    this.loadGovernorates();
    this.loadCities();
  }

  // Update Governorate selection
  onGovernorateChange(governorateId: string) {
    this.loadCities(governorateId); // Load cities for the selected governorate
  }


  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "Name", Title: "Company", Selectable: false, Sortable: true },
      { Name: "Address", Title: "Address", Selectable: false, Sortable: true },
      { Name: "City", Title: "City", Selectable: false, Sortable: true },
      { Name: "Governorate", Title: "Governorate", Selectable: true, Sortable: false },
      { Name: "Mobile Number", Title: "Mobile Number", Selectable: false, Sortable: true },
      { Name: "TaxRegistryNumber", Title: "TaxRegistryNumber", Selectable: false, Sortable: true },
      { Name: "TaxCardID", Title: "TaxCardID", Selectable: false, Sortable: true },
      { Name: "NID", Title: "NID", Selectable: true, Sortable: false },
      { Name: "ManagerName", Title: "ManagerName", Selectable: false, Sortable: true },
      { Name: "ManagerMobile", Title: "ManagerMobile", Selectable: false, Sortable: true },
      { Name: "classification", Title: "Classification", Selectable: false, Sortable: true },
      { Name: "Action", Title: "Action", Selectable: false, Sortable: true },
    ];
    //this.subscribeToParentEvent()
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm)
      this.search();
    });
  }

  navigateToCreateCompany() {
    this._router.navigate(['/sites/company/create']);
  }

  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      CompanyName: [this.searchViewModel.CompanyName],
      GovernorateID: [this.searchViewModel.GovernorateID],
      CityID: [this.searchViewModel.CityID],
    });
    this.page.isPageLoaded = true;
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
          this.items = response.data.items as CompanyViewModel[];
        }
        this.fireEventToParent();
      });
  }


  //Region:Remove Governorate
  @ViewChild('confirmDeleteTemplate', { static: false }) confirmDeleteTemplate: any;
  showDeleteConfirmation(selectedItem: CompanyViewModel) {
    this.selectedItem = selectedItem;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeleteTemplate, { class: 'modal-sm' });
  }

  loadGovernorates() {
    // Use CityService to fetch governorates
    this._cityService.getGovernorates().subscribe((res) => {
      if (res.isSuccess) {
        this.governorates = res.data; // Set governorates data
      }
    });
  }

  loadCities(governorateId?: string) {
    this.cities = [];
    this._pageService.getCities(governorateId).subscribe(res => {
      if (res.isSuccess) {
        this.cities = res.data; // Populate cities array with the response data
      } else {
        this.cities = []; // Reset cities if there's an error
      }
    });
  }


  remove() {
    this._pageService.remove(this.selectedItem).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.isSuccess) {
        let index = this.items.findIndex(x => x.id == this.selectedItem.id);
        this.items.splice(index, 1);
        this.initializePage();
      }
    })
  }


  editCompany(id: string) {
    // Navigate to the create page with the governorate ID
    this._router.navigate(['/sites/company/edit', id]);
  }




}
