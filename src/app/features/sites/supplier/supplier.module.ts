import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './components/create/create.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },

];

@NgModule({
  declarations: [
    CreateComponent,
    HomeComponent
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
export class SupplierModule { }
