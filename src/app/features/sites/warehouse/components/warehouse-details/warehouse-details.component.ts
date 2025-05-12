import { Component } from '@angular/core';
import { warehouseDetailsViewModel } from '../../interfaces/warehouse-view-model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/shared/service/api.service';
import { WarehouseService } from '../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-details',
  templateUrl: './warehouse-details.component.html',
  styleUrls: ['./warehouse-details.component.css']
})
export class WarehouseDetailsComponent {
  warehouse: warehouseDetailsViewModel | null = null;
  isLoading = true;

WarehouseType = [
    { id: 1, name: "MainBranch" },
    { id: 2, name: "SubBranch" }
  ];

   constructor(private route: ActivatedRoute, private api: ApiService,private _WarehouseService:WarehouseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getWarehouseDetails(id);
    }
  }

 getWarehouseTypeName(id: number): string {
    const warehouseType = this.WarehouseType.find(type => type.id === id);
    return warehouseType ? warehouseType.name : 'Unknown';
  }
getWarehouseDetails(ID: string) {
  this._WarehouseService.getWarehouseDetails(ID).subscribe((res) => {
    this.warehouse = res.data;
    this.isLoading = false;
  });
}

}
