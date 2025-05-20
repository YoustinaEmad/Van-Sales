import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: HomeComponent },


];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    TranslateModule,
    RouterModule.forChild(routes)

  ]
})
export class DispatchModule { }

