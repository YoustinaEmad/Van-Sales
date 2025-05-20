import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { createDispatchPlannedViewModel, DispatchActualViewModel, DispatchPlannedViewModel } from '../interface/dispatch-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {

  constructor(private _apiService: ApiService) { }
  getActual(searchViewModel: DispatchActualViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();

    return this._apiService.get(`/GetAllVerifiedStatusEndPoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getPlanned(searchViewModel: DispatchPlannedViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();

    return this._apiService.get(`/GetAllApproveOrRejectUserEndpoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  postOrUpdate(body: createDispatchPlannedViewModel) {
    // if (body.id) return this._apiService.update(`/EditWarehouseToSalesmanTransactionEndPoint/EditWarehouseToSalesmanTransaction`, body) else
    return this._apiService.post(`/CreatePlannedDispatchEndPoint/CreatePlannedDispatch`, body)
  }

  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }

  getClients(){
     return this._apiService.get('/ClientSelectListEndPoint/SelectClientList');
  }

}
