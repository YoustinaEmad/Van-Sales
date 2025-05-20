import { Component } from '@angular/core';
import { TabEnum } from '../../interface/enum/tab-enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedTab: TabEnum = TabEnum.Actual;
  TabEnum = TabEnum;
  Tabs = [
    {
      ID: 1,
      name: 'Actual',
      
      isSelected: true,
    },
    {
      ID: 2,
      name: 'Planned',
      
      isSelected: false,
    },

  ];

repeatedRequests = [
    {
      name: 'احمد محمود',
      id: 3989586,
      routes: [
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' }
      ]
    },
    {
      name: 'احمد محمود',
      id: 3989586,
      routes: [
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'لم تتم', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' },
        { status: 'تمت', date: '09/06/2025', client: 'العالمية لتجارة الزيوت' }
      ]
    }
  ];
  switchTab(tabID: number) {
    this.selectedTab = tabID;
    this.Tabs.forEach((tab) => {
      tab.isSelected = tab.ID === tabID;
    });
  
    if (this.selectedTab === TabEnum.Actual) {
     // this.items = this.items.filter(item => item.verifyStatus === 1); // Pending
     // this.initializePage();
    } else if (this.selectedTab === TabEnum.Planned) {
     // this.items = this.items.filter(item => item.verifyStatus !== 1);
      //.getApprovedAndReject() // Approved or Rejected
    }
  }
  
}
