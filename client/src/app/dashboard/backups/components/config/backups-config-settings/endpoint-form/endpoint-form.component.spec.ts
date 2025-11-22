import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointFormComponent } from './endpoint-form.component';

describe('SourceFormComponent', () => {
  let component: EndpointFormComponent;
  let fixture: ComponentFixture<EndpointFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [EndpointFormComponent],
});
    fixture = TestBed.createComponent(EndpointFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
