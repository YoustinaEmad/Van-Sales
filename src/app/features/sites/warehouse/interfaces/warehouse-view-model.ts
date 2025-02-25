
export interface WarehouseViewModel {
  id: string; 
  name: string; 
  cities: string[]; 
  isActive:boolean;
  governorateCode:string;
  selected?: boolean; 
}
export class warehouseCreateViewModel {
  id: string;
  name: string;
  governorateCode:string;
  isActive:boolean;
}
export class warehouseSearchViewModel {
  Name: string;
}
export class warehouseActivateViewModel {
  id:string;
}