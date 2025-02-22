import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { categoryActivateViewModel, categoryCreateViewModel, categorySearchViewModel, categoryViewModel } from 'src/app/features/sites/category/interfaces/category-view-model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _apiService: ApiService) { }

  get(searchViewModel: categorySearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {

    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.CategoryId) {
      params = params.set("CategoryId", searchViewModel.CategoryId);
    }
    if (searchViewModel.SubCategoryId) {
      params = params.set("SubCategoryId", searchViewModel.SubCategoryId);
    }

    return this._apiService.get(`/GetCategoryIndexEndpoint/Get?orderBy=${orderBy}&isAscending=${isAscending}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }

  getById(ID: string) {
    return this._apiService.get(`/GetCategoryByIdEndpoint/GetByID?ID=${ID}`,);
  }

  remove(body: categoryViewModel) {
    return this._apiService.remove(`/DeleteCategoryEndPoint/DeleteCategory`, body);
  }

  postOrUpdate(body: categoryCreateViewModel) {
    if (body.id) return this._apiService.update(`/EditCategoryEndPoint/Put`, body)
    else return this._apiService.post(`/CreateCategoryEndPoint/AddCategory`, body)
  }


  getCategories() {
    return this._apiService.get('/SelectCategoryListEndpoint/GetCategories');
  }

  getSubCategories(categoryeId: string) {
    return this._apiService.get(`/SelectSubcategoryListEndPoint/SelectSubcategoryList?CategoryId=${categoryeId}`);
  }
  updateActivated(body: categoryActivateViewModel) {

    return this._apiService.update(`/ActivateCategoriesEndPoint/ActiveCategory`, body);
  }
  updateDeactivated(body: categoryActivateViewModel) {
    return this._apiService.update(`/DeactivateCategoriesEndPoint/DeactivateCategory`, body);
  }
  uploadImage(formData: FormData) {
    return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  }
  
  bulkDelete(ids: string[]) {
		return this._apiService.remove(`/BulkDeleteCategoryEndPoint/BulkDeleteCategory`, { ids });
	}
	bulkActivate(ids: string[]) {
		return this._apiService.update(`/BulkActivateCategoryEndPoint/BulkActivateCategory`, { ids });
	}
	// Bulk deactivate governorates
	bulkDeactivate(ids: string[]) {
		return this._apiService.update(`/BulkDeActivateCategoryEndPoint/BulkDeActivateCategory`, { ids });
	}
}
