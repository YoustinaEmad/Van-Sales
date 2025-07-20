import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { salesManToSalesManCreateViewNodel } from '../../interface/transfer-sales-man-to-sales-man';
import { TransfersWarehouseToWarehouseServiceService } from '../../service/transfers-warehouse-to-warehouse-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{
item: salesManToSalesManCreateViewNodel;
  isLoading = true;
 TransactionStatus = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Approve' },
    { id: 3, name: 'Reject' },
  ]
  StorageType = [
    { id: 1, name: 'Transaction' },
    { id: 2, name: 'selling' },
  ]
  constructor(private route: ActivatedRoute, private _TransfersWarehouseToWarehouseServiceService: TransfersWarehouseToWarehouseServiceService,private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTransactionDetails(id);
    }
  }

  getTransactionDetails(id: string): void {
    this._TransfersWarehouseToWarehouseServiceService.getById(id).subscribe({
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
    const status = this.TransactionStatus.find(s => s.id === statusId);
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
