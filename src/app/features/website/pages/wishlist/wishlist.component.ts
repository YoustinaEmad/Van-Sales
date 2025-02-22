import { Component, Input, OnInit } from '@angular/core';
import { CarOilComponent } from '../../components/car-oil/car-oil.component';
import { CommonModule } from '@angular/common';
import { WebsiteService } from '../../services/website.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  imports: [CommonModule, CarOilComponent,SharedModule]
})
export class WishlistComponent implements OnInit {
  constructor(public websiteService: WebsiteService) { }
  ngOnInit(): void {
  
    
    this.websiteService.wishListProduct.forEach((product) => {
      product.quantity = this.websiteService.productsInCart.find((x) => x.productId === product.id).quantity || 0;
    });
  }
}
