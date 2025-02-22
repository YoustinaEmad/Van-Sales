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
import { CreateComponent } from './components/create/create.component';

import { InputSwitchModule } from 'primeng/inputswitch';

const routes: Routes = [
  { path: '', component:HomeComponent }, 
  { path:'create', component: CreateComponent },
  { path:'edit/:id', component: CreateComponent },

];
@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent
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
