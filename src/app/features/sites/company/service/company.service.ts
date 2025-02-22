import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { CompanyCreateViewModel, CompanySearchViewModel, CompanyViewModel } from '../../company/interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  constructor(private _apiService: ApiService) { }

  get(searchViewModel: CompanySearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.CompanyName) {
      params = params.set("CompanyName", searchViewModel.CompanyName);
    }
    if (searchViewModel.CityID) {
      params = params.set("CityID", searchViewModel.CityID);
    }
    if (searchViewModel.GovernorateID) {
      params = params.set("GovernorateID", searchViewModel.GovernorateID);
    }

    return this._apiService.get(`/CompanyFilterByNameEndpoint/GetList?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetCompanyByIDEndPoint/GetByID?ID=${ID}`,);
  }
  remove(body: CompanyViewModel) {
    return this._apiService.remove(`/DeleteCompanyEndPoint/Delete`, body);
  }

  postOrUpdate(body: CompanyCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditCompanyEndPoint/Put`, body)
    else return this._apiService.post(`/CreateCompanyEndPoint/Post`, body)
  }

  // SharedService or GovernorateService
  getCities(governorateId?: string) {
    let url: string;
  
    if (governorateId) {
      // If governorateId is provided, fetch cities for that governorate
      url = `/SelectCityListEndPoint/SelectCityList?governorateId=${governorateId}`;
    } else {
     
      // If governorateId is not provided, fetch all cities
      url = `/SelectCityListEndPoint/SelectCityList`;
    }
  
    return this._apiService.get(url); // Make the API call with the determined URL
  }



  getClassifications() {
    return this._apiService.get(`/SelectListClassificationEndpoint/SelectListClassification`);
  }
  

}
