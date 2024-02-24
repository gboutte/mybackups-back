import {Component, OnInit} from '@angular/core';
import {BackupsService} from "../../../services/backups.service";
import {ModalService} from "@gboutte/glassui";
import {TranslateService} from "@ngx-translate/core";
import {BackupConfig} from "../../../models/config/backup-config.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SourceFormComponent} from "./source-form/source-form.component";
import {DestinationFormComponent} from "./destination-form/destination-form.component";

@Component({
  selector: 'mb-backups-config-settings',
  templateUrl: './backups-config-settings.component.html',
  styleUrls: ['./backups-config-settings.component.scss']
})
export class BackupsConfigSettingsComponent implements OnInit{
  private backupsService: BackupsService;
  private modalService: ModalService;
  private translate: TranslateService;
  private route: ActivatedRoute;
  private router: Router;

  backupConfig!: BackupConfig;
  constructor(
    route: ActivatedRoute,
    backupsService: BackupsService,
    modalService:ModalService,
    translate:TranslateService,
    router: Router,
  ) {
    this.backupsService = backupsService;
    this.modalService = modalService;
    this.translate = translate;
    this.route = route;
    this.router = router;
  }

  ngOnInit(): void {
    this.addSource();
    if(this.route.snapshot.params['id'] !== undefined){
      this.backupsService.getBackupConfig(this.route.snapshot.params['id']).subscribe((config: BackupConfig) => {
        this.backupConfig = config;
      });
    }else{
      this.router.navigate(['dashboard','backups']);
    }
  }

  addSource(){
    this.modalService.open(SourceFormComponent,{
      title: this.translate.instant('dashboard.backups-settings.modal.source.add.title'),
    }).subscribe({

    });

  }
  addDestination(){

    this.modalService.open(DestinationFormComponent,{
      title: this.translate.instant('dashboard.backups-settings.modal.destination.add.title'),
    }).subscribe({

    });
  }
}
