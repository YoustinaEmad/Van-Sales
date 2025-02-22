import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule,Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
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
export class ProductModule { }
