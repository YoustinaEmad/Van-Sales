export interface customerViewModel {
  id:string;
  name:string;
  isActive:boolean;
  clientGroupName:string;
  email:string;
  verifyStatus:string;
  nationalNumber:string;
  totalOrders:number;
  path:string;
  clientActivity:number;
  mobile:number;
  phone:number;
  selected?: boolean; 
}
export class customerSearchViewModel {
  id:string;
  Name:string;
  Email:string;
  NationalNumber:string;
  ClientGroupId:string;
  VerifyStatus:number;
  From:Date;
  To:Date;
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
  age?: number;
  gender?: string;
  userName: string;
  password: string;
  mobile: string;
  governorateId: string;
  cityId: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  buildingData:string;
  email?: string;
  confirmPassword: string;
  clientGroupId?: string;
  phone?:string;
  paths?: string[];
  clientActivity?:number;
}
export class changePasswordViewModel {
  password:string;
  confirmPassword: string;
  iD:string
}
