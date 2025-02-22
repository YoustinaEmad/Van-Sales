
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { governorateActivateViewModel, governorateSearchViewModel, governorateViewModel } from './interfaces/governorate';


@Injectable( {
	providedIn: 'root'
} )
export class GovernmentService {

	constructor(private _apiService: ApiService) { }
  
	get(searchViewModel: governorateSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
	  if (pageSize == 0)
		pageSize = environment.pageSize;
    let params = new HttpParams();
	  if (searchViewModel.Name) {
		params = params.set("Name", searchViewModel.Name);
	  }
	  
	  return this._apiService.get(`/V4/FailedDeliveryReason/getall?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
	}
	getById(ID: string) {
	  return this._apiService.get(`/V4/FailedDeliveryReason/GetByID?ID=${ID}`,);
	}
	remove(ID: string) {
	  return this._apiService.remove(`/V4/FailedDeliveryReason/Delete?ID=${ID}`);
	}
  
	
	postOrUpdate(body: governorateViewModel) {
	  if (body.id) return this._apiService.update(`/V4/FailedDeliveryReason/edit`, body)
	  else return this._apiService.post(`/V4/FailedDeliveryReason/Create`, body)
	}



	updateActivated(body:governorateActivateViewModel ) {
   
    return this._apiService.update(`/ActiveGovernorateEndpoint/Active`,body);
  }
  updateDeactivated(body:governorateActivateViewModel) {
    return this._apiService.update(`/DeactiveGovernorateEndpoint/Deactive`,body);
  }

	
  }