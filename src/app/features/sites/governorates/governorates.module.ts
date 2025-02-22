import { createComponent, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../governorates/components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },

];
@NgModule({
  declarations: [HomeComponent, CreateComponent],
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
export class GovernoratesModule { }
