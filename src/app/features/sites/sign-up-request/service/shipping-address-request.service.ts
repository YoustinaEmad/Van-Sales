import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { ShippingAddressRequestViewModel } from '../../shipping-address-request/interfaces/shipping-address-request';
import { RejectReasonViewModel } from '../interfaces/sign-up-request';

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressRequestService {

  constructor(private _apiService: ApiService) { }
  get(searchViewModel: ShippingAddressRequestViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    
    return this._apiService.get(`/GetAllPendingTempShippingAddressesEndPoint/GetAllPendingShippingAddress?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getApprovedAndReject( searchViewModel: ShippingAddressRequestViewModel,orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    
    return this._apiService.get(`/GetAllNotPendingTempShippingAddressesEndPoint/GetAllNotPendingShippingAddress?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  Approved(iD:string) {
    return this._apiService.update(`/ApproveTempShippingAddressesEndPoint/ApproveTempShippingAddresses`, {iD});
  }
  Rejected(body:RejectReasonViewModel) {
    return this._apiService.update(`/RejectTempShippingAddressesEndPoint/RejectTempShippingAddress`, body);
  }
  getDetailsById(ID: string) {
    return this._apiService.get(`/GetTempShippingAddressByIDEndPoint/GetTempShippingAddressByID?ID=${ID}`,);
  }
  
}
