export interface transferSalesManToSalesManViewModel {
    id:string;
    transactionNumber :string;
    fromSalesManName:string;
    toSalesMan :string;
    transactionStatus:number;
    productsQuantity:number;
    createdDate:Date;
}

export class transferSalesManToSalesManSearchViewModel {
FromSalesManID:string;
ToSalesManID:string;
transactionStatus:number;
}


export class RejectReasonViewModel {
  transactionId: string;
  rejectReason?: string;
}

export class AddSalesmanToSalesmanTransactionDetailsVM {
  quantity:number;
  productId:string;
  storageType:number;
}

export class salesManToSalesManCreateViewNodel {
  id:string
  toSalesManId:string;
  fromSalesmanId:string;
  transactionDetails:AddSalesmanToSalesmanTransactionDetailsVM [];
}
