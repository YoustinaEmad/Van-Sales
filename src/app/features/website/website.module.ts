import { createComponent, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { CarOilNdComponent } from './components/car-oil-nd/car-oil-nd.component';
import { CarOilComponent } from './components/car-oil/car-oil.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { DetailsComponent } from './pages/details/details.component';
import { CartCardComponent } from './components/cart-card/cart-card.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoputComponent } from './pages/checkoput/checkoput.component';
import { ProfileComponent } from './pages/profileComponents/profile/profile.component';
import { ProfileSettingComponent } from './pages/profileComponents/profile-setting/profile-setting.component';
import { OrderHistoryComponent } from './pages/profileComponents/order-history/order-history.component';
import { TransactionHistoryComponent } from './pages/profileComponents/transaction-history/transaction-history.component';
import { NotificationComponent } from './pages/profileComponents/notification/notification.component';
import { InvoicesComponent } from './pages/profileComponents/invoices/invoices.component';
import { AddressComponent } from './pages/profileComponents/address/address.component';
import { ChangePasswordComponent } from './pages/profileComponents/change-password/change-password.component';
import { NewAddressComponent } from './pages/profileComponents/new-address/new-address.component';
import { OrderHistoryDetailsComponent } from './pages/profileComponents/order-history-details/order-history-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  {path: 'details', component: DetailsComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'checkoput', component: CheckoputComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profileSetting', component: ProfileSettingComponent},
  {path: 'changePassword', component: ChangePasswordComponent},
  {path: 'orderHistory', component: OrderHistoryComponent},
  {path: 'transactionHistory', component: TransactionHistoryComponent},
  {path: 'notification', component: NotificationComponent},
  {path: 'address', component: AddressComponent},
  {path: 'invoices', component: InvoicesComponent},
  {path: 'newAddress', component: NewAddressComponent},
  {path: 'orderHistoryDetails/:orderNumber', component: OrderHistoryDetailsComponent},
];
@NgModule({
  declarations: [
  
    ProfileComponent,
       ProfileSettingComponent,
       OrderHistoryComponent,
       TransactionHistoryComponent,
       NotificationComponent,
       InvoicesComponent,
       AddressComponent,
       ChangePasswordComponent,
       NewAddressComponent,
       OrderHistoryDetailsComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    SharedModule,
    DropdownModule,
    RouterModule.forChild(routes),
    HomeComponent,
    CarOilComponent,
    CarOilNdComponent,
    ConfirmationComponent,
    CartCardComponent,
    WishlistComponent,
    CheckoputComponent,
  ]

})
export class WebsiteModule { }
