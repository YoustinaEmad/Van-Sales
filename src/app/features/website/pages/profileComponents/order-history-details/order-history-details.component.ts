
import { ChangeDetectorRef, Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { OrderService } from 'src/app/features/sales-flow/order/service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { orderDetailsViewModel } from '../../../models/order.model';
import { WebsiteService } from '../../../services/website.service';
@Component({
  selector: 'app-order-history-details',
  templateUrl: './order-history-details.component.html',
  styleUrls: ['./order-history-details.component.css']
})
export class OrderHistoryDetailsComponent {
page: CRUDIndexPage = new CRUDIndexPage();
  orderDetails: orderDetailsViewModel;
  isLoading = true;
  modalRef: BsModalRef;
  orderNumber: string;
  errorMessage: string;
  orderStatuslist = [
    { id: 1, name: 'InProcess' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Cancelled' },
    {id:4,name:'Completed'}, 
  ];
  orderId:string;
  constructor(
    public _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
   private _WebsiteService: WebsiteService

  ) {
   

  }


  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
    
      if (params.has('orderNumber')) {
        this.orderNumber = params.get('orderNumber');
      }
    });
    this.loadOrderDetails();

  }

  loadOrderDetails(): void {
    const orderNumber = this._activatedRoute.snapshot.paramMap.get('orderNumber'); 
    if (!orderNumber) {
      this.errorMessage = 'Order number not provided';
      this.isLoading = false;
      return;
    }

    this._WebsiteService.getByOrderNumber(orderNumber).subscribe({
      next: (res) => {
        console.log(res)
        this.orderId=res.data.orderId;   
        this.orderDetails = res.data;
       
        this.isLoading = false;
      },
      error: (err) => {
        this._sharedService.showToastr(err);
        this.isLoading = false;
      },
    });
  }

  getOrderStatusName(statusId: number): string {
    const status = this.orderStatuslist.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }
  numberOnly(event: any) {
    return this._sharedService.numberOnly(event);
  }
  
  getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
  }
  Print() {
    const originalContent = document.body.innerHTML;
    const printContent = document.getElementById('print-section')?.innerHTML;
  
    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); 
    }
  }

  getStatusStyle(status: number): { [key: string]: string } {
    switch (status) {
      case 1: return { color: '#12B76A' }; 
      case 2: return { color: '#F79009' }; 
      case 3: return { color: '#F04438' }; 
      default: return { color: '#6c757d' }; 
    }
  }
  getTotalQuantity(): number {
    return this.orderDetails?.orderItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  }
  onCancel(): void {
    this._router.navigate(['/orderHistory']);
  }

  reOrder(orderId: string): void {
    this._WebsiteService.reOrder(orderId)
      .subscribe(
        (response) => {
         this._sharedService.showToastr(response);
        },
        (error) => {
          this._sharedService.showToastr(error);
        }
      );
  }
}
