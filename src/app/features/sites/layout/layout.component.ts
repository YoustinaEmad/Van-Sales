import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  constructor(public router: Router) {
    // اشتراك في التنقلات
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
      });

    // تعيين URL في البداية
    this.currentUrl = this.router.url;
  }

  openDropdown: string | null = null;
  isNavbarCollapsed = true;
  currentUrl: string = '';

  toggleDropdown(menu: string) {
    this.openDropdown = this.openDropdown === menu ? null : menu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown')) {
      this.openDropdown = null;
    }
  }

  closeDropdown() {
    this.openDropdown = null;
  }

  isLocationActive(): boolean {
    return this.currentUrl.includes('/sites/governorates') || this.currentUrl.includes('/sites/cities');
  }
  isItemsActive(): boolean {
    return this.currentUrl.includes('/sites/category') ||
      this.currentUrl.includes('/sites/product') ||
      this.currentUrl.includes('/sites/productGroup') ||
      this.currentUrl.includes('/sites/brand');
  }
  isSNOActive(): boolean {
    return this.currentUrl.includes('/sites/transfers') ||
      this.currentUrl.includes('/sites/transferSalesManToSalesMan') ||
      this.currentUrl.includes('/sites/transferWarehouseToSalesMan') 
  }

}
