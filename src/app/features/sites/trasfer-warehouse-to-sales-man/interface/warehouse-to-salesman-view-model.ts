export interface WarehouseToSalesmanViewModel {
  id:string;
  selected:string;
  transactionNumber:string;
  salesManID:string;
  salesManName:string;
  warehouseId:string;
  warehouseName:string;
  transactionStatus:number;
  createdDate:Date;
  productNumber:number;
   
}
export class createWarehouseToSalesmanViewModel {
  id: string;
  salesManID: string;
  warehouseId: string;
  transactionDetails: WarehouseToSalesmanTransactionDetailsDTO[];

}

export interface WarehouseToSalesmanTransactionDetailsDTO {
  productID: string;
  quantity: number;
}


export class WarehouseToSalesmanSearchViewModel {
  SearchText: string;
  WarehouseId: string;
  From: Date;
  To:Date;
}

export class RejectReasonViewModel {
  Id: string;
  rejectReason?: string;
}
export interface GetAllProductAtCart {
  productId: string;
  quantity: number;
}
export interface ProductsList{
  id:string;
  name:string;
  maxQuantity:number;
}

