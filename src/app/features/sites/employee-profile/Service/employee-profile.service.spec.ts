import { TestBed } from '@angular/core/testing';

import { EmployeeProfileService } from './employee-profile.service';

describe('EmployeeProfileService', () => {
  let service: EmployeeProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
