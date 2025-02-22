export interface governorateViewModel {
  id: string; // id of the governorate
  name: string; // Name of the governorate
  cities: string[]; // Array of cities in the governorate
  isActive:boolean;
  governorateCode:string;
  selected?: boolean; 
}
export class governorateCreateViewModel {
  id: string;
  name: string;
  governorateCode:string;
  isActive:boolean;
}
export class governorateSearchViewModel {
  Name: string;
}
export class governorateActivateViewModel {
  id:string;
}