import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { supplierActivateViewModel, supplierSearchViewModel, supplierViewModel } from '../interfaces/supplier';
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

      return this._apiService.get(`/V4/FailedDeliveryReason/getall?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
        }
        getById(ID: string) {
          return this._apiService.get(`/V4/FailedDeliveryReason/GetByID?ID=${ID}`,);
        }
        remove(ID: string) {
          return this._apiService.remove(`/V4/FailedDeliveryReason/Delete?ID=${ID}`);
        }
        
        
        postOrUpdate(body: supplierViewModel) {
          if (body.id) return this._apiService.update(`/V4/FailedDeliveryReason/edit`, body)
          else return this._apiService.post(`/V4/FailedDeliveryReason/Create`, body)
        }
      
      
      
        updateActivated(body:supplierActivateViewModel ) {
         
          return this._apiService.update(`/ActiveGovernorateEndpoint/Active`,body);
        }
        updateDeactivated(body:supplierActivateViewModel) {
          return this._apiService.update(`/DeactiveGovernorateEndpoint/Deactive`,body);
        }
      
}
