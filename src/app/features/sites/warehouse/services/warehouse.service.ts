import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { warehouseActivateViewModel, warehouseCreateViewModel, warehouseSearchViewModel, WarehouseViewModel } from '../interfaces/warehouse-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {


  constructor(private _apiService: ApiService) { }
  
  get(searchViewModel: warehouseSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
  
    return this._apiService.get(`/GetAllGovernorateWithAllCitiesEndPoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetGovernorateByIDEndPoint/GetGovernorateByID?ID=${ID}`);
  }
  remove(body:WarehouseViewModel ) {
    return this._apiService.remove(`/DeleteGovernorateEndPoint/DeleteGovernorate`,body);
  }

  postOrUpdate(body:warehouseCreateViewModel ) {
    if (body.id) return this._apiService.update(`/UpdateGovernorateEndPoint/UpdateGovernorate`, body)
    else return this._apiService.post(`/CreateGovernorateEndPoint/AddGovernorate`, body)
  }

  updateActivated(body:warehouseActivateViewModel ) {
   
    return this._apiService.update(`/ActiveGovernorateEndpoint/Active`,body);
  }
  updateDeactivated(body:warehouseActivateViewModel) {
    return this._apiService.update(`/DeactiveGovernorateEndpoint/Deactive`,body);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteGovernorateEndPoint/BulkDeleteGovernorate`, { ids });
  }
  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActivateGovernorateEndPoint/BulkActivateGovernorate`, { ids });
  }

  // Bulk deactivate governorates
  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactivateGovernorateEndPoint/BulkDeactivateGovernorate`, { ids });
  }
}
