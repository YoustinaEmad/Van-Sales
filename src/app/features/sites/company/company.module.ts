import { createComponent, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import {  RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
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
    CommonModule,
    ButtonModule,
    FormsModule,
    TableModule,
    SharedModule,
    InputSwitchModule,
    DropdownModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
   
  ]
})
export class CompanyModule { }
