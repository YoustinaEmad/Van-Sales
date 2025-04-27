import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { environment } from 'src/environments/environment';
import { requestCreateViewNodel, requestSearchViewModel, requestViewModel } from '../interface/request';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private _apiService: ApiService) { }
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  get(searchViewModel: requestSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.RequestNumber) {
      params = params.set("RequestNumber", searchViewModel.RequestNumber);
    }
    if (searchViewModel.RequestStatus) {
      params = params.set("RequestStatus", searchViewModel.RequestStatus);
    }
    if (searchViewModel.SalesManName) {
      params = params.set("SalesManName", searchViewModel.SalesManName);
    }
    if (searchViewModel.SalesManPhone) {
      params = params.set("SalesManPhone", searchViewModel.SalesManPhone);
    }
    if (searchViewModel.WarehouseId) {
      params = params.set("WarehouseId", searchViewModel.WarehouseId);
    }
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    
    console.log(params);
    return this._apiService.get(`/GetAllSalesManRequestsEndPoint/GetAllSalesManRequests?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getById(ID: string) {

    return this._apiService.get(`/GetSupplierByIdEndPoint/GetSupplierbyID?ID=${ID}`);
  }
  remove(body: requestViewModel) {
    return this._apiService.remove(`/DeleteSupplierEndPoint/Delete`, body);
  }

  postOrUpdate(body: requestCreateViewNodel) {
    console.log(body)
    if (body.id) return this._apiService.update(`/EditSupplierEndPoint/EditSupplier`, body)
    else return this._apiService.post(`/AddSalesmanRequestEndpoint/AddSalesmanRequest
`, body)
  }
  getWarehouses() {
    return this._apiService.get('/WarehouseSelectListEndpoint/SelectWarehouseList');
  }
  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }
  getProducts() {
    return this._apiService.get('/ProductSelectListEndpoint/SelectProductList');
  }
}
