import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRootComponent } from './dashboard-root.component';

describe('DashboardRootComponent', () => {
  let component: DashboardRootComponent;
  let fixture: ComponentFixture<DashboardRootComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardRootComponent]
    });
    fixture = TestBed.createComponent(DashboardRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
