export interface employeeViewModel {
  id: string; 
  name: string; 
  userName:string;
  mobile:string;
  roleId:number;
  jobTitle:string;
  isActive:boolean;
 selected?:boolean;
}

export class employeeCreateViewModel {
  id: string; 
  name: string; 
  userName:string;
  mobile:string;
  roleId:number;
  password:string;
  confirmPassword:string;
  jobTitle:string;
}
export class employeeSearchViewModel {
  UserName: string;
  Mobile:string
}
export class changePasswordViewModel {
  password:string;
  confirmPassword: string;
  iD:string
}
