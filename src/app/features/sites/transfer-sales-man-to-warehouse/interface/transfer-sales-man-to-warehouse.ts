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
    fromWarehouseId: string;
    toWarehouseId: string;
    transactionDetailsVM: WarehouseToWarehouseTransactionDetailsVM[];
    fromWarehouseName : string;
    toWarehouseName : string;
    warehouseToWarehouseStatus : number;
    salesmanName : string;
    transactionNumber : string;
}

export class WarehouseToWarehouseTransactionDetailsVM {
    productID: string;
    quantity: number;
    productName?:string


}
export interface selectedProductViewModel {
    id: string;
    name: string;
}

export interface GetAllProductAtCart {
    productId: string;
    quantity: number;

}