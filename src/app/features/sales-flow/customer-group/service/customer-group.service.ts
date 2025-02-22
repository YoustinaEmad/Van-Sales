import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { customerGroupSearchViewModel,  customerGroupTaxesViewModel, customerGroupViewModel } from '../interfaces/customer-group-view-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService {

  constructor(private _apiService: ApiService) { }


  get(searchViewModel: customerGroupSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
  
    return this._apiService.get(`/ClientGroupFilterByNameEndPoint/Get?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetClientGroupByIDEndPoint/Get?ID=${ID}`,);
  }
  remove(body:customerGroupViewModel) {
    return this._apiService.remove(`/DeleteClientGroupEndPoint/Delete`,body);
  }

  postOrUpdate(body:customerGroupViewModel ) {
    if (body.id) return this._apiService.update(`/EditClientGroupEndPoint/Put`, body)
    else return this._apiService.post(`/CreateClientGroupEndPoint/Post`, body)
  }
  
  updateTaxExemptStatus(body:customerGroupTaxesViewModel) {
       return this._apiService.update(`/EditClientGroupTaxExemptedEndpoint/Put`,body);
  }
  
  
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteClientGroupsEndpoint/BulkDeleteClientGroups`, { ids });
  }
  
}
