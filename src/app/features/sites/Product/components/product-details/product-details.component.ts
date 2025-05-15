import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { productCreateViewModel, productDetailsVM, productViewModel } from '../../interfaces/product';
import { ApiService } from 'src/app/shared/service/api.service';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
product: productDetailsVM | null = null;

  constructor(private route: ActivatedRoute, private _apiService: ApiService,private _ProductService:ProductService) {}
 Grades = [
    { id: 1, name: 'HighGrade ' },
    { id: 2, name: 'LowGrade ' },
  ];
  Units = [
    { id: 1, name: 'Cartoon  ' },
    { id: 2, name: 'Drum   ' },
    { id: 3, name: 'Pail   ' },
  ]
 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this._ProductService.getById(id).subscribe((res) => {
      this.product = res.data;
    });
  }
}



 getUnitName(unitId: number): string {
    const unit = this.Units.find(u => u.id === unitId);
    return unit ? unit.name.trim() : '';
  }

  getGradeName(gradeId: number): string {
    const grade = this.Grades.find(g => g.id === gradeId);
    return grade ? grade.name.trim() : '';
  }

}
