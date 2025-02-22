import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './Components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { DetailsComponent } from './Components/details/details.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DetailsComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
       DropdownModule,
       TableModule,
       SharedModule,
       ButtonModule,
       FormsModule,
       ReactiveFormsModule,
       NgxPaginationModule,
       TranslateModule,
       InputSwitchModule,
       ChipsModule,
       CalendarModule,
       RouterModule.forChild(routes)
  ]
})
export class SignUpRequestModule { }
