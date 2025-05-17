import { TestBed } from '@angular/core/testing';

import { WarehouseToSalesmanServiceService } from './warehouse-to-salesman-service.service';

describe('WarehouseToSalesmanServiceService', () => {
  let service: WarehouseToSalesmanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseToSalesmanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
