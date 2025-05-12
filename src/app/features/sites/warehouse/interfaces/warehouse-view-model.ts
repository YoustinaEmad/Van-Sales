
export interface WarehouseViewModel {
  id: string; 
  name: string; 
  code: string; 
  data:string;
  warehouseType:number;
  governorateId:string;
  governorateName:string;
  cityId:string;
  cityName:string;
  street:string;
  landmark:string;
  latitude:string;
  longitude:string;
  buildingData:string;
  isActive:boolean;
  selected:boolean;
  numberOfProduts:number;
}

export class warehouseCreateViewModel {
  id: string;
  name: string;
  code: string; 
  data:string;
  warehouseType:number;
  governorateId:string;
  cityId:string;
  street:string;
  landmark:string;
  latitude:string;
  longitude:string;
  buildingData:string;

}

export class warehouseSearchViewModel {
  Name?: string;
  Code?:string;
  Data?:string;
  WarehouseType?:number;
  GovernorateId?:string;
  GovernorateName?:string;
  CityId?:string;
  CityName?:string;
  Street?:string;
  Landmark?:string;
}
export class warehouseActivateViewModel {
  id:string;
}