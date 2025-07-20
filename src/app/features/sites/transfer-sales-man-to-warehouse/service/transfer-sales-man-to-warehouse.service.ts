import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { RejectReasonViewModel, transferCreateViewModel, transferSalesManToWarehouseSearchViewModel } from '../interface/transfer-sales-man-to-warehouse';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransferSalesManToWarehouseService {

  constructor(private _apiService: ApiService) { }
  get(searchViewModel: transferSalesManToWarehouseSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.SalesManID) {
      params = params.set("SalesManID", searchViewModel.SalesManID);
    }
    if (searchViewModel.WarehouseId) {
      params = params.set("WarehouseId", searchViewModel.WarehouseId);
    }
    if (searchViewModel.transactionStatus) {
      params = params.set("transactionStatus", searchViewModel.transactionStatus);
    }

    return this._apiService.get(`/GetAllSalesmanToWarehouseTransactionsEndPoint/GetAllSalesmanToWarehouseTransactions?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getWarehouses() {
    return this._apiService.get('/WarehouseSelectListEndpoint/SelectWarehouseList');
  }

  postOrUpdate(body: transferCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditWarehouseToWarehouseTransactionEndpoint/EditWarehouseToWarehouseTransaction`, body)
    else return this._apiService.post(`/StartSalesmanToWarehouseTransactionEndPoint/StartSalesmanToWarehouseTransaction`, body)
  }
  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }
  getProducts(salesmanID: string, BrandId?: string) {
    let params = new HttpParams()
      .set('salesmanID', salesmanID)
      .set('StorageType', '1');

    if (BrandId) {
      params = params.set('BrandId', BrandId);
    }

    return this._apiService.get(
      `/ProductSelectListBySalesmanIDEndpoint/SelectProductsListBySalesman`,
      params
    );
  }
  getById(ID: string) {
    return this._apiService.get(`/GetSalesmanToWarehouseTransactionByIdEndPoint/GetSalesmanToWarehouseTransactionById?ID=${ID}`,);
  }

  Approved(ID: string) {
    return this._apiService.update(`/ApproveSalesmanToWarehouseTransactionEndPoint/ApproveSalesmanToWarehouseTransaction`, { ID });
  }
  Rejected(body: RejectReasonViewModel) {
    return this._apiService.update(`/RejectSalesmanToWarehouseTransactionEndPoint/RejectSalesmanToWarehouseTransaction`, body);
  }
   getbrands(){
    return this._apiService.get('/SelectBrandListEndpoint/SelectBrandList');
  }
}
