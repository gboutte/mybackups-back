import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, map, tap } from 'rxjs';
import { deserialize, serialize } from 'serializr';
import { Serialized } from 'serializr/lib/core/serialize';
import { AbstractService } from '../../../global/abstract.service';
import { cleanDataOfNull } from '../../../global/clean-data-of-null';
import { BackupConfigCreateDto } from '../dto/backup-config-create.dto';
import { BackupConfigDestinationDto } from '../dto/backup-config-destination.dto';
import { BackupConfigSourceDto } from '../dto/backup-config-source.dto';
import { BackupConfigUpdateDto } from '../dto/backup-config-update.dto';
import { BackupConfigDestination } from '../models/config/backup-config-destination.model';
import { BackupConfigSource } from '../models/config/backup-config-source.model';
import { BackupConfig } from '../models/config/backup-config.model';
import { BackupType } from '../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../models/validation/backup-config-type-validation.model';
import { BackupsStore } from '../store/backups.store';

@Injectable()
export class BackupsService extends AbstractService {
  private backupsStore: BackupsStore = inject(BackupsStore);

  public getTypes(): Observable<BackupType[]> {
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

  public loadBackupsStore(): Observable<BackupType[]> {
    return this.getTypes().pipe(
      tap((types: BackupType[]): void => {
        this.backupsStore.types.set(types);
      }),
    );
  }

  public getBackupConfigs(): Observable<BackupConfig[]> {
    return this.httpClient
      .get<
        InstanceType<typeof BackupConfig>[]
      >(this.getUrl() + '/backups/config', this.httpOptions)
      .pipe(
        map(
          (
            backupConfigs: InstanceType<typeof BackupConfig>[],
          ): BackupConfig[] => {
            return backupConfigs.map(
              (config: InstanceType<typeof BackupConfig>) => {
                return deserialize(BackupConfig, config);
              },
            );
          },
        ),
      );
  }

  public getBackupConfig(id: string): Observable<BackupConfig> {
    return this.httpClient
      .get<
        InstanceType<typeof BackupConfig>
      >(this.getUrl() + `/backups/config/${id}`, this.httpOptions)
      .pipe(
        map((config: InstanceType<typeof BackupConfig>) => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  public createBackupConfig(
    config: BackupConfigCreateDto,
  ): Observable<BackupConfig> {
    let data: Serialized<BackupConfigCreateDto> = serialize(config);

    //remove null properties
    data = cleanDataOfNull(data);

    return this.httpClient
      .post<BackupConfig>(
        this.getUrl() + '/backups/config',
        data,
        this.httpOptions,
      )
      .pipe(
        map((config: InstanceType<typeof BackupConfig>): BackupConfig => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  public updateBackupConfig(
    config: BackupConfigUpdateDto,
  ): Observable<BackupConfig> {
    const id: string | null = config.id;
    config.id = null;

    let data: Serialized<BackupConfigUpdateDto> = serialize(config);
    //remove null properties
    data = cleanDataOfNull(data);

    return this.httpClient
      .patch<
        InstanceType<typeof BackupConfig>
      >(this.getUrl() + '/backups/config/' + id, data, this.httpOptions)
      .pipe(
        map((config: InstanceType<typeof BackupConfig>): BackupConfig => {
          return deserialize(BackupConfig, config);
        }),
      );
  }

  public validateConfigEndpoint(
    config: BackupConfigDestinationDto | BackupConfigSourceDto,
  ): Observable<BackupConfigTypeValidation> {
    let data: Serialized<BackupConfigDestinationDto | BackupConfigCreateDto> =
      serialize(config);

    //remove null properties
    data = cleanDataOfNull(data);

    return this.httpClient
      .post<
        InstanceType<typeof BackupConfigTypeValidation>
      >(this.getUrl() + '/backups/config/validate/' + (config instanceof BackupConfigSourceDto ? 'source' : 'destination'), data, this.httpOptions)
      .pipe(
        map(
          (
            res: InstanceType<typeof BackupConfigTypeValidation>,
          ): BackupConfigTypeValidation => {
            return deserialize(BackupConfigTypeValidation, res);
          },
        ),
      );
  }

  public deleteBackupConfig(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  public deleteSource(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/source/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }
  public createSource(
    idConfig: string,
    createBackupSourceDto: BackupConfigSourceDto,
  ): Observable<BackupConfigSource> {
    const data: Serialized<BackupConfigSourceDto> = serialize(
      createBackupSourceDto,
    );
    return this.httpClient
      .post<
        InstanceType<typeof BackupConfigSource>
      >(`${this.getUrl()}/backups/config/${idConfig}/source`, data, this.httpOptions)
      .pipe(
        map(
          (
            config: InstanceType<typeof BackupConfigSource>,
          ): BackupConfigSource => {
            return deserialize(BackupConfigSource, config);
          },
        ),
      );
  }

  public updateSource(
    idSource: string,
    backupSource: BackupConfigSourceDto,
  ): Observable<BackupConfigSource> {
    const data: Serialized<BackupConfigSourceDto> = serialize(backupSource);
    return this.httpClient
      .patch<
        InstanceType<typeof BackupConfigSource>
      >(`${this.getUrl()}/backups/config/source/${idSource}`, data, this.httpOptions)
      .pipe(
        map(
          (
            config: InstanceType<typeof BackupConfigSource>,
          ): BackupConfigSource => {
            return deserialize(BackupConfigSource, config);
          },
        ),
      );
  }
  public createDestination(
    idConfig: string,
    createBackupDestinationDto: BackupConfigDestinationDto,
  ): Observable<BackupConfigDestination> {
    const data: Serialized<BackupConfigDestinationDto> = serialize(
      createBackupDestinationDto,
    );
    return this.httpClient
      .post<
        InstanceType<typeof BackupConfigDestination>
      >(`${this.getUrl()}/backups/config/${idConfig}/destination`, data, this.httpOptions)
      .pipe(
        map(
          (
            config: InstanceType<typeof BackupConfigDestination>,
          ): BackupConfigDestination => {
            return deserialize(BackupConfigDestination, config);
          },
        ),
      );
  }

  public updateDestination(
    idDestination: string,
    backupDestination: BackupConfigDestinationDto,
  ): Observable<BackupConfigDestination> {
    const data: Serialized<BackupConfigDestinationDto> =
      serialize(backupDestination);
    return this.httpClient
      .patch<
        InstanceType<typeof BackupConfigDestination>
      >(`${this.getUrl()}/backups/config/destination/${idDestination}`, data, this.httpOptions)
      .pipe(
        map(
          (
            config: InstanceType<typeof BackupConfigDestination>,
          ): BackupConfigDestination => {
            return deserialize(BackupConfigDestination, config);
          },
        ),
      );
  }

  public deleteDestination(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config/destination/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  public runBackup(id: string): Observable<void> {
    return this.httpClient.post<void>(
      this.getUrl() + `/backups/config/${id}/run`,
      {},
      this.httpOptions,
    );
  }

  public downloadBackupSave(id: string): void {
    this.httpClient
      .get(this.getUrl() + `/backups/config-save/download/${id}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe((res: HttpResponse<Blob>): void => {
        const filename: string = this.getFileNameFromRequest(res);
        if (res.body !== null) {
          saveAs(res.body, filename);
        }
      });
  }

  public deleteBackupSave(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      this.getUrl() + `/backups/config-save/${id}`,
      {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
        }),
      },
    );
  }

  private getFileNameFromRequest(
    res: HttpResponse<Blob>,
    defaultFilename: string = 'unknown',
  ): string {
    if (res.headers.get('content-disposition') !== null) {
      const disposition: string | null = res.headers.get('content-disposition');
      let filename: string = defaultFilename;

      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex: RegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches: RegExpExecArray | null = filenameRegex.exec(disposition);
        if (matches !== null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      return filename;
    }
    return defaultFilename;
  }
}
