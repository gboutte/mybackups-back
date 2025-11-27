import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as archiver from 'archiver';
import { CronJob } from 'cron';
import { ReadStream } from 'fs';
import * as mime from 'mime-types';
import * as moment from 'moment';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'os';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { AbstractType } from './backups-types/abstract-type';
import { BackupDestinationResultInterface } from './backups-types/interfaces/backup-destination-result.interface';
import { instanceOfBackupDestination } from './backups-types/interfaces/backup-destination.interface';
import { BackupParameterErrorInterface } from './backups-types/interfaces/backup-parameter-error.interface';
import { BackupSourceResultInterface } from './backups-types/interfaces/backup-source-result.interface';
import { instanceOfBackupSource } from './backups-types/interfaces/backup-source.interface';
import { BackupTypeI18nInterface } from './backups-types/interfaces/backup-type-i18n.interface';
import { BackupTypeLangType } from './backups-types/interfaces/backup-type-lang.type';
import types from './backups-types/types';
import { CreateBackupConfigDestinationDto } from './dto/create-backup-config-destination.dto';
import { CreateBackupConfigSourceDto } from './dto/create-backup-config-source.dto';
import { CreateBackupConfigDto } from './dto/create-backup-config.dto';
import { UpdateBackupConfigDestinationDto } from './dto/update-backup-config-destination.dto';
import { UpdateBackupConfigSourceDto } from './dto/update-backup-config-source.dto';
import { UpdateBackupConfigDto } from './dto/update-backup-config.dto';
import { BackupConfigDestination } from './entities/backup-config-destination.entity';
import { BackupConfigSource } from './entities/backup-config-source.entity';
import { BackupConfig } from './entities/backup-config.entity';
import { BackupSaveDestination } from './entities/backup-save-destination.entity';
import { BackupSave } from './entities/backup-save.entity';

@Injectable()
export class BackupsService {
  constructor(
    @InjectRepository(BackupConfig)
    private backupConfigRepository: Repository<BackupConfig>,
    @InjectRepository(BackupConfigSource)
    private backupConfigSourceRepository: Repository<BackupConfigSource>,
    @InjectRepository(BackupConfigDestination)
    private backupConfigDestinationRepository: Repository<BackupConfigDestination>,
    @InjectRepository(BackupSave)
    private backupSaveRepository: Repository<BackupSave>,
    @InjectRepository(BackupSaveDestination)
    private backupSaveDestinationRepository: Repository<BackupSaveDestination>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  public createConfig(
    createBackupConfigDto: CreateBackupConfigDto,
  ): Promise<BackupConfig> {
    const backupConfig: BackupConfig = this.backupConfigRepository.create(
      createBackupConfigDto,
    );
    return this.backupConfigRepository.save(backupConfig);
  }

  public async updateConfig(
    id: string,
    updateConfigDto: UpdateBackupConfigDto,
  ): Promise<BackupConfig> {
    const config: BackupConfig = await this.backupConfigRepository.preload({
      id: id,
      ...updateConfigDto,
    });

    if (!config) {
      throw new NotFoundException();
    }
    return this.backupConfigRepository.save(config);
  }

  public async createBackupDestination(
    idBackupConfig: string,
    createBackupDestination: CreateBackupConfigDestinationDto,
  ): Promise<BackupConfigDestination> {
    const backupDest: BackupConfigDestination =
      this.backupConfigDestinationRepository.create({
        config: { id: idBackupConfig },
        ...createBackupDestination,
      });

    return this.backupConfigDestinationRepository.save(backupDest);
  }

  public async createBackupSource(
    idBackupConfig: string,
    createBackupSource: CreateBackupConfigSourceDto,
  ): Promise<BackupConfigSource> {
    const backupSource: BackupConfigSource =
      this.backupConfigSourceRepository.create({
        config: { id: idBackupConfig },
        ...createBackupSource,
      });

    return this.backupConfigSourceRepository.save(backupSource);
  }
  public async updateBackupConfigSource(
    idSource: string,
    updateBackupConfigSource: UpdateBackupConfigSourceDto,
  ): Promise<BackupConfigSource> {
    const backupSource: BackupConfigSource =
      await this.backupConfigSourceRepository.preload({
        id: idSource,
        ...updateBackupConfigSource,
      });

    return this.backupConfigSourceRepository.save(backupSource);
  }
  public async updateBackupConfigDestination(
    idDest: string,
    updateBackupConfigDestinationDto: UpdateBackupConfigDestinationDto,
  ): Promise<BackupConfigDestination> {
    const backupSource: BackupConfigDestination =
      await this.backupConfigDestinationRepository.preload({
        id: idDest,
        ...updateBackupConfigDestinationDto,
      });

    return this.backupConfigDestinationRepository.save(backupSource);
  }

  public findAllConfig(): Promise<BackupConfig[]> {
    return this.backupConfigRepository.find();
  }

  public findOneConfig(id: string): Promise<BackupConfig | null> {
    return this.backupConfigRepository.findOne({ where: { id: id } });
  }

  public async removeConfig(id: string): Promise<void> {
    await this.backupConfigRepository.delete(id);
  }

  public async runBackup(backupConfig: BackupConfig): Promise<void> {
    const temporaryFiles: string[] = [];
    if (await this.validate(backupConfig)) {
      const sources: BackupConfigSource[] = backupConfig.sources;
      const results: BackupSourceResultInterface[] = [];
      for (const source of sources) {
        source.config = backupConfig;
        results.push(await this.runBackupSource(source));
      }

      temporaryFiles.push(
        ...results.map(
          (result: BackupSourceResultInterface) => result.absolutePath,
        ),
      );

      let filePath: string;
      if (results.length > 1) {
        filePath = await this.createBackupArchive(results);
        temporaryFiles.push(filePath);
      } else {
        filePath = results[0].absolutePath;
      }
      const backupSave = new BackupSave();
      backupSave.destinations = [];
      backupSave.config = backupConfig;
      backupSave.filename = path.basename(filePath);
      let mimeType: string | false = mime.lookup(filePath);

      if (!mimeType) {
        mimeType = 'application/octet-stream';
      }
      backupSave.mimetype = mimeType;

      const destinations: BackupConfigDestination[] = backupConfig.destinations;
      for (const destination of destinations) {
        destination.config = backupConfig;
        const result: BackupDestinationResultInterface =
          await this.runBackupDestination(destination, filePath);

        const backupSaveDestination: BackupSaveDestination =
          new BackupSaveDestination();
        backupSaveDestination.parameters = result.data;
        backupSaveDestination.type = destination.type;
        backupSaveDestination.save = backupSave;
        backupSave.destinations.push(backupSaveDestination);
      }

      await this.backupSaveRepository.save(backupSave);

      await this.cleanBackupConfig(backupConfig, temporaryFiles);
    }
  }

  public async getBackupFile(
    backupSave: BackupSaveDestination,
  ): Promise<ReadStream> {
    const backupType: AbstractType = await this.getBackupType(backupSave.type);
    if (instanceOfBackupDestination(backupType)) {
      return backupType.getBackup(backupSave);
    } else {
      throw new NotFoundException();
    }
  }

  public async deleteBackupFile(
    backupSave: BackupSaveDestination,
  ): Promise<boolean> {
    const backupType: AbstractType = await this.getBackupType(backupSave.type);
    if (instanceOfBackupDestination(backupType)) {
      return backupType.deleteBackup(backupSave);
    } else {
      throw new NotFoundException();
    }
  }

  public deleteBackupSaveEntity(id: string): Promise<DeleteResult> {
    return this.backupSaveRepository.delete(id);
  }
  public async deleteBackupSave(backupSave: BackupSave): Promise<DeleteResult> {
    for (const destination of backupSave.destinations) {
      await this.deleteBackupFile(destination);
    }
    return await this.deleteBackupSaveEntity(backupSave.id);
  }

  public findOneBackupSave(id: string): Promise<BackupSave | null> {
    return this.backupSaveRepository.findOne({ where: { id: id } });
  }

  public createBackupArchive(
    results: BackupSourceResultInterface[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const tmpDir: string = os.tmpdir();
      const archiveName: string =
        'backup-' + moment().format('DDMMYYYYHHmmss') + '.zip';
      const archivePath: string = path.join(tmpDir, archiveName);

      const outputStream: fs.WriteStream = fs.createWriteStream(archivePath);
      const archive: archiver.Archiver = archiver('zip', {
        zlib: { level: 9 },
      });
      outputStream.on('close', function () {
        resolve(archivePath);
      });
      archive.on('error', function (err) {
        Logger.error(err);
        reject(err);
      });

      archive.pipe(outputStream);

      for (const result of results) {
        const isDirectory: boolean = fs
          .statSync(result.absolutePath)
          .isDirectory();
        if (isDirectory) {
          archive.directory(result.absolutePath, result.temporaryFile);
        } else {
          archive.file(result.absolutePath, { name: result.temporaryFile });
        }
      }
      archive.finalize();
    });
  }

  public async cleanBackupConfig(
    backupConfig: BackupConfig,
    temporaryFiles: string[] = [],
  ): Promise<void> {
    // We delete all the temporary files
    for (const temporaryFile of temporaryFiles) {
      if (fs.existsSync(temporaryFile)) {
        const isDirectory: boolean = fs.statSync(temporaryFile).isDirectory();
        if (isDirectory) {
          fs.rmSync(temporaryFile, { recursive: true });
        } else {
          fs.unlinkSync(temporaryFile);
        }
      }
    }

    // We delete all the saves over the limit
    const maxSaves = backupConfig.to_keep;
    Logger.debug(`Max save ${maxSaves} / ${backupConfig.saves.length + 1}`);
    if (backupConfig.saves.length + 1 > maxSaves) {
      let savesToDelete: BackupSave[] = backupConfig.saves;
      savesToDelete = savesToDelete
        .sort((a: BackupSave, b: BackupSave): number => {
          return a.date_created.getTime() - b.date_created.getTime();
        })
        .slice(0, savesToDelete.length - (maxSaves - 1));
      Logger.debug(`Saves to delete ${savesToDelete.length}`);
      for (const save of savesToDelete) {
        await this.deleteBackupSave(save);
      }
    }
  }

  public async validate(backupConfig: BackupConfig): Promise<boolean> {
    const errors = [];

    // Verification of the sources
    const sources = backupConfig.sources;
    for (const source of sources) {
      errors.push(...(await this.validateSourceConfig(source)));
    }

    // Verification of the destinations
    const destinations = backupConfig.destinations;
    for (const destination of destinations) {
      errors.push(...(await this.validateDestinationConfig(destination)));
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return true;
  }

  public async validateSourceConfig(
    source: CreateBackupConfigSourceDto | BackupConfigSource,
  ): Promise<BackupParameterErrorInterface[]> {
    const errors: BackupParameterErrorInterface[] = [];
    const backupType = await this.getBackupType(source.type);
    if (instanceOfBackupSource(backupType)) {
      // We verify that all the required parameters are present
      const sourceParameters = backupType.getSourceParameters();

      for (const parameter of sourceParameters) {
        if (parameter.required && !source.parameters[parameter.code]) {
          const parameterError: BackupParameterErrorInterface = {
            parameter: parameter.code,
            message: `This parameter: "${parameter.code}" is required.`, //@todo i18n
          };
          errors.push(parameterError);
        }
      }
      if (errors.length === 0) {
        backupType.setParameters(source.parameters);
        const validationResult = backupType.validateSourceParameters();
        if (validationResult !== true) {
          errors.push(...validationResult);
        }
      }
    }
    return errors;
  }

  public async validateDestinationConfig(
    destination: CreateBackupConfigDestinationDto | BackupConfigDestination,
  ): Promise<BackupParameterErrorInterface[]> {
    const errors: BackupParameterErrorInterface[] = [];
    const backupType = await this.getBackupType(destination.type);
    if (instanceOfBackupDestination(backupType)) {
      // We verify that all the required parameters are present
      const destinationParameters = backupType.getDestinationParameters();

      for (const parameter of destinationParameters) {
        if (parameter.required && !destination.parameters[parameter.code]) {
          const parameterError: BackupParameterErrorInterface = {
            parameter: parameter.code,
            message: `This parameter: "${parameter.code}" is required.`, //@todo i18n
          };
          errors.push(parameterError);
        }
      }
      if (errors.length === 0) {
        backupType.setParameters(destination.parameters);
        const validationResult = backupType.validateDestinationParameters();
        if (validationResult !== true) {
          errors.push(...validationResult);
        }
      }
    }
    return errors;
  }

  public async getBackupType(code: string): Promise<AbstractType> {
    const backupTypes = await types.getTypes();
    for (const backupType of backupTypes) {
      if (backupType.getConfig().code === code) {
        return backupType;
      }
    }
    throw new NotFoundException();
  }

  private async runBackupSource(
    source: BackupConfigSource,
  ): Promise<BackupSourceResultInterface> {
    const backupType = await this.getBackupType(source.type);
    if (instanceOfBackupSource(backupType)) {
      backupType.setParameters(source.parameters);
      backupType.setConfigName(source.config.name);
      return backupType.doSource();
    }
  }

  private async runBackupDestination(
    destination: BackupConfigDestination,
    fileAbsolutePath: string,
  ): Promise<BackupDestinationResultInterface> {
    const backupType = await this.getBackupType(destination.type);
    if (instanceOfBackupDestination(backupType)) {
      backupType.setParameters(destination.parameters);
      backupType.setConfigName(destination.config.name);
      return backupType.doDestination(fileAbsolutePath);
    }
  }

  public async getI18n(
    lang: BackupTypeLangType,
  ): Promise<Record<string, BackupTypeI18nInterface>> {
    const i18n: Record<string, BackupTypeI18nInterface> = {};
    const backupTypes = await types.getTypes();
    for (const backupType of backupTypes) {
      i18n[backupType.getConfig().code] = backupType.getI18n(lang);
    }
    return i18n;
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.backupConfigRepository.delete(id);
  }

  public deleteSource(id: string): Promise<DeleteResult> {
    return this.backupConfigSourceRepository.delete(id);
  }

  public deleteDestination(id: string): Promise<DeleteResult> {
    return this.backupConfigDestinationRepository.delete(id);
  }

  public async refreshCron(): Promise<void> {
    Logger.log('Refreshing cron', 'CRON');
    const currentCrons: Map<string, CronJob> =
      this.schedulerRegistry.getCronJobs();

    const configs: BackupConfig[] = await this.findAllConfig();

    //Delete all cron
    const cronKeys: string[] = Array.from(currentCrons.keys());

    for (const cronKey of cronKeys) {
      const cron = currentCrons.get(cronKey);
      if (cron) {
        this.schedulerRegistry.deleteCronJob(cronKey);
      }
    }

    //Create all cron
    for (const config of configs) {
      if (config.enabled) {
        const cron = new CronJob(config.frequency, () => {
          Logger.log(`Running config ${config.name} - ${config.id}`, 'CRON');
          this.runBackup(config);
        });
        this.schedulerRegistry.addCronJob(config.id, cron);
        cron.start();
      }
    }
  }
}
