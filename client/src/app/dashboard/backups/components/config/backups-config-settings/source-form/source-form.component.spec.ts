import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceFormComponent } from './source-form.component';

describe('SourceFormComponent', () => {
  let component: SourceFormComponent;
  let fixture: ComponentFixture<SourceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceFormComponent]
    });
    fixture = TestBed.createComponent(SourceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
