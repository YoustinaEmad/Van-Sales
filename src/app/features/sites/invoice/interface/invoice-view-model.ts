
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
export class productDetails {
    name: string;
    id:string;
    maxQuantity : number;
    itemWeightPerKG : number;
    itemPrice : number;
}

