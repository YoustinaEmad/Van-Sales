import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';

import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RejectReasonViewModel, signUpRequestViewModel } from '../interfaces/sign-up-request';

@Injectable({
  providedIn: 'root'
})
export class SignUpRequestService {

 constructor(private _apiService: ApiService) { }
  get(searchViewModel: signUpRequestViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    
    return this._apiService.get(`/GetAllVerifiedStatusEndPoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getApprovedAndReject(searchViewModel: signUpRequestViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    
    return this._apiService.get(`/GetAllApproveOrRejectUserEndpoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  Approved(iD:string) {
    console.log(iD)
    return this._apiService.update(`/ApproveUserEndpoint/Put`, {iD});
  }
  Rejected(body:RejectReasonViewModel) {
    return this._apiService.update(`/RejectUserEndPoint/Put`, body);
  }
  getDetailsById(ID: string) {
    console.log(ID)
    return this._apiService.get(`/GetUserDetailsEndPoint/GetClientDetails?ID=${ID}`,);
  }
  
  
}
