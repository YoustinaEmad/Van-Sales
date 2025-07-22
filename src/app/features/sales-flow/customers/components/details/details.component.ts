import { Component } from '@angular/core';
import { CRUDCreatePage } from 'src/app/shared/classes/crud-create.model';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { customerDetailsViewModel } from '../../interfaces/customers';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/service/api.service';
import { CustomersService } from '../../service/customers.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent extends CrudIndexBaseUtils {
 override page: CRUDIndexPage = new CRUDIndexPage();
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  customer: customerDetailsViewModel | null = null;
  isLoading = true;
  id: string = '';
 
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];

   ClientType = [
    { id: 1, name: 'Retail' },
    { id: 2, name: 'Wholesale' },
    { id: 3, name: 'VIPClients' }
  ];

  Religion=[
     { id: 1, name: 'Islam ' },
    { id: 2, name: 'Christianity' },
  ]
  constructor(
    public override _sharedService: SharedService,
    private route: ActivatedRoute,
    private api: ApiService,
    private _CustomersService: CustomersService,
    private _router: Router
  ) {
    super(_sharedService);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getWarehouseDetails(this.id);
    }
  }

  getWarehouseDetails(ID: string) {
    this._CustomersService.getById(ID).subscribe((res) => {
      this.customer = res.data;
      this.isLoading = false;
    });
  }


    getgenderOptionsName(id: number): string {
    const genderOptions = this.genderOptions.find(type => type.id === id);
    return genderOptions ? genderOptions.name : 'Unknown';
  }

   getClientTypeName(id: number): string {
    const ClientType = this.ClientType.find(type => type.id === id);
    return ClientType ? ClientType.name : 'Unknown';
  }

   getReligionName(id: number): string {
    const Religion = this.Religion.find(type => type.id === id);
    return Religion ? Religion.name : 'Unknown';
  }
 getImageUrl(imagePath: string): string {
    return `${environment.api}/` + imagePath;
  }
}
