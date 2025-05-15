export interface productViewModel {
  id: string; 
  name: string; 
  code:string;
  smallerUnitsOfMeasurements:number;
  wholesalePrice:number;
  retailPrice:number;
  vipClientsPrice:number
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
  brandName:string;
}
export class productCreateViewModel {
  id: string;
  name: string;
  code:string;
  smallerUnitsOfMeasurements:number;
  wholesalePrice:number;
  retailPrice:number;
  vipClientsPrice:number;
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
  productAPI:string;
 brandID:string;
}
export class productSearchViewModel {
  Name:string;
  Code:string;
  CategoryId: string;
  ProductStatus:string;
  Grade:string;
  Unit:string;
  IsActive:boolean;
  BrandID:string;
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


export class productDetailsVM {
   id: string;
  name: string;
  code:string;
  smallerUnitsOfMeasurements:number;
  wholesalePrice:number;
  retailPrice:number;
  vipClientsPrice:number;
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
  categoryName:string;
  productGroupID:string;
  productGroupName:string;
  productAPI:string;
  isActive:boolean;
 brandID:string;
 brandName:string;
 totalWeight:number;
  totalQuantity :number;
  warehouses:ProductWarehouseDetailesVM [];
}

export class ProductWarehouseDetailesVM {
  warehouseId :string;
  warehouseName :string;
  quantity :number;
  weight:number; 
}