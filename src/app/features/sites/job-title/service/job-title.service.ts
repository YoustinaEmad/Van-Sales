import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { changePasswordViewModel, employeeCreateViewModel, employeeSearchViewModel, employeeViewModel } from '../interfaces/job-title-view-model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private _apiService: ApiService) { }

  get(searchViewModel: employeeSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.UserName) {
      params = params.set("UserName", searchViewModel.UserName);
    }
    if (searchViewModel.Mobile) {
      params = params.set("Mobile", searchViewModel.Mobile);
    }
  
    return this._apiService.get(`/GetAllUsersEndpoint/FilterUsers?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetUserByIDEndPoint/GetUserById?ID=${ID}`);
  }
  remove(body:employeeViewModel ) {
    return this._apiService.remove(`/DeleteGovernorateEndPoint/DeleteGovernorate`,body);
  }

  postOrUpdate(body:employeeCreateViewModel ) {
    if (body.id) return this._apiService.update(`/EditUserEndPoint/Put`, body)
    else return this._apiService.post(`/CreateUserEndPoint/Post`, body)
  }
  changePassword(body :changePasswordViewModel)
  {
    return this._apiService.update(`/ChangeUserPasswordEndPoint/ChangeUserPassword`, body);
  }


  bulkActivate(ids :string[])
  {
    return this._apiService.update(`/BulkActivateUserEndPoint/BulkActivateUser`, { ids });
  }

  bulkDeactivate(ids :string[])
  {
    return this._apiService.update(`/BulkDeActivateUserEndPoint/BulkDeActivateUser`, { ids });
  }

  updateActivated(id: string) {
    return this._apiService.update(`/ActivateUserEndPoint/ActivateUser`, id);
  }

  updateDeactivated(id:string) {
    return this._apiService.update(`/DeactivateUserEndPoint/DeactivateUser`, id);
  }

}
