import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupConfigFormComponent } from './backup-config-form.component';

describe('BackupConfigFormComponent', () => {
  let component: BackupConfigFormComponent;
  let fixture: ComponentFixture<BackupConfigFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BackupConfigFormComponent],
});
    fixture = TestBed.createComponent(BackupConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
