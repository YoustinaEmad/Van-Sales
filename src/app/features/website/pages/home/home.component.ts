import { Component, OnInit } from '@angular/core';
import { CarOilComponent } from '../../components/car-oil/car-oil.component';
import { CarOilNdComponent } from '../../components/car-oil-nd/car-oil-nd.component';
import { CommonModule } from '@angular/common';
import { WebsiteService } from '../../services/website.service';
import { WishListProduct } from '../../models/product-cart';
import { CompanyViewModel, OrderViewModel } from '../../models/order.model';
import { CategoryEnum } from '../../models/enum/category';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, CarOilComponent, CarOilNdComponent],
})
export class HomeComponent implements OnInit {
  newProducts: OrderViewModel[] = [];
  bestSellerProducts: OrderViewModel[] = [];
  favoriteProducts: OrderViewModel[] = [];
  companies :CompanyViewModel[] = [];
  enviroment = environment

  newProductsLoading = true;
  bestSellerProductsLoading = true;
  favoriteProductsLoading = true;
  companiesLoading = true;

  constructor(public websiteService: WebsiteService) {}
  ngOnInit(): void {
    this.getNewProducts();
    this.getBestSellerProducts();
    this.getFavoriteProducts();
    this.getCompaniesOfProduct();
  }

  getNewProducts() {
    this.websiteService.getProductsByCategory(CategoryEnum.NewProducts).subscribe((res) => {
      if (res.isSuccess) {
        this.newProducts = res.data;
        this.newProductsLoading = false;
        this.newProducts.forEach((product) => {          
        product.quantity =  this.websiteService.productsInCart.find((x) => x.productId === product.id).quantity || 0;
        }  );
      }
    });
  }

  getBestSellerProducts() {
    this.websiteService.getProductsByCategory(CategoryEnum.BestSellerProducts).subscribe((res) => {
      if (res.isSuccess) {
        this.bestSellerProducts = res.data;
        this.bestSellerProductsLoading = false;
        this.bestSellerProducts.forEach((product) => {
          product.quantity =  this.websiteService.productsInCart.find((x) => x.productId === product.id).quantity || 0;
          }  );
      }
    });
  }

  getFavoriteProducts() {
    this.websiteService.getProductsByCategory(CategoryEnum.FavoriteProducts).subscribe((res) => {
      if (res.isSuccess) {
        this.favoriteProducts = res.data;
        this.favoriteProductsLoading = false;
        this.favoriteProducts.forEach((product) => {
          product.quantity =  this.websiteService.productsInCart.find((x) => x.productId === product.id).quantity || 0;
          }  );
      }
    });
  }

  getCompaniesOfProduct(){
    this.websiteService.getCompaniesOfProduct().subscribe((res) => {
      if (res.isSuccess) {
        this.companies = res.data;
        this.companiesLoading = false;
      }
    });
  }

}
