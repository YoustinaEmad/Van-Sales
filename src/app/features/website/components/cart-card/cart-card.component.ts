import { Component, Input } from '@angular/core';
import { OrderViewModel } from '../../models/order.model';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../services/website.service';
import { ProductCartViewModel } from '../../models/product-cart';

@Component({
  standalone: true,
  selector: 'app-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.css']
})
export class CartCardComponent {
  @Input() isLoading: boolean = false;  // This should be initialized to either true or false

  @Input() oil: ProductCartViewModel;
  enviroment = environment
constructor(private websiteService:WebsiteService ){}
  RemoveFromCart() {
    console.log(this.oil);
    
    this.websiteService.removeFromSellCart(this.oil.productId).subscribe((res) => {
      if (res.isSuccess) {
        console.log(res)
        this.websiteService.productsInCart = this.websiteService.productsInCart.filter((x) => x.productId !== this.oil.productId)
      }
    })
  }
  decreaseQuantity() {
    this.updateQuantity(false);
  }
  updateQuantity(increment: boolean) {
    const newQuantity = increment ? this.oil.quantity + 1 : this.oil.quantity - 1;
  
    // Ensure the quantity isn't zero or negative
    if (newQuantity <= 0) {
      console.error('Invalid quantity');
      return;
    }
  
    this.websiteService.addToSellCart(this.oil.productId, newQuantity).subscribe((res) => {
      if (res.isSuccess) {
        this.oil.quantity = newQuantity;
        const productInCart = this.websiteService.productsInCart.find((x) => x.productId === this.oil.productId);
        if (productInCart) {
          productInCart.quantity = newQuantity;
        }
      } else {
        console.error('Failed to update quantity');
      }
    });
  }
  

  increaseQuantity() {
    this.updateQuantity(true);
  }
  isProductInSellCart() {
    return this.websiteService.productsInCart.filter((x) => x.productId === this.oil.productId).length > 0;
  }
  
  
}
