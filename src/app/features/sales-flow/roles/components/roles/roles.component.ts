import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';
import { RoleService } from '../../service/role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
 page: CRUDIndexPage = new CRUDIndexPage();

constructor(private _router:Router,private _roleService:RoleService){}

 RolesEnum = [
  { id: 1, name: 'SuperAdmin' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Company' },
  { id: 4, name: 'Client' },
];

viewRoleDetails(id: string){

  this._router.navigate(['/salesflow/roles/roleDetails',id]);

  // this._roleService.getRoleById(id).subscribe({
  //   next: (res) => {
  //     if (res.isSuccess) {
  //       //this.item = res.data;
  //       //this.item.id = this.id;
  //       //this.editeform();
  //       console.log(res.data);
  //       this.page.isPageLoaded = true;
  //      // this._router.navigate(['/salesflow/roles/roleDetails',id]);

  //     }
  //   },
  //   error: (err) => {
  //    // this._sharedService.showToastr(err);
  //     this.page.isPageLoaded = true;
  //   }
  // });
  // this._router.navigate(['/salesflow/roles/roleDetails',id]);
}


}
