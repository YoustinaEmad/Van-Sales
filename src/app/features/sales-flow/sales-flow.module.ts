import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutComponent } from '../sites/layout/layout.component';

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'customers', pathMatch: 'full' },
    { path: "customergroup", loadChildren: () => import('./customer-group/customer-group.module').then(m => m.CustomerGroupModule) },
    { path: "customers", loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
    { path: "order", loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
    { path: "email", loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
    { path: "roles", loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },
  ]
}]

@NgModule({
  declarations: [


  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)

  ]
})
export class SalesFlowModule { }
