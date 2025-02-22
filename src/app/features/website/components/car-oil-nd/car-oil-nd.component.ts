import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderViewModel } from '../../models/order.model';
import { WebsiteService } from '../../services/website.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
// import { SeconCarOilsModel } from '../../models/order.model';

@Component({
  standalone: true,
  selector: 'app-car-oil-nd',
  templateUrl: './car-oil-nd.component.html',
  styleUrls: ['./car-oil-nd.component.css'],
  imports: [CommonModule, SharedModule],
})
export class CarOilNdComponent {
  @Input() oil: OrderViewModel;
  @Input() isLoading: boolean = false;
  enviroment = environment

  constructor(private websiteService: WebsiteService) { }

  addToWishList() {
    this.websiteService.addToWishList(this.oil.id).subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.wishListProduct.push({ id: this.oil.id, name: this.oil.productName, path: this.oil.path, price: this.oil.price })
      }
    })
  }

  RemoveFromCart() {
    this.websiteService.removeFromSellCart(this.oil.id).subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.productsInCart = this.websiteService.productsInCart.filter((x) => x.productId !== this.oil.id)
      }
    })
  }

  removeFromWishList() {
    this.websiteService.removeFromWishList(this.oil.id).subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.wishListProduct = this.websiteService.wishListProduct.filter((x) => x.id !== this.oil.id)
      }
    })
  }
  addToCart() {
    this.websiteService
      .addToSellCart(this.oil.id, this.oil.quantity)
      .subscribe((res) => {
        if (res.isSuccess) {
          this.oil.quantity = 1;
          this.websiteService.productsInCart.push({ productId: this.oil.id, quantity: this.oil.quantity, price: this.oil.price, path: this.oil.path, productName: this.oil.productName,productQuantity:this.oil.productQuantity });
        }
      });
  }

  updateQuantity(increment: boolean) {
    const newQuantity = increment ? this.oil.quantity + 1 : this.oil.quantity - 1;
    this.websiteService
      .addToSellCart(this.oil.id, newQuantity)
      .subscribe((res) => {
        if (res.isSuccess) {
          this.oil.quantity = newQuantity;
          const productInCart = this.websiteService.productsInCart.find(
            (x) => x.productId === this.oil.id
          );
          if (productInCart) {
            productInCart.quantity = newQuantity;
          }
        }
      });
  }

  increaseQuantity() {
    this.updateQuantity(true);
  }

  decreaseQuantity() {
    this.updateQuantity(false);
  }

  isProductInSellCart() {
    return (
      this.websiteService.productsInCart.filter(
        (x) => x.productId === this.oil.id
      ).length > 0
    );
  }
  isProductInWishList() {
    return (
      this.websiteService.wishListProduct.filter((x) => x.id === this.oil.id)
        .length > 0
    );
  }
}
