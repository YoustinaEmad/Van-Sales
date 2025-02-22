export interface adsViewModel {
    id: string; 
    title: string; 
    isActive:boolean;
    selected?: boolean; 
    imageTypes:number;
    hyperlink:string;
    startDate:Date;
    endDate:Date;
    path:string;
  }
  export class adsCreateViewModel {
    id: string; 
    title: string;
    imageTypes:number;
    paths:string[];
    isActive:boolean;
    hyperlink:string;
    startDate:Date;
    endDate:Date;
    path: string;
  }
  export class adsSearchViewModel {
    Name: string;
  }
  export class adsActivateViewModel{
    id:string;
  }

  