import { Injectable } from '@angular/core';
import { changePasswordViewModel, profileSettingViewModel } from '../Interface/profile';
import { ApiService } from 'src/app/shared/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

  constructor(private _apiService:ApiService) { }
   profileSetting(body :profileSettingViewModel)
   {
     return this._apiService.update(`/EditUserEndPoint/Put`, body);
   }

   getClientById(id :string)
   {
     return this._apiService.get(`/GetUserByIDEndPoint/GetUserById?ID=${id}`);
   }
   
   changePassword(body :changePasswordViewModel)
   {
     return this._apiService.update(`/ChangeUserPasswordEndPoint/ChangeUserPassword`, body);
   }
}
