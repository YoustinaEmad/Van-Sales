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



export class GetAllActualDispatchs {
  id:string;
  salesManID:string;
  salesManName:string;
  dispatchNumber:string;
  details: GetAllActualDispatchsDetails;
}



export class GetAllActualDispatchsDetails {
  clientID:string;
  clientName:string;
  visitDate :Date;
  dispatchStatus:number;
}
export class DispatchActualSearchViewModel {
  From :Date;
  To :Date;
  DispatchStatus :number;
}


export class createDispatchActualViewModel {
  visitDate:Date;
  salesManID:string;
  clientId:string;
  dispatchStatus:number;
}