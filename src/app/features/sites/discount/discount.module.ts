import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../discount/components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },

];

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    
  ],
  imports: [
    CommonModule,

    ButtonModule,
    FormsModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    CalendarModule,
    RouterModule.forChild(routes)

  ]
})
export class DiscountModule { }
