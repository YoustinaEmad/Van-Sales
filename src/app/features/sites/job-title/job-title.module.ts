import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
  { path:'changePassword/:id', component: ChangePasswordComponent },

];

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    RouterModule.forChild(routes)

  ]
})
export class JobTitleModule { }
