import { TestBed } from '@angular/core/testing';

import { SignUpRequestService } from './sign-up-request.service';

describe('SignUpRequestService', () => {
  let service: SignUpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
