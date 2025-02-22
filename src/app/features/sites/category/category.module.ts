import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';
 import { InputSwitchModule } from 'primeng/inputswitch';
 import { ChipsModule } from 'primeng/chips';



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
    NgxPaginationModule,
    TranslateModule,
    InputSwitchModule,
    ChipsModule

  ]
})
export class CategoryModule { }
