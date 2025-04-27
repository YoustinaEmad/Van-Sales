import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {  RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgControlComponent } from 'src/app/shared/components/ng-control/ng-control.component';
import { FormsModule } from '@angular/forms';


import { InputSwitchModule } from 'primeng/inputswitch';

const routes: Routes = [
  { path: '', component:HomeComponent }, 
 

];
@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    TableModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    
    RouterModule.forChild(routes)
  ]
})
export class CustomerGroupModule { }
