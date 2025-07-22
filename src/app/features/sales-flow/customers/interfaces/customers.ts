export interface customerViewModel {
  id:string;
  name:string;
  isActive:boolean;
  clientGroupName:string;
  email:string;
  nationalNumber:string;
  path:string;
  mobile:number;
  clientType:number;
  religion : number;
  selected?: boolean; 
}
export class customerSearchViewModel {
  Name:string;
  Email:string;
  NationalNumber:string;
  ClientGroupId:string;
  From:Date;
  To:Date;
  clientType:number;
  Mobile:string;
}
export class customerSelectedViewModel {
  id:string;
  name:string;
}
export class customerActivateViewModel{
  id:string;
}
export class customerCreateViewModel {
  id:string;
  name: string;
  nationalNumber?: string;
  gender?: string;
  mobile: string;
  governorateId: string;
  cityId: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  clientGroupId?: string;
  email?: string;
  paths?: string[];
   religion : number;
  clientType:number;
}
export class changePasswordViewModel {
  password:string;
  confirmPassword: string;
  iD:string
}
