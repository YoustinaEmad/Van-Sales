export interface customerGroupViewModel {
    id: string;
    name: string;
    taxExempted: boolean;
    selected?: boolean; 
}
export class customerGroupCreateViewModel {
    id:string;
    name:string;
    taxExempted:boolean
}
export class customerGroupSearchViewModel {
    Name:string;
}
export class customerGroupTaxesViewModel {
    id:string;
    taxExempted:boolean;
}


