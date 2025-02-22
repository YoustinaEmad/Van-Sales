import { Component } from '@angular/core';
import { assginFeaturesViewModel, BulkAssginFeaturesViewModel, featureSearchViewModel, RoleViewModel } from '../../interfaces/role';
import { RoleService } from '../../service/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';

@Component({
  selector: 'app-view-role-details',
  templateUrl: './view-role-details.component.html',
  styleUrls: ['./view-role-details.component.css']
})
export class ViewRoleDetailsComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/customers';
  override searchViewModel: featureSearchViewModel = new featureSearchViewModel();
  
  responseData: RoleViewModel[] = [];
  isActivated: boolean = false;
  sectionDropdownValues: string[] = [];
  body: assginFeaturesViewModel = new assginFeaturesViewModel();
  id: string;
  FeatureName:string ='';
  

  

  constructor(private roleService: RoleService,
    public override _sharedService: SharedService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

  ) {     super(_sharedService);
  }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
      }
    });
    this.createSearchForm();
    this._activatedRoute.queryParams.subscribe((params) => {
      this._sharedService.getFilterationFromURL(params, this.page.searchForm);
      this.search();
    });
  }


  toggleSectionFeatures(section: any): void {
    const changedFeatureIds: number[] = [];
    const shouldActivate = !this.isSectionActive(section);
  
    section.features.forEach((feature: any) => {
      const initialStatus = feature.isActiveToRole;
      feature.isActiveToRole = shouldActivate;
  
      // Track changed features only
      if (initialStatus !== feature.isActiveToRole) {
        changedFeatureIds.push(feature.featureId);
      }
    });
  
    if (changedFeatureIds.length > 0) {
      // Prepare the payload
      const bulkAssignPayload: BulkAssginFeaturesViewModel = {
        RoleId: parseInt(this.id), 
        Features: changedFeatureIds
      };
  
      // Decide which service to call based on the activation state
      const serviceCall = shouldActivate
        ? this.roleService.BulkAssginFeatuers(bulkAssignPayload)
        : this.roleService.BulkunAssginFeatuers(bulkAssignPayload);
  
      serviceCall.subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this._sharedService.showToastr(response);
          } 
        },
        error: (err) => {
          this._sharedService.showToastr(err);
        }
      });
    }
  }
  
  override search() {
    this.page.isSearching = true;
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this.roleService.getRoleById
      (
        this.searchViewModel,this.id
      )
      .subscribe((response) => {
        this.page.isSearching = false;

        if (response.isSuccess) {
          this.page.isAllSelected = false;
          this.confingPagination(response);
          this.items = response.data as RoleViewModel[];
          
        }
        this.fireEventToParent();
      });
  }

  updateSectionStatus(section: any, feature: any) {
    const payload: assginFeaturesViewModel = {
      roleId: parseInt(this.id), 
      feature: feature.featureId
    };
    const updateObservable = feature.isActiveToRole
      ? this.roleService.assginFeatures(payload)
      : this.roleService.unAssginFeatures(payload);

    updateObservable.subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this._sharedService.showToastr(response);
        }
      },
      error: (err) => {
        this._sharedService.showToastr(err);
      }
    });
  }


  isSectionActive(section: any): boolean {
    return section.features.every((feature: any) => feature.isActiveToRole);
  }

  onSectionDropdownChange(section: any, index: number): void {
    section.showFeatures = !section.showFeatures;

  }
  onCancel(): void {
    this._router.navigate(['/salesflow/roles']);
  }
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      FeatureName: [this.searchViewModel.FeatureName],

    });
    this.page.isPageLoaded = true;
  }
  onReset() {
    //this.loadRoleData(this.id);
  }

}
