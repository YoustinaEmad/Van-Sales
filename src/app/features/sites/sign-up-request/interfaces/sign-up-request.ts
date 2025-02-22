export class signUpRequestViewModel {
  id:string;
  nationalNumber:string;
  name:string;
  mobile:string;
  verifyStatus:number;
  roleId:number;
}


export interface verifyStatusViewModel {
  id: string;
  verifyStatus: string;
}
export class detailsSignUpRequestViewModel {
  nationalNumber:string;
  name:string;
  userName:string;
  password:string;
  mobile:string;
  age:string;
  gender:number;
  workInfo:string;
  governorateId:string;
  cityId:string;
  street:string;
  governorateName:string;
  cityName:string;
  landmark:string;
  latitude:number;
  longitude:number;
  email:string;
  clientActivity:number;
  buildingData:string;
  status:number
}
export class RejectReasonViewModel {
  id: string;
  rejectReason?: string;
}
