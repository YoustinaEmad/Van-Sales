import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { productCreateViewModel, productViewModel } from '../../interfaces/product';
import { ApiService } from 'src/app/shared/service/api.service';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
product: productCreateViewModel | null = null;

  constructor(private route: ActivatedRoute, private _apiService: ApiService,private _ProductService:ProductService) {}

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this._ProductService.getById(id).subscribe((res) => {
      this.product = res.data;
    });
  }
}

}
