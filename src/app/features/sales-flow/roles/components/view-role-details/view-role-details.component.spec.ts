import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleDetailsComponent } from './view-role-details.component';

describe('ViewRoleDetailsComponent', () => {
  let component: ViewRoleDetailsComponent;
  let fixture: ComponentFixture<ViewRoleDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRoleDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
