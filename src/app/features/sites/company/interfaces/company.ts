export interface CompanyViewModel {
    id: string;
    name: string;
    mobile: string;
    address: string;
    governorateId: string;
    cityId: string;
    activity: string;
    taxCardID: string;
    taxRegistryNumber: string;
    nid: string;
    managerName: string;
    managerMobile: string;
    classificationId: string;
    email?: string;
    IsActive: boolean;
    CityName: string;
    GovernorateName: string;
    ClassificationName: string;
}
export class CompanyCreateViewModel {
    id: string;
    name: string;
    mobile: string;
    address: string;
    governorateId: string;
    cityId: string;
    activity: string;
    taxCardID: string;
    taxRegistryNumber: string;
    nid: string;
    managerName: string;
    managerMobile: string;
    classificationId: string;
    email?: string;
    numberOfPoints:number;
    amountOfMoney:number;
isActive:boolean;
}
export class CompanySearchViewModel {
    CityID: string;
    GovernorateID: string;
    CompanyName: string;
}
