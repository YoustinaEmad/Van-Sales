import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceDetailsViewModel } from '../../interface/invoice-view-model';
import { InvoiceService } from '../../service/invoice.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
invoice: InvoiceDetailsViewModel;
  translations: any = {};
id: string;
  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
     this.id = this.route.snapshot.paramMap.get('id');
    this.translate.get([
      'sites.Invoice.salesInvoice',
      'sites.Invoice.invoiceNumber',
      'sites.Invoice.client',
      'sites.Invoice.salesMan',
      'sites.Invoice.product',
      'sites.Invoice.unit',
      'sites.Invoice.quantity',
      'sites.Invoice.unitPrice',
      'sites.Invoice.total',
      'sites.Invoice.itemWeight',
      'sites.Invoice.totalWeight',
      'sites.Invoice.tax',
      'sites.Invoice.totalNetPrice'
    ]).subscribe(trans => {
      this.translations = trans;
    });

    if (this.id) {
      this.invoiceService.getById(this.id).subscribe(res => {
        if (res.isSuccess) {
          this.invoice = res.data;
        }
      });
    }
  }

  getUnitName(unitId: number): string {
    const units = [
      { id: 1, name: 'Cartoon' },
      { id: 2, name: 'Drum' },
      { id: 3, name: 'Pail' }
    ];
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.name : '';
  }



  printInvoice() {
  const printWindow = window.open('', '_blank');
  this.invoiceService.getById(this.id).subscribe({
    next: (res) => {
      if (res.isSuccess && res.data) {
        const invoice = res.data as InvoiceDetailsViewModel;
        const t = this.translations;

        const printContent = `
          <html lang="ar" dir="rtl">
            <head>
              <meta charset="UTF-8">
              <style>
                * {
                  box-sizing: border-box;
                  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                }
                body {
                  padding: 20px;
                  font-size: 14px;
                }
                h2 {
                  margin-bottom: 10px;
                }
                p {
                  margin: 2px 0;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  font-size: 13px;
                }
                th {
                  background-color: #972ccc;
                  color: white;
                }
                .totals td {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <h2>${t['sites.Invoice.salesInvoice']}</h2>
              <p><strong>${t['sites.Invoice.invoiceNumber']}:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>${t['sites.Invoice.client']}:</strong> ${invoice.clientName}</p>
              <p><strong>${t['sites.Invoice.salesMan']}:</strong> ${invoice.salesManName}</p>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>${t['sites.Invoice.product']}</th>
                    <th>${t['sites.Invoice.unit']}</th>
                    <th>${t['sites.Invoice.quantity']}</th>
                    <th>${t['sites.Invoice.unitPrice']}</th>
                    <th>${t['sites.Invoice.total']}</th>
                    <th>${t['sites.Invoice.itemWeight']}</th>
                    <th>${t['sites.Invoice.totalWeight']}</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.sellingInvoicesDetails.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.productName}</td>
                      <td>${this.getUnitName(item.unit)}</td>
                      <td>${item.quantity}</td>
                      <td>${(item.itemPrice ?? 0).toFixed(2)}</td>
                      <td>${(item.price ?? 0).toFixed(2)}</td>
                      <td>${(item.itemWeightPerKG ?? 0).toFixed(3)}</td>
                      <td>${(item.weightPerKG ?? 0).toFixed(3)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <table class="totals" style="margin-top: 30px;">
                <tr>
                  <td>${t['sites.Invoice.totalWeight']}</td>
                  <td>${(invoice.totalWeightInKG ?? 0).toFixed(2)} كجم</td>
                </tr>
                <tr>
                  <td>${t['sites.Invoice.total']}</td>
                  <td>${(invoice.totalPrice ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>${t['sites.Invoice.tax']} </td>
                  <td>14%</td>
                </tr>
                <tr>
                  <td>${t['sites.Invoice.totalNetPrice']}</td>
                  <td>${(invoice.totalNetPrice ?? 0).toFixed(2)}</td>
                </tr>
              </table>
            </body>
          </html>
        `;

        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    }
  });
}



 downloadInvoiceAsPDF() {
  this.invoiceService.getById(this.id).subscribe({
    next: (res) => {
      if (res.isSuccess && res.data) {
        const invoice = res.data as InvoiceDetailsViewModel;

        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        doc.setFontSize(16);
        doc.text('Sales Invoice', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 30);
        doc.text(`Client: ${invoice.clientName}`, 14, 38);
        doc.text(`Salesman: ${invoice.salesManName}`, 14, 46);

        const headers = [['#', 'Product', 'Unit', 'Quantity', 'Unit Price', 'Total', 'Item Weight', 'Total Weight']];
        const body = invoice.sellingInvoicesDetails.map((item, index) => [
          index + 1,
          item.productName || '',
          this.getUnitName(item.unit),
          item.quantity ?? 0,
          (item.itemPrice ?? 0).toFixed(2),
          (item.price ?? 0).toFixed(2),
          (item.itemWeightPerKG ?? 0).toFixed(3),
          (item.weightPerKG ?? 0).toFixed(3)
        ]);

        autoTable(doc, {
          head: headers,
          body: body,
          startY: 55,
          styles: {
            fontSize: 10,
            halign: 'center'
          },
          headStyles: {
            fillColor: [151, 44, 204],
            textColor: [255, 255, 255]
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 60;
        doc.setFontSize(12);
        doc.text(`Total Weight: ${(invoice.totalWeightInKG ?? 0).toFixed(2)} KG`, 14, finalY + 10);
        doc.text(`Total: ${(invoice.totalPrice ?? 0).toFixed(2)}`, 14, finalY + 18);
        doc.text(`Tax :14% `, 14, finalY + 26);
        doc.text(`Total Net Price: ${(invoice.totalNetPrice ?? 0).toFixed(2)}`, 14, finalY + 34);

        doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      } 
    },
   
  });
}

}
