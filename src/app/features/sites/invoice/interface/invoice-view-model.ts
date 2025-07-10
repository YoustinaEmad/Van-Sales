
export interface InvoiceViewModel {
  id:string
    invoiceNumber: string; 
    salesManID : string; 
    salesManName :string;
    clientID :string;
    clientName :string;
    totalPrice :number;
    totalNetPrice :number;
    totalWeightInKG :number;
    totalQuantity :number;
    createdDate :Date;
    selected?: boolean; 
}
 export class IvoiceSearchViewModel {
    id:string
   From: Date;
   To: Date;
   SalesManID: string;
   ClientID: string;
  }