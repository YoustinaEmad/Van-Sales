export interface salesManViewModel {
    id: string; 
    name: string; 
    cities: string[]; 
    isActive:boolean;
    governorateCode:string;
    selected?: boolean; 
}

  export class salesManCreateViewModel {
    id: string;
    name: string;
    governorateCode:string;
    isActive:boolean;
  }
  export class salesManSearchViewModel {
    Name: string;
  }
  export class salesManActivateViewModel {
    id:string;
  }