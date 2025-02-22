export interface orderViewModel {
  id: string;
  orderNumber: string;
  name: string;
  mobile: string;
  orderStatus: number;
  totalPrice: number;
  CreatedDate: Date;
  shippingAddressId:string;
  shippingAddressStatus:number;
}
export class orderSelectedViewModel {
  id:string;
  name:string;
}
export interface orderSearchViewModel {
  CustomerName?: string;
  CustomerNumber?: string;
  OrderNumber?: string;
  OrderStatus?: number;
  TotalPrice?: number;
  From?: Date;
  To?: Date;
}
export interface orderStatusViewModel {
  id: string;
  orderStatus: string;
}
export interface shippingAddressStatusViewModel {
  id: string;
  shippingAddressStatus: string;
  shippingAddressId:string;
}


export interface orderCreateViewModel {
  orderID:string;
  nationalNumber?: string;
  name?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  mobile: string;
  paths?: string[];
  clientActivity?:number;
  buildingData:string;
  governorateId: string;
  cityId: string;
  street: string;
  landmark: string;
  email?: string;
  phone?: string;
  clientGroupId?: string;
  comment: string;
  shippingAddressId?: string;
  isDefualt?: boolean;
  notifyCustomer?: boolean;
  age?: number;
  gender?: number;
  latitude?: number;
  longitude?: number;
  status:number;
  cartProductsResult: GetAllProductAtCart[];
}
export interface SearchCustomerViewModel {
  NationalNumber?: string;
  name: string;
  age?: number;
  mobile: string;
  shippingAddresses: GetShippingAddressesForClientViewModel;
  isActive: boolean;
  userId: string;
  email?: string;
  phone?: string;
  clientGroupId?: string;
  clientGroupName: string;

}
export interface EditShippingAddressViewModel{
  id:string ;
  governorateId:string;
  cityId:string;
  street:string;
  landmark:string;
  latitude:number;
  longitude:number;
  buildingData:string;
  status:number;
}
export interface GetAllProductAtCart {
  productId: string;
  quantity: number;
  
}

export interface selectedProductViewModel {
  id: string;
  name: string;
}
export interface priceProductViewModel {
  id: string;
  productName: string;
  itemPrice:number;
}

export interface GetShippingAddressesForClientViewModel {
  id: string;
  governorateName: string;
  governorateId: string;
  cityName: string
  cityId: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  buildingData:string;
  status:number;
}
export interface orderDetailsViewModel {
  orderNumber:string;
  totalPrice:number;
  totalNetPrice:number;
  status:number;
  createdDate:Date;
  orderId:string;
  customerName:string;
  mobile:string;
  email:string;
  totalLiter:number;
  orderItems: orderItemsViewModel[];
}
export  class orderItemsViewModel {
  productId:string;
  quantity:number;
  itemPrice:number;
  price:number;
  netPrice:number;
  name:string;
  path?:string;
  itemLiter:string;
  liter:string;
}
export class editOrderViewModel {
  orderID:string;
  orderNumber:string;
  items:editOrderItemsViewModel[];
  comment:string;
  clientId:string;
  nationalNumber:string;
  name:string;
  age:number;
  mobile:string;
  workInfo:string;
  email:string;
  clientGroupId?:string;
  phone?:string;
  shippingAddressID:string;
  governorateId:string;
  cityId:string;
  street:string;
  landmark:string;
  latitude:number;
  longitude:number;
  userName:string;
  gender:number;

  buildingData:string;
  status:number;

  clientActivity:number;

}

export class editOrderItemsViewModel{
 productId:string;
 productName:string;
 quantity:number;
 itemPrice:number;
 price:number;
}