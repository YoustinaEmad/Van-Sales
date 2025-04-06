export interface productViewModel {
  id: string; 
  productName: string; 
  categoryName:string;
  categoryId :string;
  subcategoryName :string;
  price:number;
  quantity:number;
  imagePath:string;
  isActive:boolean;
  selected?: boolean; 
 isActivePoint:boolean;
}
export class productCreateViewModel {
  id: string;
  name: string;
  code:string;
  smallerUnitsOfMeasurements:number;
  wholesalePrice:number;
  retailPrice:number;
  vIPClientsPrice:number;
  numOfUnitPerCartoon:number;
  safetyStocks:number;
  packSize:number;
  netWeightPerLitre:number;
  weightPerKG:number;
  expiryDate:Date;
  unit:number;
  grade:number;
  productStatus:number;
  categoryID:string;
  productGroupID:string
  ProductAPI:string;

}
export class productSearchViewModel {
  ProductName:string;
  CategoryId: string;
  SubcategoryId:string;
  IsActive:boolean;
}

export class categorySelectedItem {
  id: string;
  name: string;
  selected:boolean;
}
export class subCategorySelectedItem {
  id: string;
  name: string;
  selected:boolean;
}
export class brandSelectedItem {
  id: string;
  name: string;
  selected:boolean;
}
export class categoryActivateViewModel{
  id:string;
}


export class reStockViewModel {
  productID:string;
  quantity:number;
}

export class productActivateViewModel{
  id:string;
}

export class pointActivateViewModel{
  id:string;
}