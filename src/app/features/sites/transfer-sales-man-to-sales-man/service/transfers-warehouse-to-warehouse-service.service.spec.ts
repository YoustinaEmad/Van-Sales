import { TestBed } from '@angular/core/testing';

import { TransfersWarehouseToWarehouseServiceService } from './transfers-warehouse-to-warehouse-service.service';

describe('TransfersWarehouseToWarehouseServiceService', () => {
  let service: TransfersWarehouseToWarehouseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransfersWarehouseToWarehouseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
