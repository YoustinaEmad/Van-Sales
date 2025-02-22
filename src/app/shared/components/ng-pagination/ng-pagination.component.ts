import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ng-pagination',
  templateUrl: './ng-pagination.component.html',
  styleUrls: ['./ng-pagination.component.css'],
  
})
export class NgPaginationComponent implements OnInit {
  @Input() page: any;
  @Output() pageChange = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  onChangePageSize() {
    this.pageSizeChange.emit();
  }

  getNextPrevData(event: any) {
    this.pageChange.emit(event);
  }

  
}
