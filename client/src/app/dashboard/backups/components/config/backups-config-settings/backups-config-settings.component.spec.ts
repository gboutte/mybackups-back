import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsConfigSettingsComponent } from './backups-config-settings.component';

describe('BackupsConfigSettingsComponent', () => {
  let component: BackupsConfigSettingsComponent;
  let fixture: ComponentFixture<BackupsConfigSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackupsConfigSettingsComponent],
    });
    fixture = TestBed.createComponent(BackupsConfigSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
