export interface transferViewModel {
    transactionNumber:string;
    fromWarehouseName:string;
    toWarehouseName:string;
    warehouseToWarehouseStatus:number;
    productsQuantity:number;
    selected:boolean;
}
export class transferSearchViewModel {
    Data: string;
    FromWarehouseId:string;
    ToWarehouseId:string;
    WarehouseToWarehouseStatus:number;
    From:Date;
    To:Date;
  }