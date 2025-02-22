import { Component } from '@angular/core';
import { orderHistoryViewModel } from '../../../models/order.model';
import { WebsiteService } from '../../../services/website.service';
import { ApiService } from 'src/app/shared/service/api.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  invoices: orderHistoryViewModel[] = [];

  constructor(private _WebsiteService: WebsiteService,
    private _ApiService:ApiService
  ) {}
  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this._WebsiteService.getOrderHistory().subscribe({
      next: (res) => {
        this.invoices = res.data.items;
       
      },
      error: (err) => {
        console.error('Failed to fetch order history:', err);
      },
    });
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
