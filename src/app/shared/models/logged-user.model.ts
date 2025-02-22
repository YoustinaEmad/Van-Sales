  export class UserPagesViewModel {
  ID!: number;
  ModuleID?: number;
  ParentPageID?: number;
  Name?: string;
  NameArabic?: string;
  NameEnglish?: string;
  ModuleName?: string;
  DisplayOrder?: number;
  Icon!: string;
  Url!: string;
  IsActive?: boolean;
  ShowInMenu?: boolean;
  IsImage?: boolean;
  Children ?: UserPagesViewModel[]=[];
}

