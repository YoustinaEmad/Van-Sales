import * as moment from 'moment';
import { ApplicationRole } from '../models/enum/application-role';
import { ControlType } from '../models/enum/control-type.enum';
import { FeatureEnum } from '../models/enum/feature.enum';
import { PageEnum } from '../models/enum/page.enum';
import { ColumnViewModel } from '../models/column-view-model';
import { SharedService } from '../service/shared.service';
import { CRUDIndexPage } from '../models/crud-index.model';
export class CrudIndexBaseUtils {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute: string;
  orderBy: string = 'ID';
  featureEnum = FeatureEnum;
  pageEnum = PageEnum;
  canSendToParent: boolean = true;
  controlType = ControlType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions: any[] = [];
  searchViewModel;
  items = [];
  constructor(
    public _sharedService: SharedService
  ) {
  }

  unsubscribe(): void {
    this.subscriptions?.forEach(subscription => {
      subscription?.unsubscribe();
    });
  }
  //#region abstract method
  search() {
    console.error('Method search not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  getReport(_res?) {
    console.error('Method getReport not implemented.');
  }
  //#endregion method
  subscribeFilteration(params) {
    this._sharedService.getFilterationFromURL(params, this.page.searchForm);
    this.search();
  }
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value);
  }
  hasPage(value: PageEnum): boolean {
    return SharedService.pageList.some(i => i.ID == value);
  }
  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore();
  }
  isVendorManager() {
    return this._sharedService._storageService.getUserRole() == ApplicationRole.VENDOR_MANAGER;
  }


  fireEventToParent() {
    if (this.canSendToParent) this._sharedService.fireEvent(false, this.page.options.totalItems);
  }
  subscribeToParentEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (res.fromParent && this.canSendToParent) {
        this.getReport(res);
      }
    });
  }
  //#region search
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({});
  }

  onSearchClicked() {
    
    this.page.options.currentPage = 1;
    this.page.orderBy = this.orderBy;
    this.page.isAscending = false;
    this._sharedService.saveFilteration({ pageRoute: this.pageRoute, searchForm: this.page.searchForm, });
  }
  onSortClicked(column: ColumnViewModel) {
    if (column.Sortable) {
      if (column.Name === this.page.orderBy) this.page.isAscending = !this.page.isAscending;
      else this.page.isAscending = false;
      this.page.orderBy = column.Name;
      this.page.options.currentPage = 1;
      this._sharedService.saveFilteration({ pageRoute: this.pageRoute, searchForm: this.page.searchForm, });
    }
  }
  resetForm() {
    this.page.searchForm.reset();
    if (this.page.searchForm.controls['FromDate']) this.page.searchForm.controls['FromDate'].setValue(this._sharedService.dateService.getFirstDayCurrentMonth());
    if (this.page.searchForm.controls['ToDate']) this.page.searchForm.controls['ToDate'].setValue(new Date());
    this.onSearchClicked();
  }

  get selectedAreaID(): number {
    return this.page.searchForm.controls['AreaID']?.value;
  }



  //#endregion search
  //#region Table
  isColumnAscending(column: string): boolean {
    return (column != this.page.orderBy) ? null : (this.page.isAscending ? true : false);
  }
  onChangePageSize() {
    this.onSearchClicked();
  }
  getNextPrevData(pageIndex) {
    this.page.options.currentPage = pageIndex;
    this.search();
  }
  confingPagination(response) {
    this.page.options.totalItems = response.data.records;
    this.page.options.totalPages = response.data.pages;
    this.page.options.itemsPerPage = response.data.pageSize;
  }
  //#endregion table

  setDefaultDateValues() {
    this.searchViewModel.FromDate = this._sharedService.dateService.getFirstDayCurrentMonth();
    this.searchViewModel.ToDate = new Date();
  }


  formatDate(date: string) {
    return moment(date).format('YYYY-MM-DD');
  }


  clearItems() {
    this.items = [];
  }

  handleErrorResponse(error: any) {
    this.page.isSaving = false;
    const errorMessage = '%c An error occurred: ';
    const errorStyle = 'color: white; background-color: red; font-weight: bold; padding: 2px 4px; border-radius: 2px;';
    console.log(errorMessage, errorStyle, error);
  }

  subscribeToQueryParams() {
    this._sharedService.activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params);
    });
  }
}
