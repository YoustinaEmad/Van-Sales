import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { orderSearchViewModel } from 'src/app/features/sales-flow/order/interface/order';
import { ApiService } from 'src/app/shared/service/api.service';
import { environment } from 'src/environments/environment';
import { searchViewModel, SiteStatisticsViewModel } from '../interface/dashboard';
import { customerSearchViewModel } from 'src/app/features/sales-flow/customers/interfaces/customers';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _apiService: ApiService) { }
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  get(searchViewModel: orderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {


    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }


    return this._apiService.get(`/GetAllOrdersEndpoint/GetAllOrders?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=10`, params);
  }

  getSiteStatistics(searchViewModel: searchViewModel) {

    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }

    return this._apiService.get(`/SiteStatisticsEndpoint/Get`, params);
  }
  getOrderStatusAndPercentage(searchViewModel: searchViewModel) {


    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }

    return this._apiService.get(`/GetOrdersStatusPercentageEndPoint/GetOrdersStatusPercentage`, params);
  }

  getCustomers(searchViewModel: searchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    let params = new HttpParams();
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }

    return this._apiService.get(`/SearchClientEndPoint/SearchClient?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=10`, params);
  }




}
