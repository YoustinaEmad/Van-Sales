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