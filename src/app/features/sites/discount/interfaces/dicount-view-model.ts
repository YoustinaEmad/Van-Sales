export interface DicountViewModel {
  id: string;
  name: string;
  discountCategory: number;
  discountType: number;
  receiptAmount?: number;
  amount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  quantity: number;
  selected?: boolean; 

}


export class discountCreateViewModel {
  id: string;
  name: string;
  discountCategory: number;
  discountType: number;
  receiptAmount?: number;
  amount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  quantity: number;
}

export class discountActivateViewModel{
  id:string;
}





