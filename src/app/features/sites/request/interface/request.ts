export interface requestViewModel {
    requestNumber:string;
    requestStatus:string;
    requestStatusName :string
    salesManName:string;
    warehouseName :string;
    quantity :number;
    createDate:Date;
    selected:boolean;
}
export class requestSearchViewModel {
    RequestNumber:string;
    RequestStatus:string;
    SalesManName:string;
    SalesManPhone:string;
    WarehouseId:string;
    CreateDate:Date;
  }
  export class requestCreateViewNodel {
    id:string;
    salesManID:string;
    warehouseId:string;
   // RequestDetails:SalesmanRequestDetailDTO;
  }