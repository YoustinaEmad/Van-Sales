import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/features/website/services/website.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  constructor(private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.getUserName();
    this.getProductsInCard();
    this.getWishListInCard()
  }


  getProductsInCard() {
    this.websiteService.getProductsInCard().subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.productsInCart = [...res.data.getAllProducts]
        this.websiteService.totalPrice = res.data.totalPrice
      }
    })
  }

  getWishListInCard() {
    this.websiteService.getWishListProducts().subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.wishListProduct = [...res.data]
      }
    })
  }

  getUserName() {
    this.websiteService.getUserInfo().subscribe((res) => {
      if (res.isSuccess) {
        this.websiteService.userInfo = res.data
        this.websiteService.userLoading = false
      }
    })
  }
}
