export interface supplierViewModel {
  id:string;
  code:string;
   name:string;
   collaborationAdministrator:string;
   mobile:string;
   address:string;
   path:string;
   isActive:boolean;
  selected?:string;
  //  creditLimit:number;
  // classificationId:string;
  // governorateId:string;
  // cityId:string;
  // street:string;
  // landmark:string;
  // latitude:number;
  // longitude:number;
  // buildingData:string;
  // path:string;
  
}
  export class supplierCreateViewModel {
    id:string;
    code:string;
     name:string;
     collaborationAdministrator:string;
   mobile:string;
   address:string;
   path:string;
   // creditLimit:number;
   // classificationId:string;
   // governorateId:string;
    //cityId:string;
   // street:string;
    //landmark:string;
    //latitude:number;
    //longitude:number;
   // buildingData:string;
  }
  export class supplierSearchViewModel {
    Name: string;
    Code:string;
  }
  export class supplierActivateViewModel {
    id:string;
  }