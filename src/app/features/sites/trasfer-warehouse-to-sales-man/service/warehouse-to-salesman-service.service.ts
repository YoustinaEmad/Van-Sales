import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { createWarehouseToSalesmanViewModel, RejectReasonViewModel, WarehouseToSalesmanSearchViewModel } from '../interface/warehouse-to-salesman-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseToSalesmanServiceService {
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  constructor(private _apiService: ApiService) { }
  get(searchViewModel: WarehouseToSalesmanSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.SearchText) {
      params = params.set("SearchText", searchViewModel.SearchText);
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
    return this._apiService.get(`/GetAllWarehouseToSalesmanTransactionsEndpoint/GetAllWarehouseToSalesmanTransactions?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  getSalesManList() {
    return this._apiService.get(`/SalesmanSelectListEndpoint/SelectSalesmanList`);
  }
  getWarehouses() {
    return this._apiService.get('/WarehouseSelectListEndpoint/SelectWarehouseList');
  }
  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }
  getProducts(WarehouseId: string) {
    console.log(WarehouseId);
    return this._apiService.get(`/ProductSelectListByWarehouseIdEndPoint/ProductSelectListByWarehouseId?WarehouseId=${WarehouseId}`);
  }

  postOrUpdate(body: createWarehouseToSalesmanViewModel) {
    if (body.id) return this._apiService.update(`/EditWarehouseToSalesmanTransactionEndPoint/EditWarehouseToSalesmanTransaction`, body)
    else return this._apiService.post(`/StartWarehouseToSalesmanTransactionEndPoint/StartWarehouseToSalesmanTransaction`, body)
  }

  Approved(ID:string) {
    return this._apiService.update(`/ApproveWarehouseToSalesmanTransactionEndPoint/ApproveWarehouseToSalesmanTransaction`, {ID});
  }
  Rejected(body:RejectReasonViewModel) {
    return this._apiService.update(`/RejectWarehouseToSalesmanTransactionEndPoint/RejectWarehouseToSalesmanTransaction`, body);
  }

  getById(ID: string) {
    return this._apiService.get(`/GetByIDWarehouseToSalesmanTransactionsEndPoint/GetWarehouseToSalesmanTransactionById?ID=${ID}`,);
  }
}
