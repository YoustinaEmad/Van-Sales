import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { salesManActivateViewModel, salesManCreateViewModel, salesManSearchViewModel, salesManViewModel } from '../interfaces/salesMan';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class salesMan {

  constructor(private _apiService: ApiService) { }

  get(searchViewModel: salesManSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number =1, pageSize: number = 100) {
      if (pageSize == 0)
        pageSize = environment.pageSize;
  
      let params = new HttpParams();
      if (searchViewModel.Name) {
        params = params.set("Name", searchViewModel.Name);
      }
      if (searchViewModel.NationalNumber) {
        params = params.set("NationalNumber", searchViewModel.NationalNumber);
      }
      if (searchViewModel.Mobile) {
        params = params.set("Mobile", searchViewModel.Mobile);
      }
      if (searchViewModel.Classification) {
        params = params.set("Classification", searchViewModel.Classification);
      }
      if (searchViewModel.WareHouseId) {
        params = params.set("WareHouseId", searchViewModel.WareHouseId);
      }
    
      return this._apiService.get(`/GetAllSalesmenEndPoint/GetAllSalesmen?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
    }
    getById(ID: string) {
      return this._apiService.get(`/GetSalesManByIDEndPoint/GetSalesManByID?ID=${ID}`);
    }
    remove(body:salesManViewModel ) {
      return this._apiService.remove(`/DeleteGovernorateEndPoint/DeleteGovernorate`,body);
    }
  
    postOrUpdate(body:salesManCreateViewModel ) {
      if (body.id) return this._apiService.update(`/UpdateSalesManEndPoint/UpdateSalesMan`, body)
      else return this._apiService.post(`/CreateSalesManEndPoint/CreateSalesMan`, body)
    }
  
    updateActivated(body:salesManActivateViewModel ) {
     
      return this._apiService.update(`/ActivateUserEndPoint/ActivateUser`,body);
    }
    updateDeactivated(body:salesManActivateViewModel) {
      return this._apiService.update(`/DeactivateUserEndPoint/DeactivateUser`,body);
    }
    bulkDelete(ids: string[]) {
      return this._apiService.remove(`/BulkDeleteSalesManEndPoint/BulkDeleteSalesMen`, { ids });
    }
    bulkActivate(ids: string[]) {
      return this._apiService.update(`/BulkActivateUserEndPoint/BulkActivateUser`, { ids });
    }
  
    bulkDeactivate(ids: string[]) {
      return this._apiService.update(`/BulkDeActivateUserEndPoint/BulkDeActivateUser`, { ids });
    }
    uploadImage(formData: FormData) {
      return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
    }
    getWarehouses() {
      return this._apiService.get(`/WarehouseSelectListEndpoint/SelectWarehouseList`);
    }
}
