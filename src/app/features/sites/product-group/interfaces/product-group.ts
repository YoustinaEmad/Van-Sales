export interface productGroupViewModel {
    id:string;
    name:string;
    selected?: boolean; 
    isActive:boolean;
}
export class productGroupCreateViewModel {
    id:string;
    name:string;
    isActive:boolean;
  }
  export class productGroupSearchViewModel {
    Name: string;
  }
  export class productGroupActivateViewModel {
    id:string;
  }