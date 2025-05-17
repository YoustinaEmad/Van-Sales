import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
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
         InputSwitchModule,
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
export class TrasferWarehouseToSalesManModule { }
