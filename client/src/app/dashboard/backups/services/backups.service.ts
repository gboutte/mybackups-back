import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize, serialize } from 'serializr';
import { AbstractService } from '../../../global/abstract.service';
import { cleanDataOfNull } from '../../../global/clean-data-of-null';
import { BackupConfigSource } from '../models/config/backup-config-source.model';
import { BackupConfig } from '../models/config/backup-config.model';
import { BackupType } from '../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../models/validation/backup-config-type-validation.model';

@Injectable()
export class BackupsService extends AbstractService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getTypes(): Observable<BackupType[]> {
    return this.httpClient
      .get<BackupType[]>(this.getUrl() + '/backups/types', this.httpOptions)
      .pipe(
        map((backupTypes: BackupType[]) => {
          return backupTypes.map((type: BackupType) => {
            return deserialize(BackupType, type);
          });
        }),
      );
  }

  getBackupConfigs(): Observable<BackupConfig[]> {
    return this.httpClient
      .get<BackupConfig[]>(this.getUrl() + '/backups/config', this.httpOptions)
      .pipe(
        map((backupConfigs: BackupConfig[]) => {
          return backupConfigs.map((config: BackupConfig) => {
            return deserialize(BackupConfig, config);
          });
        }),
      );
  }

  getBackupConfig(id: string): Observable<BackupConfig> {
    return this.httpClient
      .get<BackupConfig>(
        this.getUrl() + `/backups/config/${id}`,
        this.httpOptions,
      )
      .pipe(
        map((config: BackupConfig) => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  createBackupConfig(config: BackupConfig): Observable<BackupConfig> {
    let data = serialize(config);

    //remove null properties
    data = cleanDataOfNull(data);

    return this.httpClient
      .post<BackupConfig>(
        this.getUrl() + '/backups/config',
        data,
        this.httpOptions,
      )
      .pipe(
        map((config: BackupConfig) => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  updateBackupConfig(config: BackupConfig): Observable<BackupConfig> {
    const id = config.id;
    config.id = null;
    config.date_created = null;
    let data = serialize(config);
    //remove null properties
    data = cleanDataOfNull(data);

    return this.httpClient
      .patch<BackupConfig>(
        this.getUrl() + '/backups/config/' + id,
        data,
        this.httpOptions,
      )
      .pipe(
        map((config: BackupConfig) => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  validateConfig(config: BackupConfig): Observable<any> {
    let data = serialize(config);

    //remove null properties
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

    return this.httpClient
      .post<any>(
        this.getUrl() + '/backups/config/validate',
        data,
        this.httpOptions,
      )
      .pipe(
        map((res: any) => {
          return serialize(BackupConfigTypeValidation, res);
        }),
      );
  }
  validateConfigSource(
    config: BackupConfigSource,
  ): Observable<BackupConfigTypeValidation> {
    let data = serialize(config);

    //remove null properties
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

    return this.httpClient
      .post<any>(
        this.getUrl() + '/backups/config/validate/source',
        data,
        this.httpOptions,
      )
      .pipe(
        map((res: any) => {
          return serialize(BackupConfigTypeValidation, res);
        }),
      );
  }

  patchBackupConfig(
    id: string,
    config: BackupConfig,
  ): Observable<BackupConfig> {
    let data = serialize(config);

    //remove null properties
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

    return this.httpClient
      .patch<BackupConfig>(
        this.getUrl() + `/backups/config/${id}`,
        data,
        this.httpOptions,
      )
      .pipe(
        map((config: BackupConfig) => {
          return deserialize(BackupConfig, config);
        }),
      );
  }
}
