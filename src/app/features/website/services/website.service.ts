import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/service/api.service';
import { ProductCartViewModel, WishListProduct } from '../models/product-cart';
import { changePasswordViewModel, profileSettingViewModel, setDefaultShippingAddressViewModel, UserViewModel } from '../models/user.model';
import { CategoryEnum } from '../models/enum/category';
import { CreateOrderByClientViewModel, CreateShippingAddressViewModel, EditShippingAddressViewModel } from '../models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  productsInCart: ProductCartViewModel[] = [];
  wishListProduct: WishListProduct[] = [];
  totalPrice: number;
  userInfo: UserViewModel;
  userLoading: boolean = true;
  constructor(private _apiService: ApiService) {}

  getUserInfo() {
    return this._apiService.get('/UserDataEndpoint/GetUserData');
  }

  getProductsInCard() {
    return this._apiService.get(
      '/GetAllProductAtCartWithPriceEndpoint/GetAllProductAtCartWithPrice'
    );
  }

  getWishListProducts() {
    return this._apiService.get('/GetAllProductFromWishlistEndPoint/GetAll');
  }

  addToSellCart(id, quantity) {
    console.log(quantity);
    
    let params = {
      ProductId: id,
      Quantity: quantity??1,
    };
    return this._apiService.post('/AddProductToCartEndPoint/Post', params);
  }
  removeFromSellCart(id) {
    let params = {
      ProductId: id,
    };
    
    return this._apiService.remove(
      `/RemoveProductFromCartEndPoint/RemoveProductFromCart?ProductId=${id}`,
      params
    );
  }

  addToWishList(id) {
    let params = {
      ProductId: id,

    };
    return this._apiService.post(
      '/AddProductToWishlistEndPoints/AddProductToWishlist',
      params
    );
  }
  removeFromWishList(id) {
    let params = {
      ProductId: id,
    };
    return this._apiService.remove(
      '/DeleteProductFromWishlistEndPoint/Delete',
      params
    );
  }

  getProductsByCategory(categoryType: CategoryEnum) {
    let params = {
      GetProductType: categoryType,
      NumberOfProducts: 4,
    };
    return this._apiService.get(
      `/GetProductsByTypeEndpoint/GetProductsByType?GetProductType=${params.GetProductType}&NumberOfProducts=${params.NumberOfProducts}`
    );
  }

  getCompaniesOfProduct() {
    return this._apiService.get('/GetAllBrandEndpoint/GetList?NumberOfBrand=4');
  }

  getAllShippingAdresses(ID: string) {
    return this._apiService.get(`/GetShippingAddressesForClientEndPoint/GetShippingAddressesForClient?ClientId=${ID}`);
  }

  EditShippingAddress(body:EditShippingAddressViewModel)
  {
    return this._apiService.update(`/EditShippingAddressEndPoint/Put`,body)
  }
  getShippingAddressById(id:string)
  {
    return this._apiService.get(`/GetShippingAddresseIdEndpoint/GetById?ID=${id}`,);
  }

  CreateOrder(body:CreateOrderByClientViewModel ) {
    
    return this._apiService.post(`/PlaceOrderByClientEndpoint/Post`, body)
 }
 AddShippingAddress(body:CreateShippingAddressViewModel){
  return this._apiService.post(`/CreateShippingAddressEndPoint/Post`, body)
 }
 changePassword(body :changePasswordViewModel)
 {
   return this._apiService.update(`/ChangePasswordEndPoint/ChangePassword`, body);
 }
 profileSetting(body :profileSettingViewModel)
 {
   return this._apiService.update(`/EditClientEndpoint/Put`, body);
 }

 getClientById(id :string)
 {
   return this._apiService.get(`/GetClientByIdEndPoint/GetClientById?ID=${id}`);
 }
 
getOrderHistory(pageIndex: number=1, pageSize: number = 50)
{
      if (pageSize == 0)
        pageSize = environment.pageSize;
  return this._apiService.get(`/GetOrderHistoryEndpoint/OrdersHistory?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}


getDefaultShippingAddress(clientId:string)
{
  return this._apiService.get(`/GetIDOfDefualtShippingAddressEndPoint/GetIDOfDefualtShippingAddress?ClientId=${clientId}`);
}


setDefaultShippingAddress(body :setDefaultShippingAddressViewModel)
{
  return this._apiService.update(`/SetDefaultShippingAddressEndPoint/SetDefaultShippingAddress`,body);
}
getByOrderNumber(OrderNumber: string) {
  return this._apiService.get(`/GetOrderByNumberEndPoint/GetOrderByNumber?OrderNumber=${OrderNumber}`,);
}

getOrderById(ID: string) {
  return this._apiService.get(`/GetOrderByIDEndPoint/GetOrderByID?ID=${ID}`,);
}

reOrder(OrderId:string)
{
return this._apiService.post(`/ReorderEndpoint/Post`,{OrderId});
}


}
