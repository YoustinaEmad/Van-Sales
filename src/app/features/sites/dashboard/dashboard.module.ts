import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: '', component: DashboardComponent },
 

];
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
     RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
