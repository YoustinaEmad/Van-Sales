
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/service/api.service';
import { productCreateViewModel, productSearchViewModel, productViewModel, categoryActivateViewModel, categorySelectedItem, reStockViewModel, productActivateViewModel } from '../interfaces/product';




@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _apiService: ApiService) { }

  get(searchViewModel: productSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number = 0) {
    if (pageSize == 0)
      pageSize = environment.pageSize;

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Code) {
      params = params.set("Code", searchViewModel.Code);
    }
    if (searchViewModel.CategoryId) {
      params = params.set("CategoryId", searchViewModel.CategoryId);
    }
    if (searchViewModel.ProductStatus) {
      params = params.set("ProductStatus", searchViewModel.ProductStatus);
    }
    if (searchViewModel.Grade) {
      params = params.set("Grade", searchViewModel.Grade);
    }
    if (searchViewModel.Unit) {
      params = params.set("Unit", searchViewModel.Unit);
    }
     if (searchViewModel.BrandID) {
      params = params.set("BrandID", searchViewModel.BrandID);
    }
    if (searchViewModel.IsActive) {
      params = params.set("IsActive", searchViewModel.IsActive);
    }
    return this._apiService.get(`/GetAllProductsEndPoint/GetAllProducts?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }


  getToDownloadPDF(searchViewModel: productSearchViewModel, orderBy: string, isAscending: boolean, pageIndex: number, pageSize: number ) {
    
    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Code) {
      params = params.set("Code", searchViewModel.Code);
    }
    if (searchViewModel.CategoryId) {
      params = params.set("CategoryId", searchViewModel.CategoryId);
    }
    if (searchViewModel.ProductStatus) {
      params = params.set("ProductStatus", searchViewModel.ProductStatus);
    }
    if (searchViewModel.Grade) {
      params = params.set("Grade", searchViewModel.Grade);
    }
    if (searchViewModel.Unit) {
      params = params.set("Unit", searchViewModel.Unit);
    }
    if (searchViewModel.IsActive) {
      params = params.set("IsActive", searchViewModel.IsActive);
    }
    return this._apiService.get(`/SearchProductEndPoint/SearchProduct?orderBy=${orderBy}&pageIndex=${pageIndex}&pageSize=${pageSize}`, params);
  }
  getById(ID: string) {
    return this._apiService.get(`/GetProductByIDEndpoint/GetProductByID?ID=${ID}`,);
  }
  remove(body: productViewModel) {
    return this._apiService.remove(`/DeleteProductEndPoint/DeleteProduct`, body);
  }

  postOrUpdate(body: productCreateViewModel) {
    console.log(body);
    if (body.id) return this._apiService.update(`/EditProductEndpoint/EditWarehouse`, body)
    else return this._apiService.post(`/AddProductEndpoint/Post`, body)
  }

  

  getCategories() {
    return this._apiService.get('/CategorySelectListEndpoint/SelectCategoryList');
  }

  getProductGroup() {
    return this._apiService.get(`/ProductGroupSelectListEndPoint/ProductGroupSelectList`);
  }

  // uploadImage(formData: FormData) {
  //   return this._apiService.postMedia('/UploadMediaEndPoint/UploadMedia', formData, true);
  // }

 getBrands() {

    return this._apiService.get(`/SelectBrandListEndpoint/SelectBrandList`);
  }
  getProductsExcel(searchViewModel: productSearchViewModel) {

    let params = new HttpParams();
    if (searchViewModel.Name) {
      params = params.set("Name", searchViewModel.Name);
    }
    if (searchViewModel.Code) {
      params = params.set("Code", searchViewModel.Code);
    }
    if (searchViewModel.CategoryId) {
      params = params.set("CategoryId", searchViewModel.CategoryId);
    }
    if (searchViewModel.ProductStatus) {
      params = params.set("SubcategoryId", searchViewModel.ProductStatus);
    }
    if (searchViewModel.Grade) {
      params = params.set("Grade", searchViewModel.Grade);
    }
    if (searchViewModel.Unit) {
      params = params.set("Unit", searchViewModel.Unit);
    }
    if (searchViewModel.IsActive) {
      params = params.set("IsActive", searchViewModel.IsActive);
    }
    return this._apiService.getExcel(`/ExportProductsToExcelEndpoint/AllProducts`, params);
  }
  bulkDelete(ids: string[]) {
    return this._apiService.remove(`/BulkDeleteProductEndPoint/BulkDeleteProduct`, { ids });
  }

  reStock(body: reStockViewModel) {
    return this._apiService.update(`/RestockProductEndPoint/RestockProduct`, body)
  }
  updateActivated(body: productActivateViewModel) {

    return this._apiService.update(`/ActivateProductsEndPoint/ActiveProduct`, body);
  }
  updateDeactivated(body: productActivateViewModel) {
    return this._apiService.update(`/DeactivateProductsEndPoint/DeactiveProduct`, body);
  }
  updateActivatedpoint(body: productActivateViewModel) {

    return this._apiService.update(`/ActivatePointsEndpoint/ActivePoint`, body);
  }
  updateDeactivatedPoint(body: productActivateViewModel) {
    return this._apiService.update(`/DeactivatePointsEndpoint/DeactivatePoint`, body);
  }

  bulkActivate(ids: string[]) {
    return this._apiService.update(`/BulkActivateProductEndpoint/BulkActivateProduct`, { ids });
  }

  bulkDeactivate(ids: string[]) {
    return this._apiService.update(`/BulkDeactivateProductEndpoint/BulkDeactivateProduct`, { ids });
  }
}
