export interface categoryViewModel {
  id: string;
  name: string;
  parentCategoryId?: string;
  productCount: number;
  subcategoryCount: number;
  isActive: boolean;
  imagePath: string;
  selected?:boolean;
}

export class categoryCreateViewModel {
  id:string;
  name: string;
  description: string;
  parentCategoryId?: string;  // optional field
  tags: string[];
  seo: string[];
  paths: string[];
  isActive:boolean = false;
}

export class categorySearchViewModel {
  CategoryId?: string;
  SubCategoryId?: string;
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
export class categoryActivateViewModel{
  id:string;
}