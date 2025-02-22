import { orderDetailsViewModel } from '../../interface/order';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/shared/service/shared.service';
import { OrderService } from '../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/salesflow/order/details';
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
    public override _sharedService: SharedService,
    private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _OrderService: OrderService

  ) {
    super(_sharedService);

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
    const orderNumber = this._activatedRoute.snapshot.paramMap.get('orderNumber'); // Ensure lowercase here
    if (!orderNumber) {
      this.errorMessage = 'Order number not provided';
      this.isLoading = false;
      return;
    }

    this._OrderService.getByOrderNumber(orderNumber).subscribe({
      next: (res) => {
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

  editOrder() {
    this._router.navigate(['/salesflow/order/edit', this.orderId]);
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
      window.location.reload(); // Reload the page to restore original content
    }
  }

}
