export class ColumnViewModel {
  Name: string = "";
  Title: string = "";
  Sortable: boolean = false;
  Selectable: boolean = false;
  IsHidden?: boolean ;
  Annotation?:string;
  constructor(name, title, sortable, selectable, isHidden) {
    this.Name = name;
    this.Title = title;
    this.Sortable = sortable;
    this.Selectable = selectable;
    this.IsHidden = isHidden 
  }
}