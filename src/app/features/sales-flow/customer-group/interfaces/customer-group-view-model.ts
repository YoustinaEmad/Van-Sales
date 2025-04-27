export interface customerGroupViewModel {
    id: string;
    name: string;
    selected?: boolean; 
   // isActive:boolean;
}
export class customerGroupCreateViewModel {
    id:string;
    name:string;
   // isActive:boolean;
}
export class customerGroupSearchViewModel {
    Name:string;
}
export class customerGroupTaxesViewModel {
    id:string;
    taxExempted:boolean;
}


