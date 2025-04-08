import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { productGroupCreateViewModel, productGroupViewModel } from '../interfaces/product-group';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { productActivateViewModel } from '../../Product/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  constructor(private _apiService: ApiService) { }

  get(searchViewModel: productGroupViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.name) {
      params = params.set("Name", searchViewModel.name);
    }

    return this._apiService.get(`/GetAllProductGroupsEndPoint/Get?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetProductGroupByIdEndPoint/GetProductGroupById?ID=${ID}`);
  }
  remove(body: productGroupViewModel) {
    return this._apiService.remove(`/DeleteProductGroupEndPoint/Delete`, body);
  }

  postOrUpdate(body: productGroupCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditProductGroupEndPoint/EditProductGroup`, body)
    else return this._apiService.post(`/AddProductGroupEndpoint/Post`, body)
  }

  updateActivated(body: productActivateViewModel) {

    return this._apiService.update(`/ActiveProductGroupEndPoint/Active
`, body);
  }
  updateDeactivated(body: productActivateViewModel) {
    return this._apiService.update(`/DeactiveProductGroupEndPoint/Deactive`, body);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteProductGroupEndPoint/BulkDeleteProductGroup`, { ids });
  }
  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActiveProductGroupEndPoint/BulkActivateProductGroup`, { ids });
  }

  // Bulk deactivate governorates
  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactiveProductGroupEndPoint/BulkDeactivateProductGroup`, { ids });
  }
}
