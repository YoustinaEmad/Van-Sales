import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { DicountViewModel, discountActivateViewModel, discountCreateViewModel } from 'src/app/features/sites/discount/interfaces/dicount-view-model'
@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private _apiService: ApiService) { }

  get(orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    /*if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }*/

    return this._apiService.get(`/GetAllDiscountsEndpoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetDiscountByIDEndPoint/GetDiscountByID?ID=${ID}`,);
  }
  remove(body: DicountViewModel) {
    return this._apiService.remove(`/DeleteDiscountEndPoint/deleteDiscount`, body);
  }

  postOrUpdate(body: discountCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditDiscountEndPoint/EditDiscount`, body)
    else return this._apiService.post(`/AddDiscountEndPoint/AddDiscount`, body)
  }
  updateActivated(body:discountActivateViewModel ) {
    return this._apiService.update(`/ActivatediscountEndPoint/ActiveDiscount`,body);
  }
  updateDeactivated(body:discountActivateViewModel) {
    return this._apiService.update(`/DeactivatediscountEndPoint/DeactiveDiscount`,body);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteDiscountEndpoint/BulkDeleteDiscounts`, { ids });
  }
  bulkActivate(ids :string[])
  {
    return this._apiService.update(`/BulkActivateDiscountEndpoint/ActiveDiscount`, { ids });
  }

  bulkDeactivate(ids :string[])
  {
    return this._apiService.update(`/BulkDeactivateDiscountEndpoint/DeactiveDiscount`, { ids });
  }
}
