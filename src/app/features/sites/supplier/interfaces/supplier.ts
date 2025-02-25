export interface supplierViewModel {
    id: string; 
    name: string; 
    cities: string[]; 
    isActive:boolean;
    governorateCode:string;
    selected?: boolean; 
}
  export class supplierCreateViewModel {
    id: string;
    name: string;
    governorateCode:string;
    isActive:boolean;
  }
  export class supplierSearchViewModel {
    Name: string;
  }
  export class supplierActivateViewModel {
    id:string;
  }