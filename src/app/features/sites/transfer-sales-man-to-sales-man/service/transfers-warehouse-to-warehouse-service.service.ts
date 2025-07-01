import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { RejectReasonViewModel, salesManToSalesManCreateViewNodel, transferSalesManToSalesManSearchViewModel } from '../interface/transfer-sales-man-to-sales-man';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransfersWarehouseToWarehouseServiceService {

  constructor(private _apiService: ApiService) { }
  get(searchViewModel: transferSalesManToSalesManSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    let params = new HttpParams();
    if (searchViewModel.FromSalesManID) {
      params = params.set("FromSalesManID", searchViewModel.FromSalesManID);
    }
    if (searchViewModel.ToSalesManID) {
      params = params.set("ToSalesManID", searchViewModel.ToSalesManID);
    }
    if (searchViewModel.transactionStatus) {
      params = params.set("transactionStatus", searchViewModel.transactionStatus);
    }
    return this._apiService.get(`/GetAllSalesmanToSalesmanTransactionsEndPoint/GetAllSalesmanToSalesmanTransactions?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  Approved(ID: string) {
    return this._apiService.update(`/ApproveSalesmanToSalesmanTransactionEndPoint/ApproveSalesmanToSalesmanTransaction`, { ID });
  }
  Rejected(body: RejectReasonViewModel) {
    return this._apiService.update(`/RejectSalesmanToSalesmanTransactionEndPoint/RejectSalesmanToSalesmanTransaction`, body);
  }


  getSalesManList() {
    return this._apiService.get(`/SalesmanSelectListEndpoint/SelectSalesmanList`);
  }

  postOrUpdate(body: salesManToSalesManCreateViewNodel) {
    console.log(body)
    if (body.id) return this._apiService.update(`/EditSalesmanToSalesmanTransactionEndpoint/EditSalesmanToSalesmanTransaction`, body)
    else return this._apiService.post(`/StartSalesmanToSalesmanTransactionEndPoint/StartSalesmanToSalesmanTransaction`, body)
  }

  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }
  // getProducts(ID: string) {
  //   return this._apiService.get(`/ProductSelectListBySalesmanIDEndpoint/SelectProductsListBySalesman?ID=${ID}`);
  // }

  getProducts(salesmanID: string) {
    const params = new HttpParams()
      .set('SalesManID', salesmanID)
      .set('StorageType', '1');
  
    return this._apiService.get('/ProductSelectListBySalesmanIDEndpoint/SelectProductsListBySalesman', params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetSalesmanToSalesmanTransactionByIDEndpoint/GetSalesmanToSalesmanTransactionById?ID=${ID}`,);
  }

}
