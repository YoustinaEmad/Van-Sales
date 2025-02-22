import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './Components/employee-profile/employee-profile.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProfileSettingComponent } from './Components/profile-setting/profile-setting.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { NotificationComponent } from './Components/notification/notification.component';

const routes: Routes = [
  { path: '', component: EmployeeProfileComponent },
  { path: 'profileSetting', component: ProfileSettingComponent }, 
   { path: 'changePassword', component: ChangePasswordComponent },  
   { path: 'notification', component: NotificationComponent },

];

@NgModule({
  declarations: [
    EmployeeProfileComponent,
    ProfileSettingComponent,
    ChangePasswordComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
      ButtonModule,
      FormsModule,
      SharedModule,
      DropdownModule,
      InputSwitchModule,
      RouterModule.forChild(routes)
  ]
})
export class EmployeeProfileModule { }
