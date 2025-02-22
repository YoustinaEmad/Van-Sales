export interface UserViewModel {
  name: string;
  phone: string;
  email: string;
}
export class changePasswordViewModel {
  password:string;
  confirmPassword: string;
}
export class profileSettingViewModel {
  id:string;
  nationalNumber?:string;
  name: string;
  userName: string;
  age?: string;
  gender?: string;
  mobile: string;
  phone?: string;
  email?: string;
  clientActivity?: number;

}
export class setDefaultShippingAddressViewModel {
  iD:string;
  clientId:string;
}