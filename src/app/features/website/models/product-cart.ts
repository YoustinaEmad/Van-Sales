export interface ProductCartViewModel {
  productId: string
  productName :string
  path:string
  quantity: number
  price: number
  productQuantity:number;
}

export interface WishListProduct {
  id: string
  name: string
  price: number
  path: string
  quantity? :number
}


