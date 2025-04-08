import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { HomeComponent } from '../product-group/Components/home/home.component';
import { CreateComponent } from '../product-group/Components/create/create.component';

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
     ReactiveFormsModule,
     NgxPaginationModule,
     TranslateModule,
     InputSwitchModule,
     ChipsModule,
     CalendarModule,
     RouterModule.forChild(routes)
   ]
})
export class ProductGroupModule { }
