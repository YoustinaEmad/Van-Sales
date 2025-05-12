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
    if (searchViewModel.Code) {
      params = params.set("Code", searchViewModel.Code);
    }
    if (searchViewModel.GovernorateId) {
      params = params.set("GovernorateId", searchViewModel.GovernorateId);
    }
    if (searchViewModel.CityId) {
      params = params.set("CityId", searchViewModel.CityId);
    }
  
    return this._apiService.get(`/FilterWarehousesEndpoint/GetAllWarehouses?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetWarehouseByIDEndpoint/GetWarehouseByID?ID=${ID}`);
  }
getWarehouseDetails(ID: string) {
    return this._apiService.get(`/GetWarehouseByIDEndpoint/GetWarehouseByID?ID=${ID}`);
}
  getCities(governorateId?: string) {
    let url: string;
  
    if (governorateId) {
      // If governorateId is provided, fetch cities for that governorate
      url = `/SelectCityListEndPoint/SelectCityList?governorateId=${governorateId}`;
    } else {
     
      // If governorateId is not provided, fetch all cities
      url = `/SelectCityListEndPoint/SelectCityList`;
    }
  
    return this._apiService.get(url); // Make the API call with the determined URL
  }
  remove(body:WarehouseViewModel ) {
    return this._apiService.remove(`/DeleteWarehouseEndpoint/Delete`,body);
  }

  postOrUpdate(body:warehouseCreateViewModel ) {
    if (body.id) return this._apiService.update(`/EditWarehouseEndpoint/EditWarehouse`, body)
    else return this._apiService.post(`/CreateWarehouseEndPoint/Post`, body)
  }

  updateActivated(body:warehouseActivateViewModel ) {
   
    return this._apiService.update(`/ActivateWarehouseEndpoint/ActivateWarehouse`,body);
  }
  updateDeactivated(body:warehouseActivateViewModel) {
    return this._apiService.update(`/DeactiveGovernorateEndpoint/Deactive`,body);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteWarehouseEndpoint/BulkDeleteWarehouse`, { ids });
  }
  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActivateWarehouseEndpoint/BulkActivateWarehouses`, { ids });
  }
  getGovernorates() {
    return this._apiService.get('/GetDropdownListGovernorateEndPoint/GetDropdownList');
  }
  // Bulk deactivate governorates
  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactivateWarehouseEndpoint/BulkDectivatedWarehouses`, { ids });
  }
}
