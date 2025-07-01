import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { createDispatchActualViewModel, createDispatchPlannedViewModel, DispatchActualSearchViewModel, DispatchPlannedSearchViewModel } from '../interface/dispatch-view-model';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {

  constructor(private _apiService: ApiService) { }


  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  getActual(searchViewModel: DispatchActualSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    if (searchViewModel.DispatchStatus) {
      params = params.set("DispatchStatus", searchViewModel.DispatchStatus);
    }
    return this._apiService.get(`/GetAllActualDispatchsEndPoint/GetAllActualDispatchs?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getPlanned(searchViewModel: DispatchPlannedSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    return this._apiService.get(`/GetAllPlannedDispatchsEndpoint/GetAllPlanedDispatchs?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  postOrUpdate(body: createDispatchPlannedViewModel) {
    // if (body.id) return this._apiService.update(/EditWarehouseToSalesmanTransactionEndPoint/EditWarehouseToSalesmanTransaction, body) else
    return this._apiService.post(`/CreatePlannedDispatchEndPoint/CreatePlannedDispatch`, body)
  }

  postOrUpdateActual(body: createDispatchActualViewModel) {
    // if (body.id) return this._apiService.update(/EditWarehouseToSalesmanTransactionEndPoint/EditWarehouseToSalesmanTransaction, body) else
    return this._apiService.post(`/CreateActualDispatchEndPoint/CreateActualDispatch`, body)
  }

  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }

  getClients() {
    return this._apiService.get('/ClientSelectListEndPoint/SelectClientList');
  }

}