export interface DispatchActualViewModel {


}
export interface DispatchPlannedViewModel {


}

export class createDispatchPlannedViewModel {
  startDate:Date;
  salesManID:string;
  clientIDs:string[];
}

export class GetAllPlannedDispatchs {
  id:string;
  startDate:Date;
  salesManID:string;
  salesManName:string;
  details: GetAllPlannedDispatchsDetails;
}

export class GetAllPlannedDispatchsDetails {
  clientID:string;
  clientName:string;
}