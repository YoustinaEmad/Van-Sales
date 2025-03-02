export interface supplierViewModel {
  id:string;
  code:string;
   name:string;
   collaborationAdministrator:string;
   creditLimit:number;
  classificationId:string;
  governorateId:string;
  cityId:string;
  street:string;
  landmark:string;
  latitude:number;
  longitude:number;
  buildingData:string;
  path:string;
  isActive:boolean;
  selected?:string;
}
  export class supplierCreateViewModel {
    id:string;
    code:string;
     name:string;
     collaborationAdministrator:string;
     creditLimit:number;
    classificationId:string;
    governorateId:string;
    cityId:string;
    street:string;
    landmark:string;
    latitude:number;
    longitude:number;
    buildingData:string;
    path:string;

  }
  export class supplierSearchViewModel {
    Name: string;
    Code:string;
  }
  export class supplierActivateViewModel {
    id:string;
  }