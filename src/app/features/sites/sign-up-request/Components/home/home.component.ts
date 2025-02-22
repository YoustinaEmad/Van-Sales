import { Component, ViewChild } from '@angular/core';
import { TabEnum } from '../../interfaces/enum/tab-enum';
import { SharedService } from 'src/app/shared/service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudIndexBaseUtils } from 'src/app/shared/classes/crud-index.utils';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CRUDIndexPage } from 'src/app/shared/models/crud-index.model';

import { SignUpRequestService } from '../../service/sign-up-request.service';
import { signUpRequestViewModel, RejectReasonViewModel } from '../../interfaces/sign-up-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent extends CrudIndexBaseUtils {
  override page: CRUDIndexPage = new CRUDIndexPage();
  override pageRoute = '/sites/signUpRequest';
  modalRef: BsModalRef;
  selectedTab: TabEnum = TabEnum.NewRequests;
  TabEnum = TabEnum;
  override items: signUpRequestViewModel[] = [];
  status: string = 'pending';
  selectedItem: RejectReasonViewModel=new RejectReasonViewModel();
 id:string;
  verifyStatus = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Verified' },
    { id: 3, name: 'Approve' },
    { id: 4, name: 'Reject' },

  ];
  Tabs = [
    {
      ID: 1,
      name: 'New Requests',
      icon: '/assets/icons/Vector1.png',
      selectedIcon: '/assets/icons/Vector1.png',
      isSelected: true,
    },
    {
      ID: 2,
      name: 'Old Request',
      icon: '/assets/icons/Vector2.png',
      selectedIcon: '/assets/icons/Vector2.png',
      isSelected: false,
    },

  ];
  constructor(
    public override _sharedService: SharedService,
    private _profileRequestService: SignUpRequestService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    super(_sharedService);
  }


  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((tab) => {
      tab.isSelected = tab.ID === tabID;
    });
  
    if (this.selectedTab === TabEnum.NewRequests) {
      this.items = this.items.filter(item => item.verifyStatus === 1); // Pending
      this.initializePage();
    } else if (this.selectedTab === TabEnum.OldRequest) {
      this.items = this.items.filter(item => item.verifyStatus !== 1);
      this.getApprovedAndReject() // Approved or Rejected
    }
  }
  

  ngOnInit(): void {
    this.initializePage();
  }
  getApprovedAndReject() {
    this._profileRequestService.getApprovedAndReject(
      this.searchViewModel,
      this.page.orderBy,
      this.page.isAscending,
      this.page.options.currentPage,
      this.page.options.itemsPerPage
    ).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response);
        this.items = response.data.items as signUpRequestViewModel[];
        console.log(this.page)
        console.log(response)

        this.items.forEach(item => {
          if (!item.verifyStatus) {
            item.verifyStatus = this.verifyStatus[0].id; // Default to the first status
          }
        });
      }
      this.fireEventToParent();
    });
  }
 
  initializePage() {
    this.page.columns = [
      { Name: "No", Title: "#", Selectable: true, Sortable: false },
      { Name: "clientNumber", Title: "Client Mobile", Selectable: false, Sortable: true },
      { Name: "name", Title: "Client Name", Selectable: false, Sortable: true },
      { Name: "nationalNumber", Title: "National Number", Selectable: false, Sortable: true },
      { Name: "", Title: "Action", Selectable: false, Sortable: true },
    ];
    
    this._profileRequestService.get(
      this.searchViewModel,
      this.page.orderBy,
      this.page.isAscending,
      this.page.options.currentPage,
      this.page.options.itemsPerPage
    ).subscribe(response => {
      this.page.isSearching = false;
      if (response.isSuccess) {
        this.page.isAllSelected = false;
        this.confingPagination(response);
        this.items = response.data.items as signUpRequestViewModel[];
        

      
        this.items.forEach(item => {
          if (!item.verifyStatus) {
            item.verifyStatus = this.verifyStatus[0].id; // Default to the first status
          }
        });
      }
      this.fireEventToParent();
    });
  


  }
  getClientStatusName(statusId: number): string {
    const status = this.verifyStatus.find(s => s.id === Number(statusId));
    return status ? status.name : 'Unknown';
  }


  approveRequest(item: signUpRequestViewModel, newStatus: string) {
      this._profileRequestService.Approved(item.id).subscribe({
        next: (response) => {
          this.page.isSaving = false;
          if (response.isSuccess) {
            console.log(response);
            this._sharedService.showToastr(response);
            this.initializePage();
            this.status='Approved'
          }
        },
        error: (error) => {
          this.page.isSaving = false;
          this._sharedService.showToastr(error);
        }
      })
    }
  
  

 
  viewRequest(id: string) {
    this._router.navigate(['/sites/signUpRequest/details', id]);
  }



  @ViewChild('confirmRejectTemplate', { static: false }) confirmRejectTemplate: any;
  showRejectConfirmation(Item:signUpRequestViewModel) {
    this.selectedItem = new RejectReasonViewModel();
    this.selectedItem.id=Item.id;
    this.modalRef = this._sharedService.modalService.show(this.confirmRejectTemplate, { class: 'modal-sm' });
  }

  rejectRequest() {
    this._profileRequestService.Rejected(this.selectedItem).subscribe({
      next: (response) => {
        this.page.isSaving = false;
        if (response.isSuccess) {
          this._sharedService.showToastr(response);
          this.initializePage();
          this.status='Rejected'
        }
      },
      error: (error) => {
        this.page.isSaving = false;
        this._sharedService.showToastr(error);
      }
    })
  }

}
