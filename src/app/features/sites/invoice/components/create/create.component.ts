import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/service/shared.service';
import { InvoiceService } from '../../service/invoice.service';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { environment } from 'src/environments/environment';
import { InvoiceCreateViewModel, InvoiceDetailsViewModel } from '../../interface/invoice-view-model';
import { ControlType } from 'src/app/shared/models/enum/control-type.enum';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  page: CRUDCreatePage = new CRUDCreatePage();
  item: InvoiceCreateViewModel = new InvoiceCreateViewModel();
  itemDetails: InvoiceDetailsViewModel = new InvoiceDetailsViewModel();
  id: string = "5fe8a1ce-6ed5-49cd-a950-92f5bff0e10a"
  showPrintButton: boolean = false;
  environment = environment;
  showDownloadOptions = false;
  Units = [
    { id: 1, name: 'Cartoon  ' },
    { id: 2, name: 'Drum   ' },
    { id: 3, name: 'Pail   ' },
  ]
  controlType = ControlType;
  @ViewChild('downloadButton') downloadButton: ElementRef;
  @ViewChild('downloadOptions') downloadOptions: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.downloadOptions?.nativeElement.contains(event.target) ||
      this.downloadButton?.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showDownloadOptions = false;
    }
  }
  constructor(public _sharedService: SharedService,
    private _pageService: InvoiceService, private _router: Router, private activatedRoute: ActivatedRoute, private translate: TranslateService

  ) {
  }
  Clients: any[] = [];
  Products: any[] = [];
  selectedProducts: any[] = [];
  selectedProductId: string
  quantityErrors: string[] = [];
  total: number = 0;
  taxAmount: number = 0;
  netInvoice: number = 0;
  netWeight: number = 0;

  allProducts = [

  ];
  ngOnInit(): void {
    this.page.isPageLoaded = false;
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = params.get('id');
        this.page.isEdit = true;
      }
    });


    this.createForm();
    this.page.form.get('productID')?.valueChanges.subscribe(productId => {
      this.onProductSelect(productId);
    });

    this.loadClients();
    this.page.form.get('clientID')?.valueChanges.subscribe(() => {
      this.onClientChange();
    });
  }
  onProductSelect(productId: string | null) {
    if (!productId) return;
    const selected = this.allProducts.find(p => p.id === productId);
    if (selected && !this.selectedProducts.find(p => p.id === selected.id)) {
      this.selectedProducts.push({
        ...selected,
        quantity: 1,
        isEditing: false
      });
      this.calculateTotal();
    }

    this.selectedProductId = null;
    this.page.form.get('productID')?.setValue(null);
  }

  deleteProduct(index: number) {
    this.selectedProducts.splice(index, 1);
    this.calculateTotal();
  }



  createForm() {
    this.page.form = this._sharedService.formBuilder.group({
      clientID: [this.item.clientID, [Validators.required]],
      salesManID: [this.item.salesManID],
      notes: [this.item.notes],
      invoiceDetails: [this.item.invoiceDetails, Validators.required],
      productID: [null]
    });
    this.page.isPageLoaded = true;
  }

  getUnitName(unitId: number): string {
    const unit = this.Units.find(u => u.id === unitId);
    return unit ? unit.name.trim() : '';
  }


  Save() {
    this.page.isSaving = true;
    const salesManID = this.getSalesmanIdFromToken();
    const formValues = this.page.form.value;
    const invoiceDetails = this.selectedProducts.map(p => ({
      productId: p.id,
      itemWeightPerKG: p.weight,
      quantity: p.quantity,
      itemPrice: p.price
    }));
    const payload: InvoiceCreateViewModel = {
      id: this.item.id,
      clientID: formValues.clientID,
      salesManID: salesManID,
      notes: formValues.notes,
      invoiceDetails: invoiceDetails
    };
    this._pageService.postOrUpdate(payload).subscribe({
      next: (res) => {
        this.page.isSaving = false;
        this.page.responseViewModel = res;
        this._sharedService.showToastr(res);
        if (res.isSuccess) {
          // this.id = res.data?.sellingInvoiceId || this.id;
          this.showPrintButton = true;
          // this._router.navigate(['/sites/invoice']);
        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  loadClients() {
    this._pageService.getClients().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Clients = res.data || [];
      }
    });
  }

  loadProducts() {
    const clientID = this.page.form.get('clientID')?.value;
    const salesManID = this.getSalesmanIdFromToken();
    if (!clientID || !salesManID) return;

    const requestPayload = {
      SalesManID: salesManID,
      ClientID: clientID,
      StorageType: 2
    };

    this._pageService.getProducts(requestPayload).subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Products = res.data || [];
        this.allProducts = this.Products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.itemPrice,
          weight: p.itemWeightPerKG,
          maxQuantity: p.maxQuantity
        }));
      }
    });
  }

  //  printInvoice() {

  //   this._pageService.getById(this.id).subscribe({
  //     next: (res) => {
  //       if (res.isSuccess) {
  //         const printWindow = window.open('', '_blank');
  //         printWindow.document.write(res.data);
  //         printWindow.document.close();
  //         printWindow.print();
  //       }
  //     },

  //   });
  // }

  printInvoice() {
  this.translate.get([
    'sites.Invoice.salesInvoice',
    'sites.Invoice.invoiceNumber',
    'sites.Invoice.client',
    'sites.Invoice.salesMan',
    'sites.Invoice.index',
    'sites.Invoice.product',
    'sites.Invoice.unit',
    'sites.Invoice.quantity',
    'sites.Invoice.unitPrice',
    'sites.Invoice.total',
    'sites.Invoice.itemWeight',
    'sites.Invoice.totalWeight',
    'sites.Invoice.tax',
    'sites.Invoice.finalTotal',
    'sites.Invoice.totalWeightLabel'
  ]).subscribe(trans => {

    this._pageService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const invoice = res.data as InvoiceDetailsViewModel;

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
                  direction: rtl;
                  text-align: right;
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
              <h2>${trans['sites.Invoice.salesInvoice']}</h2>
              <p><strong>${trans['sites.Invoice.invoiceNumber']}:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>${trans['sites.Invoice.client']}:</strong> ${invoice.clientName}</p>
              <p><strong>${trans['sites.Invoice.salesMan']}:</strong> ${invoice.salesManName}</p>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th >${trans['sites.Invoice.product']}</th>
                    <th>${trans['sites.Invoice.unit']}</th>
                    <th>${trans['sites.Invoice.quantity']}</th>
                    <th>${trans['sites.Invoice.unitPrice']}</th>
                    <th>${trans['sites.Invoice.total']}</th>
                    <th>${trans['sites.Invoice.itemWeight']}</th>
                    <th>${trans['sites.Invoice.totalWeight']}</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.sellingInvoicesDetails.map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.productName}</td>
                      <td>${this.getUnitName(item.unit)}</td>
                      <td>${item.quantity}</td>
                      <td>${item.itemPrice.toFixed(2)}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.itemWeightPerKG.toFixed(3)}</td>
                      <td>${item.weightPerKG.toFixed(3)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <table class="totals" style="margin-top: 30px;">
                <tr>
                  <td>${trans['sites.Invoice.totalWeight']}</td>
                  <td>${invoice.totalWeightInKG.toFixed(2)} كجم</td>
                </tr>
                <tr>
                  <td>${trans['sites.Invoice.total']}</td>
                  <td>${invoice.totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>${trans['sites.Invoice.tax']} (14%)</td>
                  <td>${invoice.taxAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>${trans['sites.Invoice.finalTotal']}</td>
                  <td>${invoice.totalNetPrice.toFixed(2)}</td>
                </tr>
              </table>
            </body>
          </html>
        `;

          const printWindow = window.open();
          if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(printContent);
            printWindow.document.close();

            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }
        }
      }
    });

  });
}


  downloadInvoiceAsPDF() {
    this._pageService.getById(this.id).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          const invoice = res.data as InvoiceDetailsViewModel;

          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });


          doc.setFontSize(16);
          doc.text(`Sales invoice`, 105, 15, { align: 'center' });


          doc.setFontSize(12);
          doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 14, 30);
          doc.text(`Client: ${invoice.clientName}`, 14, 38);
          doc.text(`Salesman: ${invoice.salesManName}`, 14, 46);

          const headers = [['#', 'Product', 'Unit', 'Quantity', 'Unit Price', 'Total', 'Item Weight', 'Total Weight']];
          const body = invoice.sellingInvoicesDetails.map((item, index) => [
            index + 1,
            item.productName,
            this.getUnitName(item.unit),
            item.quantity,
            item.itemPrice.toFixed(2),
            item.price.toFixed(2),
            item.itemWeightPerKG.toFixed(3),
            item.weightPerKG.toFixed(3)
          ]);

          autoTable(doc, {
            head: headers,
            body: body,
            startY: 55,
            styles: {
              fontSize: 10,
              halign: 'center',
              fontStyle: 'normal'
            },
            headStyles: {
             fillColor: [151, 44, 204],
              textColor: [255, 255, 255],
              fontSize: 11,
              fontStyle: 'bold',
              halign: 'center',
              valign: 'middle',
            },
            alternateRowStyles: {
              fillColor: [240, 248, 255]
            },
            columnStyles: {
              0: { cellWidth: 10 },
              1: { cellWidth: 40 },
              2: { cellWidth: 20 },
              3: { cellWidth: 20 },
              4: { cellWidth: 25 },
              5: { cellWidth: 25 },
              6: { cellWidth: 25 },
              7: { cellWidth: 25 },
            },
          });


          // الإجماليات
          let finalY = (doc as any).lastAutoTable.finalY || 60;
          doc.setFontSize(12);
          doc.text(`Total Weight: ${invoice.totalWeightInKG.toFixed(2)} KG`, 14, finalY + 10);
          doc.text(`Total: ${invoice.totalPrice.toFixed(2)}`, 14, finalY + 18);
          doc.text(`Tax (14%): ${invoice.taxAmount.toFixed(2)}`, 14, finalY + 26);
          doc.text(`Final Total: ${invoice.totalNetPrice.toFixed(2)}`, 14, finalY + 34);

          // حفظ الملف
          doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
        }
      }
    });
  }

  onClientChange() {
    this.loadProducts();
  }

  getSalesmanIdFromToken(): string | null {
    const token = localStorage.getItem('eToken');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.ID || null;
  }


  toggleEdit(index: number) {
    const item = this.selectedProducts[index];

    this.quantityErrors[index] = '';
    if (item.isEditing === true) {
      if (item.quantity > item.maxQuantity) {
        this.quantityErrors[index] = `Maximum allowed is ${item.maxQuantity}`;
        return;
      }
    }

    item.isEditing = !item.isEditing;

    if (!item.isEditing) {
      this.calculateTotal();
    }
  }



  calculateTotal() {
    this.total = this.selectedProducts.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    this.taxAmount = (this.total * 0.14);
    this.netInvoice = this.total + this.taxAmount;
    this.netWeight = this.selectedProducts.reduce((sum, item) => {
      return sum + (item.weight * item.quantity);
    }, 0);
  }

  onCancel() {
    this.page.form.reset();
    this.selectedProducts = [];
    this.quantityErrors = [];
    this.total = 0;
    this.taxAmount = 0;
    this.netInvoice = 0;
    this.netWeight = 0;
  }

  onQuantityChange(index: number) {
    const item = this.selectedProducts[index];

    if (item.quantity < 1 || !item.quantity) {
      item.quantity = 1;
    }

    if (item.quantity > item.maxQuantity) {
      item.quantity = item.maxQuantity;
      this.quantityErrors[index] = this.translate.instant('sites.Invoice.maxQuantityError', {
        max: item.maxQuantity
      });
    } else {
      this.quantityErrors[index] = '';
    }

    this.calculateTotal();
  }




  toggleDownloadOptions() {
    this.showDownloadOptions = !this.showDownloadOptions;
  }

}
