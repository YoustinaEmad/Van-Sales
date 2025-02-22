import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNdComponent } from './navbar-nd.component';

describe('NavbarNdComponent', () => {
  let component: NavbarNdComponent;
  let fixture: ComponentFixture<NavbarNdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarNdComponent]
    });
    fixture = TestBed.createComponent(NavbarNdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
