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
  salesManID:string;
  salesManName:string;
  details: GetAllPlannedDispatchsDetails;
}

export class GetAllPlannedDispatchsDetails {
  clientID:string;
  clientName:string;
  startDate:Date;
}

export class DispatchPlannedSearchViewModel {
  From :Date;
  To :Date;
}