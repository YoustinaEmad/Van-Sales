import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { customerGroupSearchViewModel } from '../../customer-group/interfaces/customer-group-view-model';
import { changePasswordViewModel, customerActivateViewModel, customerCreateViewModel, customerSearchViewModel, customerViewModel } from '../interfaces/customers';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  [x: string]: any;

  constructor(private _apiService: ApiService) { }

  get(searchViewModel: customerSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Email) {
      params = params.set("Email", searchViewModel.Email);
    }
    if (searchViewModel.ClientGroupId) {
      params = params.set("ClientGroupId", searchViewModel.ClientGroupId);
    }
    if (searchViewModel.NationalNumber) {
      params = params.set("NationalNumber", searchViewModel.NationalNumber);
    }
    if (searchViewModel.VerifyStatus) {
      params = params.set("VerifyStatus", searchViewModel.VerifyStatus);
    }
    if (searchViewModel.Mobile) {
      params = params.set("Mobile", searchViewModel.Mobile);
    }
    return this._apiService.get(`/SearchClientEndPoint/SearchClient?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getTodownloadPDF(searchViewModel: customerSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number ) {
    

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Email) {
      params = params.set("Email", searchViewModel.Email);
    }
    if (searchViewModel.ClientGroupId) {
      params = params.set("ClientGroupId", searchViewModel.ClientGroupId);
    }
    if (searchViewModel.NationalNumber) {
      params = params.set("NationalNumber", searchViewModel.NationalNumber);
    }
    if (searchViewModel.VerifyStatus) {
      params = params.set("VerifyStatus", searchViewModel.VerifyStatus);
    }
    if (searchViewModel.Mobile) {
      params = params.set("Mobile", searchViewModel.Mobile);
    }


    return this._apiService.get(`/GetAllOrdersEndpoint/GetAllOrders?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetClientByIdEndPoint/GetClientById?ID=${ID}`,);
  }
 

  postOrUpdate(body:customerCreateViewModel ) {
    if (body.id) return this._apiService.update(`/EditClientEndpoint/Put`, body)
    else return this._apiService.post(`/CreateClientEndPoint/Post`, body)
  }



  updateActivated(body: customerActivateViewModel) {
    return this._apiService.update(`/ActivateClientsEndPoint/ActiveClient`, body);
  }

  updateDeactivated(body: customerActivateViewModel) {
    return this._apiService.update(`/DeactivateClientsEndPoint/DeactivateClient`, body);
  }

  getStatus() {
    return this._apiService.get('/GetVerifyStatusListEndpoint/SelectList');
  }
  getClientGroups() {
    return this._apiService.get('/SelectClientGroupListEndPoint/SelectClientGroupList');
  }
  getGovernorates() {
    return this._apiService.get('/GetDropdownListGovernorateEndPoint/GetDropdownList');
  }

  getCities(governorateId?: string) {
    let url: string;
  
    if (governorateId) {
      url = `/SelectCityListEndPoint/SelectCityList?governorateId=${governorateId}`;
    } else {
      url = `/SelectCityListEndPoint/SelectCityList`;
    }
  
    return this._apiService.get(url); 
  }
  uploadImage(formData: FormData) {
    return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  }
  
  getCustomerExcel(searchViewModel: customerSearchViewModel) {
    
    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Email) {
      params = params.set("Email", searchViewModel.Email);
    }
    if (searchViewModel.ClientGroupId) {
      params = params.set("ClientGroupId", searchViewModel.ClientGroupId);
    }
    if (searchViewModel.NationalNumber) {
      params = params.set("NationalNumber", searchViewModel.NationalNumber);
    }
    if (searchViewModel.VerifyStatus) {
      params = params.set("VerifyStatus", searchViewModel.VerifyStatus);
    }
    if (searchViewModel.Mobile) {
      params = params.set("Mobile", searchViewModel.Mobile);
    }
    return this._apiService.getExcel(`/ExportClientToExcelEndpoint/AllClients`, params);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteDiscountEndPoint/BulkDeleteDiscount`, { ids });
  }
  bulkActivate(ids :string[])
  {
    return this._apiService.update(`/BulkActivateClientsEndpoint/ActivateClients`, { ids });
  }

  bulkDeactivate(ids :string[])
  {
    return this._apiService.update(`/BulkDeactivateClientsEndpoint/DeactivateClients`, { ids });
  }
  changePassword(body :changePasswordViewModel)
  {
    return this._apiService.update(`/ChangePasswordEndPoint/ChangePassword`, body);
  }
}
