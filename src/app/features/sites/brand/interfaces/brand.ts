export interface brandViewModel {
  id: string; 
  name: string; 
  paths:string[];
  isActive:boolean;
  selected?: boolean; 

}
export class brandCreateViewModel {
  id: string;
  name: string;
  paths:string[];
}
export class brandSearchViewModel {
  Name: string;
}
export class brandActivateViewModel{
  id:string;
}