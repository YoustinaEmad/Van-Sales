import { UntypedFormGroup } from "@angular/forms";
//quik
export class SaveFilterationViewModel {
    pageRoute!: string;
    searchForm!: UntypedFormGroup;
    orderBy?: string = "ID";
    isAscending?: boolean = false;
    pageSize?: number = 50
    currentPage?: number = 1
}