export class OrderSearchViewModel {
  FromDate: any = new Date();
  ToDate: any = new Date();
  Brand: string;
}
export class OrderViewModel {
  id: string
  productName: string;
  path: string;
  price: number;
  oldPrice: string;
  discount: string;
  quantity: number;
  productQuantity:number;
}

export interface CompanyViewModel {
  id: string;
  name: string;
  path: string;
  currentPrice: string;
  oldPrice: string;
}
export class CheckoutViewModel {
  code: string;
  path : string;
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
  status?: string;
  isDefault?:boolean;
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
}
export class CreateOrderByClientViewModel
{
  comment?:string;
  shippingAddressId?:string;
  governorateId?:string;
  cityId?:string;
  street?:string;
  landmark?:string;
  latitude?:number;
  longitude?:number;
  isDefualt?:boolean;
  buildingData:string;
}

export class CreateShippingAddressViewModel{
  governorateId:string;
  cityId:string;
  street:string;
  landmark:string;
  latitude:number;
  longitude:number;
  clientId:string;
  isDefualt?:boolean;
  buildingData:string;
}
export class orderHistoryViewModel {
iD:string;
orderNumber:string;
name:string;
mobile:string;
status:number;
totalNetPrice:number;
totalPrice:number;
totalQuantity:number;
date:Date;
}

  export interface orderDetailsViewModel {
    orderNumber:string;
    totalPrice:number;
    totalNetPrice:number;
    status:number;
    date:Date;
    orderId:string;
    customerName:string;
    mobile:string;
    email:string;
    totalWeight:number;
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
    itemWeight:string;
    weight:string;
  }