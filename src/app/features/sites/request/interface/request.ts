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
    From?:Date;
    To?: Date ;

  }
  export class requestCreateViewNodel {
    id:string;
    salesManID:string;
    warehouseId:string;
    RequestDetails:SalesmanRequestDetailsVM[];
  }

  export class SalesmanRequestDetailsVM {
    quantity:number;
    productId:string;
  }

  export interface selectedProductViewModel {
    id: string;
    name: string;
}

export interface GetAllProductAtCart {
    productId: string;
    quantity: number;

}