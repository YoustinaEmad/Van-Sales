export interface TransferSalesManToWarehouse {
    selected?: boolean;
    id: string;
    transactionNumber: string;
    salesManID: string;
    salesManName: string;
    warehouseId: string;
    warehouseName: string;
    transactionStatus: number;
    productsQuantity: number;
    createdDate: Date;
}


export class transferSalesManToWarehouseSearchViewModel {
    SalesManID: string;
    WarehouseId: string;
    transactionStatus: number;
}


export class RejectReasonViewModel {
  Id: string;
  rejectReason?: string;
}




export class transferCreateViewModel {
    id: string;
     salesManID: string;
     warehouseId: string;
     transactionDetails: SalesmanToWarehouseTransactionsDetailsDTO[];
   salesManName: string;
   warehouseName: string;
     transactionStatus: number;
     transactionNumber: string;
     createdDate: Date;
}

export interface SalesmanToWarehouseTransactionsDetailsDTO {
  productID: string;
  quantity: number;
}

export interface selectedProductViewModel {
    id: string;
    name: string;
}

export interface GetAllProductAtCart {
    productId: string;
    quantity: number;

}