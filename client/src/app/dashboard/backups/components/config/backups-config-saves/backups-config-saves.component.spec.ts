import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsConfigSavesComponent } from './backups-config-saves.component';

describe('BackupsConfigSavesComponent', () => {
  let component: BackupsConfigSavesComponent;
  let fixture: ComponentFixture<BackupsConfigSavesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BackupsConfigSavesComponent],
});
    fixture = TestBed.createComponent(BackupsConfigSavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
