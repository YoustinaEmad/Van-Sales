import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { assginFeaturesViewModel, BulkAssginFeaturesViewModel, featureSearchViewModel } from '../interfaces/role';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _apiService: ApiService) { }

  getRoleById(searchViewModel:featureSearchViewModel ,ID: string) {
    let params = new HttpParams();

    const featureName = searchViewModel.FeatureName || '';

    if (searchViewModel.FeatureName) {
      params = params.set("FeatureName", searchViewModel.FeatureName);
    }
    return this._apiService.get(`/GetAllFeaturesListedEndPoint/GetFeatueresListed?RoleID=${ID}&FeatureName=${featureName}`,);
  }

  
  
  assginFeatures(body: assginFeaturesViewModel) {
    console.log(body)
    return this._apiService.post(`/AssignFeaturesEndPoint/AssignFeaturesToRole`, body);
  }
  unAssginFeatures(body: assginFeaturesViewModel) {
    return this._apiService.remove(`/UnassignFeaturesToRoleEndPoint/UnassignFeaturesToRole`, body);
  }
  BulkAssginFeatuers(body: BulkAssginFeaturesViewModel) {
    return this._apiService.post(`/AssignBulkFeatuersToRoleEndPoint/AssignBulkFeaturesToRole`, body);
  }
  BulkunAssginFeatuers(body: BulkAssginFeaturesViewModel) {
    return this._apiService.update(`/UnassignBulkFeatuersToRoleEndpoint/UnassignBulkFeaturesToRole`, body);
  }
  
  
  
 
}
