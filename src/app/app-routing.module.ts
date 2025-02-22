import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  
  {
    path: '',
    children: [
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/website/website.module').then(
            (m) => m.WebsiteModule
          ),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'sites', pathMatch: 'full' },
      {
        path: 'sites',
        loadChildren: () =>
          import('./features/sites/sites.module').then((m) => m.SitesModule),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'salesflow', pathMatch: 'full' },
      {
        path: 'salesflow',
        loadChildren: () =>
          import('./features/sales-flow/sales-flow.module').then(
            (m) => m.SalesFlowModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
