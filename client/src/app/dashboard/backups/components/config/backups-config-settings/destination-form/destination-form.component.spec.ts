import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationFormComponent } from './destination-form.component';

describe('DestinationFormComponent', () => {
  let component: DestinationFormComponent;
  let fixture: ComponentFixture<DestinationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationFormComponent]
    });
    fixture = TestBed.createComponent(DestinationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
