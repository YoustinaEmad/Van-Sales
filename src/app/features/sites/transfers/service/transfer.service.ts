import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { transferCreateViewModel, transferSearchViewModel } from '../interface/transfer';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor(private _apiService: ApiService) { }
 
  
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  
  get(searchViewModel: transferSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.Data) {
      params = params.set("Data", searchViewModel.Data);
    }
    if (searchViewModel.FromWarehouseId) {
      params = params.set("FromWarehouseId", searchViewModel.FromWarehouseId);
    }
    if (searchViewModel.ToWarehouseId) {
      params = params.set("ToWarehouseId", searchViewModel.ToWarehouseId);
    }
    if (searchViewModel.WarehouseToWarehouseStatus) {
      params = params.set("WarehouseToWarehouseStatus", searchViewModel.WarehouseToWarehouseStatus);
    }
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    
    return this._apiService.get(`/GetAllWarehouseToWarehouseTransactionsEndpoint/GetWarehouseToWarehouseTransactions
?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getWarehouses() {
    return this._apiService.get('/WarehouseSelectListEndpoint/SelectWarehouseList');
  }

  postOrUpdate(body: transferCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditWarehouseToWarehouseTransactionEndpoint/EditWarehouseToWarehouseTransaction`, body)
    else return this._apiService.post(`/StartWarehouseToWarehouseTransactionEndpoint/StartWarehouseToWarehouseTransaction`, body)
  }

  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }

    getProducts(WarehouseId: string) {
    return this._apiService.get(`/ProductSelectListByWarehouseIdEndPoint/ProductSelectListByWarehouseId?WarehouseId=${WarehouseId}`);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetWarehouseToWarehouseTransactionByIdEndPoint/GetWarehouseToWarehouseTransactionById?ID=${ID}`,);
  }
}
