import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { supplierActivateViewModel, supplierCreateViewModel, supplierSearchViewModel, supplierViewModel } from '../interfaces/supplier';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private _apiService: ApiService) { }
  get(searchViewModel: supplierSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Code) {
      params = params.set("Code", searchViewModel.Code);
    }

    return this._apiService.get(`/FilterSupplierEndPoint/GetAllSuppliers?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetGovernorateByIDEndPoint/GetGovernorateByID?ID=${ID}`);
  }
  remove(body: supplierViewModel) {
    return this._apiService.remove(`/DeleteSupplierEndPoint/Delete`, body);
  }

  postOrUpdate(body: supplierCreateViewModel) {
    if (body.id) return this._apiService.update(`/UpdateGovernorateEndPoint/UpdateGovernorate`, body)
    else return this._apiService.post(`/CreateSupplierEndPoint/Post`, body)
  }

  updateActivated(body: supplierActivateViewModel) {

    return this._apiService.update(`/ActivateSupplierEndPoint/ActivateSupplier`, body);
  }
  updateDeactivated(body: supplierActivateViewModel) {
    return this._apiService.update(`/DeactivateSupplierEndPoint/DeactivateSupplier`, body);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteGovernorateEndPoint/BulkDeleteGovernorate`, { ids });
  }
  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActivateGovernorateEndPoint/BulkActivateGovernorate`, { ids });
  }

  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactivateGovernorateEndPoint/BulkDeactivateGovernorate`, { ids });
  }
  getGovernorates() {
    return this._apiService.get('/GetDropdownListGovernorateEndPoint/GetDropdownList');
  }
  getCities(governorateId?: string) {
    let url: string;
  
    if (governorateId) {

      url = `/SelectCityListEndPoint/SelectCityList?governorateId=${governorateId}`;
    } else {
     
      url = `/SelectCityListEndPoint/SelectCityList`;
    }
  
    return this._apiService.get(url); 
  }
  getClassifications() {
    return this._apiService.get('/SelectListClassificationEndpoint/SelectListClassification');
  }
  uploadImage(formData: FormData) {
    return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  }
}
