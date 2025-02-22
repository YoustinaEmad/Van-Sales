import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './components/roles/roles.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ViewRoleDetailsComponent } from './components/view-role-details/view-role-details.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
  { path: '', component:RolesComponent }, 
  {path:'roleDetails/:id',component:ViewRoleDetailsComponent}
 
];

@NgModule({
  declarations: [
    RolesComponent,
    ViewRoleDetailsComponent
  ],
  imports: [
    CommonModule,
        DropdownModule,
        TableModule,
        SharedModule,
        ButtonModule,
        FormsModule,
        InputSwitchModule,

    TranslateModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)

  ]
})
export class RolesModule { }
