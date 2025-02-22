import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './component/email/email.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';


const routes: Routes = [
  { path: '', component: EmailComponent }, 
  { path: 'email', component: EmailComponent }, 


]
@NgModule({
  declarations: [
   EmailComponent 
  ],
  imports: [
    CommonModule, 
      
       SharedModule,
       FormsModule ,
       ReactiveFormsModule,
       ChipsModule,
       RouterModule.forChild(routes)
  ]
})
export class EmailModule { }
