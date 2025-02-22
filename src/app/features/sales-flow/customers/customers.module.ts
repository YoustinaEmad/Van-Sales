import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {  RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateComponent } from './components/create/create.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  { path: '', component:HomeComponent }, 
  { path:'create', component: CreateComponent },
  { path:'edit/:id', component: CreateComponent },
  { path:'changePassword/:id', component: ChangePasswordComponent },

];

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    ChangePasswordComponent
  ],
  imports: [
    
    CommonModule,
    ButtonModule,
    FormsModule,
    TableModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,    
    TranslateModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
   
  ]
})
export class CustomersModule { }
