import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/shared/service/api.service';
import { brandSearchViewModel, brandCreateViewModel, brandViewModel, brandActivateViewModel } from '../interfaces/brand';

@Injectable({
	providedIn: 'root'
})
export class BrandService {

	constructor(private _apiService: ApiService) { }

	get(searchViewModel: brandSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
		if (pageSize == 0)
			pageSize = environment.pageSize;
		let params = new HttpParams();
		if (searchViewModel.Name) {
			params = params.set("Name", searchViewModel.Name);
		}

		return this._apiService.get(`/GetListBrandEndPoint/GetList?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
	}
	getById(ID: string) {
		return this._apiService.get(`/GetBrandByIDEndPoint/GetBrandByID?ID=${ID}`,);
	}
	remove(body: brandViewModel) {
		return this._apiService.remove(`/DeleteBrandEndPoint/DeleteBrand`, body);
	}

	postOrUpdate(body: brandViewModel) {
		if (body.id) return this._apiService.update(`/EditBrandEndPoint/EditBrand`, body)
		else return this._apiService.post(`/CreateBrandEndPoint/AddBrand`, body)
	}


	updateActivated(body: brandActivateViewModel) {
		return this._apiService.update(`/ActiveBrandEndPoint/ActiveBrand`, body);
	}
	updateDeactivated(body: brandActivateViewModel) {
		return this._apiService.update(`/DeactiveBrandEndPoint/DeactiveBrand`, body);
	}

	uploadImage(formData: FormData) {
		return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
	}

	bulkDelete(ids: string[]) {
		return this._apiService.remove(`/BulkDeleteBrandEndPoint/BulkDeleteBrand`, { ids });
	}
	bulkActivate(ids: string[]) {
		return this._apiService.update(`/BulkActivateBrandEndPoint/BulkActivateBrand`, { ids });
	}
	// Bulk deactivate governorates
	bulkDeactivate(ids: string[]) {
		return this._apiService.update(`/BulkDeActivateBrandEndPoint/BulkDeActivateBrand`, { ids });
	}


}
