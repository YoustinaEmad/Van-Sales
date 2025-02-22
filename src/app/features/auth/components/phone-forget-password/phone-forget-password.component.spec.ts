import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneForgetPasswordComponent } from './phone-forget-password.component';

describe('PhoneForgetPasswordComponent', () => {
  let component: PhoneForgetPasswordComponent;
  let fixture: ComponentFixture<PhoneForgetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneForgetPasswordComponent]
    });
    fixture = TestBed.createComponent(PhoneForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
