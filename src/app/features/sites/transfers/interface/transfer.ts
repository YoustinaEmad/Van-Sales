export interface transferViewModel {
    transactionNumber: string;
    fromWarehouseName: string;
    toWarehouseName: string;
    warehouseToWarehouseStatus: number;
    productsQuantity: number;
    selected: boolean;
}
export class transferSearchViewModel {
    Data: string;
    FromWarehouseId: string;
    ToWarehouseId: string;
    WarehouseToWarehouseStatus: number;
    From: Date;
    To: Date;
}

export class transferCreateViewModel {
    id: string;
    salesManID: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    transactionDetailsVM: WarehouseToWarehouseTransactionDetailsVM[];
}
export class WarehouseToWarehouseTransactionDetailsVM {
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