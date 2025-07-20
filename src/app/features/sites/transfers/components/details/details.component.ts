import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../../service/transfer.service';
import { transferCreateViewModel } from '../../interface/transfer';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
item: transferCreateViewModel;
  isLoading = true;
 WarehouseToWarehouseStatuslist = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'InProcess' },
    { id: 3, name: 'Delivered' },
    { id: 4, name: 'SalesManReject ' },
    { id: 5, name: 'WarehouseReject' }
  ];
  StorageType = [
    { id: 1, name: 'Transaction' },
    { id: 2, name: 'selling' },
  ]
  constructor(private route: ActivatedRoute, private _TransferService: TransferService , private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTransactionDetails(id);
    }
  }

  getTransactionDetails(id: string): void {
    this._TransferService.getById(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.item = res.data;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading details:', err);
      }
    });
  }

   getStatusName(statusId: number): string {
    const status = this.WarehouseToWarehouseStatuslist.find(s => s.id === statusId);
    return status ? status.name.trim() : '';
  }
   getStorageTypeName(storageTypeId: number): string {
    const storageType = this.StorageType.find(s => s.id === storageTypeId);
    return storageType ? storageType.name.trim() : '';
  }


  goToProductDetails(productId: string) {
  this.router.navigate(['/sites/product/details', productId]);
}
}
