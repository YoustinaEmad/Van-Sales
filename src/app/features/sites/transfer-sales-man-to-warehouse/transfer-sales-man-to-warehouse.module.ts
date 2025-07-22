import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarModule } from 'primeng/calendar';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent }

];


@NgModule({
  declarations: [
    HomeComponent,
    DetailsComponent,

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
export class TransferSalesManToWarehouseModule { }
