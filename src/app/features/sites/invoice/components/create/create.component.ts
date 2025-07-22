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
  id: string;
  translations: any = {};
  showPrintButton: boolean = false;
  environment = environment;
  hideActionButtons: boolean = false;
  showDownloadOptions = false;
  Brands: any[] = [];

  Units = [
    { id: 1, name: 'Cartoon  ' },
    { id: 2, name: 'Drum   ' },
    { id: 3, name: 'Pail   ' },
  ]
  SellingUnit = [
    { id: 1, name: 'Cartoon' },
    { id: 2, name: 'Piece' },
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
  selectedProductUnit: number | null = null;

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
        'sites.Invoice.totalNetPrice',
        'sites.Invoice.totalWeightLabel'
      ]).subscribe(trans => {
        this.translations = trans;
      });
    });

    this._pageService.getbrands().subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Brands = res.data || [];
      }
    });

    this.createForm();
    this.page.form.get('brandID')?.valueChanges.subscribe((brandID) => {
      if (brandID) {
        this.loadProductsByBrand(brandID);
      } else {
        this.loadProducts();
      }
    });



    this.page.form.get('productID')?.valueChanges.subscribe(productId => {
      this.onProductSelect(productId);
    });

    this.loadClients();
    this.page.form.get('clientID')?.valueChanges.subscribe(() => {
      this.onClientChange();
    });
  }


  loadProductsByBrand(brandID: string) {
    const clientID = this.page.form.get('clientID')?.value;
    const salesManID = this.getSalesmanIdFromToken();

    if (!clientID) {
      //this._sharedService.showToastrError('اختر العميل أولا قبل تحديد البراند');
      this.page.form.get('brandID')?.setValue(null);
      return;
    }

    const payload = {
      SalesManID: salesManID,
      ClientID: clientID,
      StorageType: 2,
      BrandID: brandID
    };

    this._pageService.getProducts(payload).subscribe((res: any) => {
      if (res && res.isSuccess) {
        this.Products = res.data || [];
        this.allProducts = this.Products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.itemPrice,
          weight: p.itemWeightPerKG, // الوزن الإجمالي
          netWeight: p.itemNetWeightPerKG, // ✅ الوزن الصافي الفعلي من الـ API
          maxQuantity: p.maxQuantity,
          unit: p.unit,
          numOfUnitPerCartoon: p.numOfUnitPerCartoon
        }));


      }
    });
  }

  onProductSelect(productId: string | null) {
    if (!productId) return;
    const selected = this.allProducts.find(p => p.id === productId);
    if (selected) {
      this.selectedProductUnit = selected.unit; // 💡 خزّن الـ unit هنا
    } else {
      this.selectedProductUnit = null;
    }
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
      productID: [null],
      brandID: [null],
      sellingUnitId: [null] // ✅ حقل جديد للوحدة الفرعية

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

    const invoiceDetails = this.selectedProducts.map(p => {
      const { itemWeightPerKG, itemNetWeightPerKG } = this.calculateAdjustedWeights(p);

      return {
        productId: p.id,
        itemWeightPerKG: Number(itemWeightPerKG),
        quantity: p.quantity,
        itemPrice: Number(p.price),
        itemNetWeightPerKG: Number(itemNetWeightPerKG),
        sellingUnit: p.sellingUnitId
      };
    });


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
          this.id = res.data?.sellingInvoiceId || this.id;
          this.showPrintButton = true;

          this.page.form.reset();
          this.selectedProducts = [];
          this.total = 0;
          this.taxAmount = 0;
          this.netInvoice = 0;
          this.netWeight = 0;
          this.hideActionButtons = true;

        }
      },
      error: () => {
        this.page.isSaving = false;
      },
    });
  }

  calculateNetWeightPerKG(item: any): number {
    return item.weight * item.quantity; // لو دي هي المعادلة
  }
  calculateAdjustedWeights(p: any) {
    let itemWeightPerKG = p.weight;
    let itemNetWeightPerKG = p.netWeight; // الوزن الصافي الأصلي

    if (p.sellingUnitId === 1) {
      itemWeightPerKG = itemWeightPerKG * p.numOfUnitPerCartoon;
      itemNetWeightPerKG = itemNetWeightPerKG * p.numOfUnitPerCartoon;
    }

    return {
      itemWeightPerKG,
      itemNetWeightPerKG
    };
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
          weight: p.itemWeightPerKG, // الوزن الإجمالي
          netWeight: p.itemNetWeightPerKG, // ✅ الوزن الصافي الفعلي من الـ API
          maxQuantity: p.maxQuantity,
          unit: p.unit,
          numOfUnitPerCartoon: p.numOfUnitPerCartoon
        }));

      }
    });
  }

  printInvoice() {
    const printWindow = window.open('', '_blank');
    this._pageService.getById(this.id).subscribe({
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
      const { itemNetWeightPerKG } = this.calculateAdjustedWeights(item);
      return sum + (itemNetWeightPerKG * item.quantity);
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
  addProduct() {
    const productId = this.page.form.get('productID')?.value;
    const sellingUnitId = this.page.form.get('sellingUnitId')?.value;

    if (!productId) return;

    const selected = this.allProducts.find(p => p.id === productId);
    if (selected && !this.selectedProducts.find(p => p.id === selected.id)) {
      this.selectedProducts.push({
        ...selected,
        sellingUnitId: selected.unit === 1 ? sellingUnitId : null, 
        quantity: 1,
        isEditing: false,
        numOfUnitPerCartoon: selected.numOfUnitPerCartoon 

      });
      this.calculateTotal();
    }

    this.page.form.patchValue({
      productID: null,
      sellingUnitId: null
    });
    this.selectedProductUnit = null;
  }

  getSellingName(unitId: number): string {
    const unit = this.SellingUnit.find(u => u.id === unitId);
    return unit ? unit.name.trim() : '';
  }
  

}
