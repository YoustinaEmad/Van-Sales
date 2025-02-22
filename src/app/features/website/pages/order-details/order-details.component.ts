import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarOilComponent } from "../../components/car-oil/car-oil.component";
import { SharedService } from 'src/app/shared/service/shared.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderSearchViewModel } from '../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, CarOilComponent, SharedModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent extends CrudIndexBaseUtils implements OnInit {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override searchViewModel: OrderSearchViewModel = new OrderSearchViewModel();
  constructor(

    public override _sharedService: SharedService,

  ) {
    super(_sharedService);
  }
  ngOnInit(): void {
    this.createSearchForm();
  }
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
  brandList = [
    { label: 'Shell', value: 'shell', count: 32 },
    { label: 'Mobil', value: 'mobil', count: 32 },
    { label: 'Motul', value: 'motul', count: 32 },
    { label: 'Liqui Moly', value: 'liquiMoly', count: 32 },
  ];
  override createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      FromDate: [this.searchViewModel.FromDate],
      ToDate: [this.searchViewModel.ToDate],
      Brand: this._sharedService.formBuilder.array([]),
    });
  }



}
