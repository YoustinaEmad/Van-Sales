import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { SharedService } from '../../service/shared.service';


@Component({
  selector: 'app-table-skelton',
  templateUrl: './table-skelton.component.html',
  styleUrls: ['./table-skelton.component.css'],
})
export class TableSkeltonComponent  implements OnChanges{
  
  constructor( public _sharedService: SharedService) {
    }
  @Input() columns: [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.columns = changes['columns']?.currentValue;
    }
  }
}
