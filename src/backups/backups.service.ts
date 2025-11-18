import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as archiver from 'archiver';
import { ReadStream } from 'fs';
import * as mime from 'mime-types';
import * as moment from 'moment';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'os';
import { Repository } from 'typeorm';
import { AbstractType } from './backups-types/abstract-type';
import { instanceOfBackupDestination } from './backups-types/interfaces/backup-destination.interface';
import { BackupParameterErrorInterface } from './backups-types/interfaces/backup-parameter-error.interface';
import { BackupSourceResultInterface } from './backups-types/interfaces/backup-source-result.interface';
import { instanceOfBackupSource } from './backups-types/interfaces/backup-source.interface';
import { BackupTypeLangType } from './backups-types/interfaces/backup-type-lang.type';
import types from './backups-types/types';
import { LocalType } from './backups-types/types/implementations/local-type';
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
  ) {}

  createConfig(createBackupConfigDto: CreateBackupConfigDto) {
    const backupConfig = this.backupConfigRepository.create(
      createBackupConfigDto,
    );
    return this.backupConfigRepository.save(backupConfig);
  }

  async updateConfig(id: string, updateConfigDto: UpdateBackupConfigDto) {
    const config = await this.backupConfigRepository.preload({
      id: id,
      ...updateConfigDto,
    });

    if (!config) {
      throw new NotFoundException();
    }
    return this.backupConfigRepository.save(config);
  }

  async createBackupDestination(
    idBackupConfig: string,
    createBackupDestination: CreateBackupConfigDestinationDto,
  ) {
    const backupDest = await this.backupConfigDestinationRepository.create({
      config: { id: idBackupConfig },
      ...createBackupDestination,
    });

    return this.backupConfigDestinationRepository.save(backupDest);
  }

  async createBackupSource(
    idBackupConfig: string,
    createBackupSource: CreateBackupConfigSourceDto,
  ) {
    const backupSource = await this.backupConfigSourceRepository.create({
      config: { id: idBackupConfig },
      ...createBackupSource,
    });

    return this.backupConfigSourceRepository.save(backupSource);
  }
  async updateBackupConfigSource(
    idSource: string,
    updateBackupConfigSource: UpdateBackupConfigSourceDto,
  ) {
    const backupSource = await this.backupConfigSourceRepository.preload({
      id: idSource,
      ...updateBackupConfigSource,
    });

    return this.backupConfigSourceRepository.save(backupSource);
  }
  async updateBackupConfigDestination(
    idDest: string,
    updateBackupConfigDestinationDto: UpdateBackupConfigDestinationDto,
  ) {
    const backupSource = await this.backupConfigDestinationRepository.preload({
      id: idDest,
      ...updateBackupConfigDestinationDto,
    });

    return this.backupConfigDestinationRepository.save(backupSource);
  }

  findAllConfig(): Promise<BackupConfig[]> {
    return this.backupConfigRepository.find();
  }

  findOneConfig(id: string): Promise<BackupConfig> {
    return this.backupConfigRepository.findOne({ where: { id: id } });
  }

  async removeConfig(id: string): Promise<void> {
    await this.backupConfigRepository.delete(id);
  }

  async runBackup(backupConfig: BackupConfig) {
    const temporaryFiles: string[] = [];
    if (this.validate(backupConfig)) {
      const sources = backupConfig.sources;
      const results: BackupSourceResultInterface[] = [];
      for (const source of sources) {
        source.config = backupConfig;
        results.push(await this.runBackupSource(source));
      }

      temporaryFiles.push(...results.map((result) => result.absolutePath));

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
      let mimeType = mime.lookup(filePath);

      if(!mimeType){
        mimeType = 'application/octet-stream';
      }
      backupSave.mimetype = mimeType

      const destinations = backupConfig.destinations;
      for (const destination of destinations) {
        destination.config = backupConfig;
        const result = await this.runBackupDestination(destination, filePath);

        const backupSaveDestination = new BackupSaveDestination();
        backupSaveDestination.parameters = result.data;
        backupSaveDestination.type = destination.type;
        backupSaveDestination.save = backupSave;
        backupSave.destinations.push(backupSaveDestination);
      }

      this.backupSaveRepository.save(backupSave);

      await this.cleanBackupConfig(backupConfig, temporaryFiles);
    }
  }

  async getBackupFile(backupSave: BackupSaveDestination): Promise<ReadStream> {
    const backupType = this.getBackupType(backupSave.type);
    if (instanceOfBackupDestination(backupType)) {
      return backupType.getBackup(backupSave);
    } else {
      throw new NotFoundException();
    }
  }

  async deleteBackupFile(backupSave: BackupSaveDestination): Promise<boolean> {
    const backupType = this.getBackupType(backupSave.type);
    if (instanceOfBackupDestination(backupType)) {
      return backupType.deleteBackup(backupSave);
    } else {
      throw new NotFoundException();
    }
  }

  deleteBackupSaveEntity(id: string) {
    return this.backupSaveRepository.delete(id);
  }
  async deleteBackupSave(backupSave: BackupSave) {
    for (const destination of backupSave.destinations) {
      await this.deleteBackupFile(destination);
    }
    await this.deleteBackupSaveEntity(backupSave.id);
  }

  findOneBackupSave(id: string): Promise<BackupSave> {
    return this.backupSaveRepository.findOne({ where: { id: id } });
  }

  createBackupArchive(results: BackupSourceResultInterface[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const tmpDir = os.tmpdir();
      const archiveName =
        'backup-' + moment().format('DDMMYYYYHHmmss') + '.zip';
      const archivePath = path.join(tmpDir, archiveName);

      const outputStream = fs.createWriteStream(archivePath);
      const archive = archiver('zip', {
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
        const isDirectory:boolean = fs.statSync(result.absolutePath).isDirectory();
        if(isDirectory){
          archive.directory(result.absolutePath, result.temporaryFile);
        }else {
          archive.file(result.absolutePath, {name: result.temporaryFile});
        }
      }
      archive.finalize();
    });
  }

  async cleanBackupConfig(
    backupConfig: BackupConfig,
    temporaryFiles: string[] = [],
  ) {
    // We delete all the temporary files
    for (const temporaryFile of temporaryFiles) {
      if (fs.existsSync(temporaryFile)) {
        const isDirectory:boolean = fs.statSync(temporaryFile).isDirectory();
        if(isDirectory){
          fs.rmSync(temporaryFile,{recursive:true});
        }else{
          fs.unlinkSync(temporaryFile);
        }
      }
    }

    // We delete all the saves over the limit
    const maxSaves = backupConfig.to_keep;
    if (backupConfig.saves.length + 1 > maxSaves) {
      let savesToDelete = backupConfig.saves;
      savesToDelete = savesToDelete
        .sort((a, b) => {
          return a.date_created.getTime() - b.date_created.getTime();
        })
        .slice(0, savesToDelete.length - (maxSaves - 1));
      for (const save of savesToDelete) {
        await this.deleteBackupSave(save);
      }
    }
  }

  validate(backupConfig: BackupConfig) {
    const errors = [];

    // Verification of the sources
    const sources = backupConfig.sources;
    for (const source of sources) {
      errors.push(...this.validateSourceConfig(source));
    }

    // Verification of the destinations
    const destinations = backupConfig.destinations;
    for (const destination of destinations) {
      errors.push(...this.validateDestinationConfig(destination));
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return true;
  }

  validateSourceConfig(
    source: CreateBackupConfigSourceDto | BackupConfigSource,
  ): BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const backupType = this.getBackupType(source.type);
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

  validateDestinationConfig(
    destination: CreateBackupConfigDestinationDto | BackupConfigDestination,
  ): BackupParameterErrorInterface[] {
    const errors: BackupParameterErrorInterface[] = [];
    const backupType = this.getBackupType(destination.type);
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

  getBackupType(code: string): AbstractType {
    // @todo implement this method
    return new LocalType();
  }

  private runBackupSource(
    source: BackupConfigSource,
  ): Promise<BackupSourceResultInterface> {
    const backupType = this.getBackupType(source.type);
    if (instanceOfBackupSource(backupType)) {
      backupType.setParameters(source.parameters);
      backupType.setConfigName(source.config.name);
      return backupType.doSource();
    }
  }

  private runBackupDestination(
    destination: BackupConfigDestination,
    fileAbsolutePath: string,
  ) {
    const backupType = this.getBackupType(destination.type);
    if (instanceOfBackupDestination(backupType)) {
      backupType.setParameters(destination.parameters);
      backupType.setConfigName(destination.config.name);
      return backupType.doDestination(fileAbsolutePath);
    }
  }

  public async getI18n(lang: BackupTypeLangType): Promise<any> {
    let i18n: any = {};
    const backupTypes = await types.getTypes();
    for (const backupType of backupTypes) {
      i18n[backupType.getConfig().code] = backupType.getI18n(lang);
    }
    return i18n;
  }

  delete(id: string) {
    return this.backupConfigRepository.delete(id);
  }

  deleteSource(id: string) {
    return this.backupConfigSourceRepository.delete(id);
  }

  deleteDestination(id: string) {
    return this.backupConfigDestinationRepository.delete(id);
  }
}
