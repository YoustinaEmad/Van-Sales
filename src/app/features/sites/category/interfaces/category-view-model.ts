export interface categoryViewModel {
  id: string;
  name: string;
  isActive: boolean;
  selected?:boolean;
}

export class categoryCreateViewModel {
  id:string;
  name: string;
}

export class categorySearchViewModel {
  Name?:string
}

export class categorySelectedItem {
  id: string;
  name: string;
  selected:boolean;
}

export class categoryActivateViewModel{
  id:string;
}