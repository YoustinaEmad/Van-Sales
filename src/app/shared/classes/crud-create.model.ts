import { UntypedFormGroup } from '@angular/forms';
import { ResponseViewModel } from '../models/response.model';
import { ControlType } from '../models/enum/control-type.enum';

export class CRUDCreatePage{
    form: UntypedFormGroup;
    isSerching: boolean = false;
    isUploading: boolean = false;
    isEdit: boolean = false;
    isSaving: boolean = false;
    isDeleting: boolean = false;
    responseViewModel: ResponseViewModel;
    isPageLoaded: boolean = false;
    ControlType=ControlType
    subscriptions:any[]=[]
}
