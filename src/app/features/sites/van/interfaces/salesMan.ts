export interface salesManViewModel {
  id:string
    name: string; 
    nationalNumber : string; 
    mobile :string;
    jobCode :string;
    email :string;
    address :string;
    birthDate :Date;
    appointmentDate :Date;
    classification :number;
    path :string;
    isActive:boolean;
    selected?: boolean; 
    
}

  export class salesManCreateViewModel {
    id:string;
    name: string; 
    nationalNumber : string; 
    mobile :string;
    jobCode :string;
    email :string;
    address :string;
    birthDate :Date;
    appointmentDate :Date;
    classification :number;
    imagePath:string;
    warehousesIDs:string[];
    userName:string;
    password:string;
    confirmPassword:string;
    isActive:boolean;
  }
  export class salesManSearchViewModel {
    Name: string;
    NationalNumber:string;
    Mobile:string;
    Classification:number;
    WareHouseId :string;
  }
  export class salesManActivateViewModel {
    id:string;
  }