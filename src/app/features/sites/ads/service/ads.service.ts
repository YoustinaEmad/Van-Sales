import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { environment } from 'src/environments/environment';
import { adsSearchViewModel, adsViewModel, adsActivateViewModel } from '../interfaces/ads';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

 constructor(private _apiService: ApiService) { }
 
  get(searchViewModel: adsSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number=1, pageSize: number = 100) {
    if (pageSize == 0)
      pageSize = environment.pageSize;
    return this._apiService.get(`/GetAllAdvertisementEndpoint/GetList?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetAdvertisementByIDEndPoint/GetAdvertisementByID?ID=${ID}`,);
  }
  remove(body: adsViewModel) {
    return this._apiService.remove(`/DeleteAdvertisementEndPoint/DeleteAdvertisement`, body);
  }
 
  postOrUpdate(body: adsViewModel) {
    if (body.id) return this._apiService.update(`/EditAdvertisementEndpoint/EditAdvertisement`, body)
    else return this._apiService.post(`/CreateAdvertisementEndPoint/CreateAdvertisement`, body)
  }
 
 
  updateActivated(body: adsActivateViewModel) {
    return this._apiService.update(`/ActiveAdvertisementEndPoint/ActiveAdvertisement`, body);
  }
  updateDeactivated(body: adsActivateViewModel) {
    return this._apiService.update(`/DeactivateAdvertisementEndPoint/DeactivateAdvertisement`, body);
  }
 
  uploadImage(formData: FormData) {
    return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  }
 
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteAdvertisementEndpoint/BulkDeletedAdvertisement`, { ids });
  }
  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActivateAdvertisementEndpoint/BulkActivateAdvertisement`, { ids });
  }
  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactivateAdvertisementEndpoint/BulkDeactivateAdvertisement`, { ids });
  }
 
}
