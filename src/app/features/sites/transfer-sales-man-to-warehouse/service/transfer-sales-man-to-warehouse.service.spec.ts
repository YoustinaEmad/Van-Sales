import { TestBed } from '@angular/core/testing';

import { TransferSalesManToWarehouseService } from './transfer-sales-man-to-warehouse.service';

describe('TransferSalesManToWarehouseService', () => {
  let service: TransferSalesManToWarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferSalesManToWarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
