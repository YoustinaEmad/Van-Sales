
export interface InvoiceViewModel {
    id: string
    invoiceNumber: string;
    salesManID: string;
    salesManName: string;
    clientID: string;
    clientName: string;
    totalPrice: number;
    totalNetPrice: number;
    totalWeightInKG: number;
    totalQuantity: number;
    createdDate: Date;
    selected?: boolean;
}
export class IvoiceSearchViewModel {
    id: string
    From: Date;
    To: Date;
    SalesManID: string;
    ClientID: string;
}


export class InvoiceCreateViewModel {
    id: string
    clientID: string ;
    salesManID?:string;
    notes?:string;
    invoiceDetails:SellingInvoicesDetailsVM[];
}

export class SellingInvoicesDetailsVM {
    productId:string;
    itemWeightPerKG:number;
    quantity:number;
    itemPrice:number;
}

export class InvoiceDetailsViewModel {
    id: string;
    invoiceNumber: string;
    clientID : string;
    clientName : string;
   salesManID : string;
   salesManName : string;
   totalPrice : number;
   totalNetPrice : number;
   totalWeightInKG : number;
   totalQuantity : number;
   taxAmount : number;
   sellingInvoicesDetails : SellingInvoicesDetailsVM2[];
}


export class SellingInvoicesDetailsVM2 {
productId : string;
productName : string;
quantity : number;
itemPrice : number;
price : number;
itemWeightPerKG : number;
weightPerKG : number;
unit : number;
}