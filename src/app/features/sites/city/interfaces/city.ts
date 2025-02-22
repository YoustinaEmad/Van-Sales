export interface cityViewModel {
    id: string;            // id of the city
    name : string;         // Name of the city
    governorateId: string; 
    governorateName:string;
    isActive:boolean;  
    selected ?:boolean;  
}

export class cityCreateViewModel {
    id: string;           // Unique identifier of the city
    name: string;         // City name
    governorateId: string;  // Governorate name related to the city
    isActive:boolean;
}

export class citySearchViewModel {
     CityName: string;
     GovernorateId: string;
}
export class governorateSelectedItem {
    id: string;
    name: string;
    selected:boolean;
}
export class cityActivateViewModel {
    id:string;
  }
