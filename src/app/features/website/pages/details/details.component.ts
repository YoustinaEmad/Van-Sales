import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { OrderViewModel } from '../../models/order.model';
import { CarOilComponent } from '../../components/car-oil/car-oil.component';
import { StarComponent } from 'src/app/shared/components/star/star.component';

@Component({
  standalone: true,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule, CarouselModule, CarOilComponent, StarComponent]
})
export class DetailsComponent {
  product: OrderViewModel;
  carOils = [
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1800',
      oldPrice: '1950 ',
      discount: '25% off',
      freeShipping: 'Free Shipping',
      fastShipping: 'Fast Shipping',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1200',
      oldPrice: '1400 ',
      discount: '15% off',
      freeShipping: 'Free Shipping',
      fastShipping: 'Fast Shipping',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1200',
      oldPrice: '1400 ',
      discount: '15% off',
      freeShipping: 'Free Shipping',
      fastShipping: 'Fast Shipping',
    },
    {
      image: '/assets/images/oil-bottle.svg',
      name: 'Hx8 5W-40 Fully Synthetic Motor Oil',
      currentPrice: ' 1200',
      oldPrice: '1400 ',
      discount: '15% off',
      freeShipping: 'Free Shipping',
      fastShipping: 'Fast Shipping',
    },


  ];
  limitedImages = [
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 1' },
    { image: '/assets/images/glossfinish.svg', name: 'Oil Bottle 2' },
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 3' },
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 4' },
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 4' },
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 4' },
    { image: '/assets/images/oil-bottle.svg', name: 'Oil Bottle 4' }

  ];

  selectedImage = this.limitedImages[0].image;

  onThumbnailClick(image: string): void {
    this.selectedImage = image;
  }
}
