import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { editOrderViewModel, EditShippingAddressViewModel, orderCreateViewModel, orderSearchViewModel, orderStatusViewModel, orderViewModel, SearchCustomerViewModel, shippingAddressStatusViewModel } from '../interface/order';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _apiService: ApiService) { }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  get(searchViewModel: orderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.CustomerName) {
      params = params.set("CustomerName", searchViewModel.CustomerName);
    }
    if (searchViewModel.CustomerNumber) {
      params = params.set("CustomerNumber", searchViewModel.CustomerNumber);
    }
    if (searchViewModel.OrderNumber) {
      params = params.set("OrderNumber", searchViewModel.OrderNumber);
    }
    if (searchViewModel.OrderStatus) {
      params = params.set("OrderStatus", searchViewModel.OrderStatus);
    }
    if (searchViewModel.TotalPrice) {
      params = params.set("TotalPrice", searchViewModel.TotalPrice);
    }
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }


    return this._apiService.get(`/GetAllOrdersEndpoint/GetAllOrders?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getTodownloadPDF(searchViewModel: orderSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number ) {
    

    let params = new HttpParams();
    if (searchViewModel.CustomerName) {
      params = params.set("CustomerName", searchViewModel.CustomerName);
    }
    if (searchViewModel.CustomerNumber) {
      params = params.set("CustomerNumber", searchViewModel.CustomerNumber);
    }
    if (searchViewModel.OrderNumber) {
      params = params.set("OrderNumber", searchViewModel.OrderNumber);
    }
    if (searchViewModel.OrderStatus) {
      params = params.set("OrderStatus", searchViewModel.OrderStatus);
    }
    if (searchViewModel.TotalPrice) {
      params = params.set("TotalPrice", searchViewModel.TotalPrice);
    }
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }


    return this._apiService.get(`/GetAllOrdersEndpoint/GetAllOrders?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  getByOrderNumber(OrderNumber: string) {
    return this._apiService.get(`/GetOrderByNumberEndPoint/GetOrderByNumber?OrderNumber=${OrderNumber}`,);
  }

  remove(body: orderViewModel) {
    return this._apiService.remove(`/DeleteCategoryEndPoint/DeleteCategory`, body);
  }

  postOrUpdate(body: orderCreateViewModel) {

    return this._apiService.post(`/PlaceOrderByAdminEndPoint/PlacedAnOrderByAdmin`, body)
  }
  Update(body: editOrderViewModel) {
    console.log(body);
    return this._apiService.update(`/EditOrderEndPoint/EditOrder`, body)
  }
  getOrderById(ID: string) {
    return this._apiService.get(`/GetOrderByIDEndPoint/GetOrderByID?ID=${ID}`,);
  }


  ConfirmedOrder(body: orderStatusViewModel) {

    return this._apiService.update(`/ApproveOrderEndPoint/ApproveOrder`, body);
  }
  EditShippingAddress(body: EditShippingAddressViewModel) {
    return this._apiService.update(`/EditShippingAddressEndPoint/Put`, body)
  }
  CancelledOrder(body: orderStatusViewModel) {
    return this._apiService.update(`/CancelOrderEndPoint/CancelOrder`, body);
  }
  CompletedOrder(body: orderStatusViewModel) {
    return this._apiService.update(`/CompletedOrderEndpoint/CompletedOrder`, body);
  }
  InProcessOrder(body: orderStatusViewModel) {
    return this._apiService.update(`/InProcessOrderEndpoint/InProcessOrder`, body);
  }

  getAllShippingAdresses(ID: string) {
    return this._apiService.get(`/GetShippingAddressesForClientEndPoint/GetShippingAddressesForClient?ClientId=${ID}`);
  }

  getCustomerDetails(mobile: string) {

    let params = new HttpParams();
    if (mobile) {
      params = params.set("mobile", mobile);
    }
    return this._apiService.get(`/GetClientByMobileEndPoint/GetClientByMobile`, params);
  }
  getProducts() {
    return this._apiService.get('/SelectProductListEndPoint/SelectProductList');
  }
  getProductPrice(id: string) {
    return this._apiService.get(`/GetProductNameAndPriceEndPoint/GetProductNameAndPrice?ID=${id}`);
  }

  getOrdersExcel(searchViewModel: orderSearchViewModel) {
    
    let params = new HttpParams();
    if (searchViewModel.CustomerName) {
      params = params.set("CustomerName", searchViewModel.CustomerName);
    }
    if (searchViewModel.CustomerNumber) {
      params = params.set("CustomerNumber", searchViewModel.CustomerNumber);
    }
    if (searchViewModel.OrderNumber) {
      params = params.set("OrderNumber", searchViewModel.OrderNumber);
    }
    if (searchViewModel.OrderStatus) {
      params = params.set("OrderStatus", searchViewModel.OrderStatus);
    }
    if (searchViewModel.TotalPrice) {
      params = params.set("TotalPrice", searchViewModel.TotalPrice);
    }
    if (searchViewModel.From) {
      params = params.set("From", this.formatDate(searchViewModel.From));
    }
    if (searchViewModel.To) {
      params = params.set("To", this.formatDate(searchViewModel.To));
    }
    return this._apiService.getExcel(`/ExportOrdersToExcelEndpoint/AllOrders`, params);
  }

  ApprovedShippingAddress(body: shippingAddressStatusViewModel) {
    
    return this._apiService.update(`/ApproveShippingAddressEndpoint/ApproveShippingAddress`, body);
  }
  RejectedShippingAddress(body: shippingAddressStatusViewModel) {
    return this._apiService.update(`/RejectShippingAddressEndpoint/RejectShippingAddress`, body);
  }
  uploadImage(formData: FormData) {
		return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
	}

}
