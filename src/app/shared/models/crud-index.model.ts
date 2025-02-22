import { ColumnViewModel } from './column-view-model';
import { UntypedFormGroup } from '@angular/forms';
import { ResponseViewModel } from './response.model';
import { environment } from 'src/environments/environment';
import { ControlType } from './enum/control-type.enum';
import { FeatureEnum } from './enum/feature.enum';

export class CRUDIndexPage {
  searchForm: UntypedFormGroup;
  isSearching: boolean = true;
  isSearchClicked: boolean = false;
  isLoading: boolean = false;
  isUploading: boolean = false;
  isSaving: boolean = false;
  resultViewModel: ResponseViewModel;
  isPageLoaded: boolean = false;
  orderBy: string = 'ID';
  isAscending: boolean = false;
  isAllSelected: boolean = false;
  selectedAll: boolean = false;
  columns: ColumnViewModel[];
  featureEnum = FeatureEnum
  ControlType = ControlType;
  options = {
    itemsPerPage: environment.pageSize,
    currentPage: 1,
    id: 'Pagination',
    totalItems: 0,
    totalPages: 0,
  };
}
