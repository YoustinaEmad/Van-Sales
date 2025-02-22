import { TestBed } from '@angular/core/testing';

import { DesignerServiceService } from './designer-service.service';

describe('DesignerServiceService', () => {
  let service: DesignerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
