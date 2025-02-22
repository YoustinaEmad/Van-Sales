export interface LoginViewModel {
  mobile: string;
  password: string;
}

export interface RegisterViewModel {
  nationalNumber?: string;
  name: string;
  userName: string;
  password: string;
  mobile: string;
  age?: string;
  gender?: number;
  governorateId: string;
  cityId: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  email?: string;
  confirmPassword: string;
  phone?:string;
  paths?: string[];
  clientActivity?:number;
  buildingData:string;
}

export interface OtpViewModel {
  token: string;
  otp: string;
}
export interface ResendOtpViewModel {
  token: string;
}
export interface PhoneViewModel {
  mobile: string;
}
export interface ForgetpasswordViewModel {
  userId:string;
  password: string;
  confirmPassword:string;
}

