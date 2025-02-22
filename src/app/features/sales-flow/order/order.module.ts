import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import {  RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { OrderDetailsComponent } from './components/order-details/order-details.component';


const routes: Routes = [
  { path: '', component:HomeComponent }, 
  { path:'create', component: CreateComponent },
  { path:'edit/:id', component: CreateComponent },
  { path: 'details/:orderNumber', component: OrderDetailsComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    OrderDetailsComponent
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
    CalendarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule { }
