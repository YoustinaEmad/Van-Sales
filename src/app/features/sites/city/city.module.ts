import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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
    DropdownModule,
    TableModule,
    SharedModule,
    ButtonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    InputSwitchModule

  ]
})
export class CityModule { }
