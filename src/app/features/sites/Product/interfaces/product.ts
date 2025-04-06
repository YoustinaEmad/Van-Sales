export interface productViewModel {
  id: string; 
  name: string; 
  code:string;
  smallerUnitsOfMeasurements:number;
  wholesalePrice:number;
  retailPrice:number;
  vIPClientsPrice:number
  numOfUnitPerCartoon:number;
  safetyStocks:number;
  packSize:number;
  netWeightPerLitre:number;
  weightPerKG:number
  expiryDate:Date;
  unit:number;
  grade:number
  productStatus:number;
  categoryID:string;
  categoryName:string;
  productGroupID:string;
  productGroupName:string;
  productAPI:string;
  isActive:boolean;
  selected:boolean;
}
export class productCreateViewModel {
  id: string;
  name: string;
  description:string;
  categoryId:string;
  tags:string[];
  price:number;
  tax:number;
  model:string;
  brandId:string;
  minimumQuantity:number;
  maximumQuantity:number;
  length:number;
  width:number;
  height:number;
  liter:number
  availableDate:string;
  paths?:string[];
  specificationMetrix:string;
  data:string;
  featuredProduct:boolean;
  quantity:number;
  numberOfPoints:number;
  isActive:boolean ;
  isActivePoint:boolean;
}
export class productSearchViewModel {
  ProductName:string;
  Code:string;
  CategoryId: string;
  ProductStatus:string;
  Grade:string;
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