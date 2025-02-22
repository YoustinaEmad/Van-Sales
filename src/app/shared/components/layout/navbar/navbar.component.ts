import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from 'src/app/features/website/services/website.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartVisible = false;
 
  constructor( public websiteService : WebsiteService ,private router :Router){}

  showCartDialog(event: Event) {
    event.preventDefault(); 
    this.cartVisible = true; 
  }

  getTotalPrice() {
    return this.websiteService.productsInCart.reduce((acc, x) => acc + (x.price * x.quantity), 0);
  }
  checkout(){
    this.router.navigate(['/checkoput'])
  }
}
