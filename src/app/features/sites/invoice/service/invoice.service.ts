import { Injectable } from '@angular/core';
import { IvoiceSearchViewModel, InvoiceViewModel, InvoiceCreateViewModel } from '../interface/invoice-view-model';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private _apiService: ApiService) { }
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  get(searchViewModel: IvoiceSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number = 1, pageSize: number = 100) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.SalesManID) {
      params = params.set("SalesManID", searchViewModel.SalesManID);
    }
    if (searchViewModel.ClientID) {
      params = params.set("ClientID", searchViewModel.ClientID);
    }

    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    return this._apiService.get(`/GetAllSellingInvoicesEndpoint/GetAllSellingInvoices?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  postOrUpdate(body: InvoiceCreateViewModel) {
    return this._apiService.post(`/AddSellingInvoicesEndPoint/AddSellingInvoices`, body)
  }
  getSalesMen() {
    return this._apiService.get('/SalesmanSelectListEndpoint/SelectSalesmanList');
  }

  getClients() {
    return this._apiService.get('/ClientSelectListBySalesManEndpoint/ClientSelectListBySalesMan');
  }
  getById(ID: string) {
    return this._apiService.get(`/GetSellingInvoiceByIdEndPoint/GetSellingInvoiceById?ID=${ID}`);
  }

  getbrands(){
    return this._apiService.get('/SelectBrandListEndpoint/SelectBrandList');
  }

  getProducts(payload: {
    SalesManID: string;
    ClientID: string;
    StorageType: number;
    BrandID?: string; // ✅ براند ID اختياري
  }) {
    let params = new HttpParams()
      .set("SalesManID", payload.SalesManID)
      .set("ClientID", payload.ClientID)
      .set("StorageType", payload.StorageType.toString());
  
    if (payload.BrandID) {
      params = params.set("BrandID", payload.BrandID);
    }
  
    return this._apiService.get(
      '/ProductSelectListBySalesmanIDAndClientIDEndpoint/ProductSelectListBySalesmanIDAndClientID',
      params
    );
  }
  


}
