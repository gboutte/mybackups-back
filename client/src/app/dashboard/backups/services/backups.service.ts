import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, map } from 'rxjs';
import { deserialize, serialize } from 'serializr';
import { AbstractService } from '../../../global/abstract.service';
import { cleanDataOfNull } from '../../../global/clean-data-of-null';
import { BackupConfigDestination } from '../models/config/backup-config-destination.model';
import { BackupConfigSource } from '../models/config/backup-config-source.model';
import { BackupConfig } from '../models/config/backup-config.model';
import { BackupType } from '../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../models/validation/backup-config-type-validation.model';
import { BackupsStore } from '../store/backups.store';

@Injectable()
export class BackupsService extends AbstractService {
  private backupsStore: BackupsStore;
  constructor(httpClient: HttpClient, backupStore: BackupsStore) {
    super(httpClient);
    this.backupsStore = backupStore;
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

  loadBackupsStore(): Observable<BackupType[]> {
    return this.getTypes().pipe(
      map((types) => {
        this.backupsStore.types.set(types);
        return types;
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

    //remove date to source and destination
    config.sources.forEach((source) => {
      source.date_created = null;
    });
    config.destinations.forEach((destination) => {
      destination.date_created = null;
    });

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

  validateConfigEndpoint(
    config: BackupConfigSource | BackupConfigDestination,
  ): Observable<BackupConfigTypeValidation> {
    let data = serialize(config);

    //remove null properties
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);

    return this.httpClient
      .post<any>(
        this.getUrl() +
          '/backups/config/validate/' +
          (config instanceof BackupConfigSource ? 'source' : 'destination'),
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

  deleteBackupConfig(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  deleteSource(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/source/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  deleteDestination(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/destination/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  runBackup(id: string): Observable<void> {
    return this.httpClient.post<void>(
      this.getUrl() + `/backups/config/${id}/run`,
      {},
      this.httpOptions,
    );
  }

  downloadBackup(id: string) {
    this.httpClient
      .get(this.getUrl() + `/backups/config-save/download/${id}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe((res) => {
        const filename = this.getFileNameFromRequest(res);
        if (res.body !== null) {
          saveAs(res.body, filename);
        }
      });
  }

  getFileNameFromRequest(
    res: HttpResponse<Blob>,
    defaultFilename: string = 'unknown',
  ) {
    if (res.headers.get('content-disposition') !== null) {
      let disposition = res.headers.get('content-disposition');
      let filename = defaultFilename;

      if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches !== null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      return filename;
    }
    return defaultFilename;
  }
}
